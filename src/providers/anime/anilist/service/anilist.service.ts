import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import {
  AnilistHelper,
  getAnilistFindUnique,
  getAnilistMappingSelect,
} from '../utils/anilist-helper.js';
import { AnilistFetchService } from './helper/anilist.fetch.service.js';
import { MediaType } from '../filter/Filter.js';
import { AnilistUtilService } from './helper/anilist.util.service.js';
import { ShikimoriService } from '../../shikimori/service/shikimori.service.js';
import { KitsuService } from '../../kitsu/service/kitsu.service.js';
import { AnilistWithRelations, AnilistResponse } from '../types/types.js';
import { AnilistSaveService } from './helper/anilist.save.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';

@Injectable()
export class AnilistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly fetch: AnilistFetchService,
    private readonly util: AnilistUtilService,
    private readonly save: AnilistSaveService,
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

    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    const type = data.Page.media[0].type as MediaType;
    if (type == MediaType.MANGA) {
      throw new Error('Nuh uh, no mangas here');
    }

    existingAnilist = await this.saveAnilist(data);
    return await this.util.adjustAnilist(existingAnilist);
  }

  async saveAnilist(data: AnilistResponse): Promise<AnilistWithRelations> {
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    const anilist = data.Page.media[0];

    await this.save.saveAnilist(data);

    await this.mappings
      .getMapping(anilist.id)
      .catch((e) => console.log(`Mapping failed: ${e.message ?? e}`));

    await Promise.all([
      this.shikimori.getShikimori(String(anilist.idMal)).catch(() => null),
      this.kitsu.getKitsuByAnilist(anilist.id).catch(() => null),
    ]);

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

    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    if (existingAnilist.updatedAt == data.Page.media[0].updatedAt) {
      throw new Error('No changes in anilist');
    }

    await this.saveAnilist(data);
  }
}
