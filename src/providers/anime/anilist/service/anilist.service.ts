import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { getAnilistFindUnique } from '../utils/anilist-helper.js';
import { AnilistFetchService } from './helper/anilist.fetch.service.js';
import { MediaType } from '../filter/Filter.js';
import { AnilistUtilService } from './helper/anilist.util.service.js';
import { ShikimoriService } from '../../shikimori/service/shikimori.service.js';
import { KitsuService } from '../../kitsu/service/kitsu.service.js';
import { AnilistWithRelations, AnilistResponse } from '../types/types.js';
import { AnilistSaveService } from './helper/anilist.save.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';
import { id } from 'date-fns/locale';
import Config from '../../../../configs/config.js';
import { AnimekaiService } from '../../animekai/service/animekai.service.js';
import { AnimepaheService } from '../../animepahe/service/animepahe.service.js';
import { ZoroService } from '../../zoro/service/zoro.service.js';
import { FullMediaResponse } from '../types/response.js';

@Injectable()
export class AnilistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly fetch: AnilistFetchService,
    private readonly util: AnilistUtilService,
    private readonly save: AnilistSaveService,
    private readonly zoro: ZoroService,
    private readonly animekai: AnimekaiService,
    private readonly animepahe: AnimepaheService,
    private readonly shikimori: ShikimoriService,
    private readonly kitsu: KitsuService,
  ) {}

  async getAnilist(
    id: number,
    isMal: boolean = false,
  ): Promise<AnilistWithRelations> {
    let existingAnilist = await this.prisma.anilist.findUnique(
      getAnilistFindUnique(id),
    );

    if (existingAnilist) {
      return await this.util.adjustAnilist(existingAnilist);
    }

    const data = await this.fetch.fetchAnilistFromGraphQL(id, isMal);

    const anilist = data.Page.media[0];

    const type = anilist.type as MediaType;
    if (type == MediaType.MANGA) {
      throw new Error('Nuh uh, no mangas here');
    }

    existingAnilist = await this.saveAnilist(anilist);
    return await this.util.adjustAnilist(existingAnilist);
  }

  async saveAnilist(
    anilist?: FullMediaResponse,
  ): Promise<AnilistWithRelations> {
    if (!anilist) {
      throw new Error('No media found');
    }

    await this.save.saveAnilist(anilist);

    await this.mappings
      .getMapping(anilist.id)
      .catch((e) => console.log(`Mapping failed: ${e.message ?? e}`));

    const providers: Array<{ name: string; fn: () => Promise<any> }> = [];

    if (Config.ZORO_ENABLED) {
      providers.push({
        name: 'Zoro',
        fn: () => this.zoro.getZoroByAnilist(anilist.id),
      });
    }

    if (Config.ANIMEKAI_ENABLED) {
      providers.push({
        name: 'Animekai',
        fn: () => this.animekai.getAnimekaiByAnilist(anilist.id),
      });
    }

    if (Config.ANIMEPAHE_ENABLED) {
      providers.push({
        name: 'Animepahe',
        fn: () => this.animepahe.getAnimepaheByAnilist(anilist.id),
      });
    }

    providers.push({
      name: 'Shikimori',
      fn: () =>
        this.shikimori.getShikimori(String(anilist.idMal)).catch(() => null),
    });
    providers.push({
      name: 'Kitsu',
      fn: () => this.kitsu.getKitsuByAnilist(anilist.id).catch(() => null),
    });

    await Promise.allSettled(
      providers.map(async (provider) => {
        try {
          await provider.fn();
        } catch (e) {
          console.warn(
            `${provider.name} failed for ID ${anilist.id}:`,
            e.message ?? e,
          );
        }
      }),
    );

    return (await this.prisma.anilist.findUnique(
      getAnilistFindUnique(anilist.id),
    )) as AnilistWithRelations;
  }

  async update(id: number): Promise<void> {
    const existingAnilist = await this.getAnilist(id);
    const data = await this.fetch.fetchAnilistFromGraphQL(id);

    if (!data) {
      throw new Error('No data');
    }

    const anilist = data.Page?.media[0];

    if (!anilist) {
      throw new Error('No media found');
    }

    if (existingAnilist.updatedAt == anilist.updatedAt) {
      throw new Error('No changes in anilist');
    }

    await this.saveAnilist(anilist);
  }
}
