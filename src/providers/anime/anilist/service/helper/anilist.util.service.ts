import { Injectable } from '@nestjs/common';
import {
  getAnilistMappingSelect,
  reorderAnilistItems,
} from '../../utils/anilist-helper.js';
import { AnilistWithRelations } from '../../types/types.js';
import { PrismaService } from '../../../../../prisma.service.js';
import { AnilistSaveService } from './anilist.save.service.js';
import { AnilistFetchService } from './anilist.fetch.service.js';
import { MediaType } from '../../filter/Filter.js';

@Injectable()
export class AnilistUtilService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly fetch: AnilistFetchService,
    // private readonly save: AnilistSaveService,
  ) {}

  async adjustAnilist(
    anilist: AnilistWithRelations,
  ): Promise<AnilistWithRelations> {
    return reorderAnilistItems(anilist) as AnilistWithRelations;
  }

  async getMappingAnilist(id: number, mal: boolean = false) {
    const select = getAnilistMappingSelect();

    const where = mal ? { idMal: id } : { id };
    let existing = await this.prisma.anilist.findUnique({
      where,
      select,
    });

    if (existing) return existing;

    // const data = await this.fetch.fetchAnilistFromGraphQL(id);

    // if (!data.Page?.media || data.Page.media.length === 0) {
    //   throw new Error('No media found');
    // }

    // const type = data.Page.media[0].type as MediaType;
    // if (type == MediaType.MANGA) {
    //   throw new Error('Nuh uh, no mangas here');
    // }

    // await this.save.saveAnilist(data);

    // return await this.prisma.anilist.findUnique({
    //   where: { id },
    //   select,
    // });
  }
}
