import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnilistHelper } from '../utils/anilist-helper';
import { AnilistFetchService } from './helper/anilist.fetch.service'
import { MediaType } from '../filter/Filter'
import { AnilistWithRelations, AnilistResponse } from '../model/AnilistModels'
import { AnilistUtilService } from './helper/anilist.util.service'
import { ShikimoriService } from '../../shikimori/service/shikimori.service'
import { KitsuService } from '../../kitsu/service/kitsu.service'

@Injectable()
export class AnilistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
    private readonly fetch: AnilistFetchService,
    private readonly util: AnilistUtilService,
    private readonly shikimori: ShikimoriService,
    @Inject(forwardRef(() => KitsuService))
    private readonly kitsu: KitsuService,
  ) {}

  async getAnilist(
    id: number,
    isMal: boolean = false,
  ): Promise<AnilistWithRelations> {
    let existingAnilist = await this.prisma.anilist.findUnique(this.helper.getFindUnique(id));

    if (existingAnilist) {
      return await this.util.adjustAnilist(existingAnilist);
    }

    const data = await this.fetch.fetchAnilistFromGraphQL(id, isMal);
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    const type = data.Page.media[0].type as unknown as MediaType;
    if (type == MediaType.MANGA) {
      throw new Error('Nuh uh, no mangas here');
    }

    await this.saveAnilist(data);

    existingAnilist = await this.prisma.anilist.findUnique(this.helper.getFindUnique(id));

    if (!existingAnilist) {
      throw new Error('Not found');
    }
    
    return await this.util.adjustAnilist(existingAnilist);
  }

  async saveAnilist(data: AnilistResponse): Promise<AnilistWithRelations> {
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    let anilist = data.Page.media[0];

    const [moreInfo, videos] = await Promise.all([
      this.fetch.fetchMoreInfo(anilist.idMal ?? 0).catch(() => null),
      this.fetch.fetchVideos(anilist.idMal ?? 0).catch(() => null)
    ]);

    if (moreInfo?.data?.moreinfo) {
      anilist.moreInfo = moreInfo.data.moreinfo;
    }

    await this.prisma.lastUpdated.create({
      data: {
        entityId: anilist.id.toString(),
        externalId: anilist.idMal,
        type: UpdateType.ANILIST,
      },
    });

    await this.prisma.anilist.upsert({
      where: { id: anilist.id },
      create: this.helper.getDataForPrisma(anilist, videos),
      update: this.helper.getDataForPrisma(anilist, videos),
    });

    await this.shikimori.getShikimori(String(anilist.idMal));
    await this.kitsu.getKitsuByAnilist(anilist.id);

    return await this.prisma.anilist.findUnique(this.helper.getFindUnique(anilist.id)) as AnilistWithRelations;
  }
  
  async updateAtAnilist(anilist: AnilistWithRelations, shouldSave: boolean = true): Promise<AnilistWithRelations> {
    anilist.updatedAt = Math.floor(Date.now() / 1000);
    
    if (shouldSave) {
      return await this.prisma.anilist.upsert({
        where: { id: anilist.id },
        create: this.helper.getDataForPrisma(anilist),
        update: this.helper.getDataForPrisma(anilist),
      });
    }

    return anilist;
  }

  async update(id: number): Promise<void> {
    const existingAnilist = await this.getAnilist(id);
    const data = await this.fetch.fetchAnilistFromGraphQL(id);
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    if (existingAnilist == data.Page.media[0]) Promise.reject('No changes in anilist');

    data.Page.media[0] = await this.updateAtAnilist(data.Page.media[0], false);

    await this.saveAnilist(data);
  }
}