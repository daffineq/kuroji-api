import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { anilistFetch } from './helper/anilist.fetch.service.js';
import { MediaType } from '../filter/Filter.js';
import { ShikimoriService } from '../../shikimori/service/shikimori.service.js';
import { KitsuService } from '../../kitsu/service/kitsu.service.js';
import { AnilistSaveService } from './helper/anilist.save.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';
import Config from '../../../../configs/config.js';
import { AnimekaiService } from '../../animekai/service/animekai.service.js';
import { AnimepaheService } from '../../animepahe/service/animepahe.service.js';
import { ZoroService } from '../../zoro/service/zoro.service.js';
import { FullMediaResponse } from '../types/response.js';
import { Prisma } from '@prisma/client';
import { AnilibriaService } from '../../anilibria/service/anilibria.service.js';

@Injectable()
export class AnilistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly save: AnilistSaveService,
    private readonly zoro: ZoroService,
    private readonly anilibria: AnilibriaService,
    private readonly animekai: AnimekaiService,
    private readonly animepahe: AnimepaheService,
    private readonly shikimori: ShikimoriService,
    private readonly kitsu: KitsuService,
  ) {}

  async getAnilist<T extends Prisma.AnilistSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
      select,
    });

    if (existingAnilist) {
      return existingAnilist as Prisma.AnilistGetPayload<{ select: T }>;
    }

    const data = await anilistFetch.fetchAnilistFromGraphQL(id);
    const anilist = data.Page.media[0];

    const type = anilist.type as MediaType;
    if (type == MediaType.MANGA) throw new Error('Nuh uh, no mangas here');

    return await this.saveAnilist(anilist, select);
  }

  async saveAnilist<T extends Prisma.AnilistSelect>(
    anilist?: FullMediaResponse,
    select?: T,
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    if (!anilist) throw new Error('No media found');

    await this.save.saveAnilist(anilist, select);

    await this.mappings
      .getMapping(anilist.id)
      .catch((e) => console.log(`Mapping failed: ${e.message ?? e}`));

    const providers: Array<{ name: string; fn: () => Promise<any> }> = [];

    if (Config.ZORO_ENABLED) {
      providers.push({
        name: 'Zoro',
        fn: () => this.zoro.getInfoByAnilist(anilist.id),
      });
    }

    if (Config.ANIMEKAI_ENABLED) {
      providers.push({
        name: 'Animekai',
        fn: () => this.animekai.getInfoByAnilist(anilist.id),
      });
    }

    if (Config.ANIMEPAHE_ENABLED) {
      providers.push({
        name: 'Animepahe',
        fn: () => this.animepahe.getInfoByAnilist(anilist.id),
      });
    }

    providers.push({
      name: 'Shikimori',
      fn: () => this.shikimori.getInfo(String(anilist.idMal)).catch(() => null),
    });
    providers.push({
      name: 'Kitsu',
      fn: () => this.kitsu.getInfoByAnilist(anilist.id).catch(() => null),
    });
    providers.push({
      name: 'Anilibria',
      fn: () => this.anilibria.getInfoByAnilist(anilist.id).catch(() => null),
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

    return (await this.prisma.anilist.findUnique({
      where: { id: anilist.id },
      select,
    })) as Prisma.AnilistGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.AnilistSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    const data = await anilistFetch.fetchAnilistFromGraphQL(id);
    if (!data) throw new Error('No data');

    const anilist = data.Page?.media[0];
    if (!anilist) throw new Error('No media found');

    return await this.saveAnilist(anilist, select);
  }
}
