import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnilistHelper, getAnilistFindUnique } from '../utils/anilist-helper';
import { AnilistFetchService } from './helper/anilist.fetch.service'
import { MediaType } from '../filter/Filter'
import { AnilistWithRelations, AnilistResponse } from '../model/AnilistModels'
import { AnilistUtilService } from './helper/anilist.util.service'
import { ShikimoriService } from '../../shikimori/service/shikimori.service'
import { KitsuService } from '../../kitsu/service/kitsu.service'
import { getUpdateData } from '../../../../update/update.util'

@Injectable()
export class AnilistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
    private readonly fetch: AnilistFetchService,
    private readonly util: AnilistUtilService,
    private readonly shikimori: ShikimoriService,
    private readonly kitsu: KitsuService,
  ) {}

  async getAnilist(
    id: number,
    isMal: boolean = false,
  ): Promise<AnilistWithRelations> {
    let existingAnilist = await this.prisma.anilist.findUnique(getAnilistFindUnique(id));

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

    await this.saveAnilist(data);

    existingAnilist = await this.prisma.anilist.findUnique(getAnilistFindUnique(id));

    if (!existingAnilist) {
      throw new Error('Not found');
    }
    
    return await this.util.adjustAnilist(existingAnilist);
  }

  async saveAnilist(data: AnilistResponse): Promise<AnilistWithRelations> {
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    const anilist = data.Page.media[0];

    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(anilist.id) },
      create: getUpdateData(String(anilist.id), anilist.id, UpdateType.ANILIST),
      update: getUpdateData(String(anilist.id), anilist.id, UpdateType.ANILIST),
    });

    await this.prisma.anilist.upsert({
      where: { id: anilist.id },
      create: await this.helper.getDataForPrisma(anilist),
      update: await this.helper.getDataForPrisma(anilist),
    });

    await Promise.all([
      ...(anilist.idMal ? [this.shikimori.getShikimori(String(anilist.idMal)).catch(() => null)] : []),
      this.kitsu.getKitsuByAnilist(anilist.id).catch(() => null),
    ]);

    return await this.prisma.anilist.findUnique(getAnilistFindUnique(anilist.id)) as AnilistWithRelations;
  }

  async update(id: number): Promise<void> {
    const existingAnilist = await this.getAnilist(id);
    const data = await this.fetch.fetchAnilistFromGraphQL(id);
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    if (existingAnilist == data.Page.media[0]) throw new Error('No changes in anilist');

    await this.saveAnilist(data);
  }
}