import { Injectable } from '@nestjs/common';
import { AnilistResponse, AnilistWithRelations } from '../../types/types.js';
import {
  AnilistHelper,
  getAnilistInclude,
} from '../../utils/anilist-helper.js';
import { PrismaService } from '../../../../../prisma.service.js';

@Injectable()
export class AnilistSaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
  ) {}

  async saveAnilist(data: AnilistResponse): Promise<AnilistWithRelations> {
    if (!data.Page?.media || data.Page.media.length === 0) {
      throw new Error('No media found');
    }

    const anilist = data.Page.media[0];

    return (await this.prisma.anilist.upsert({
      where: { id: anilist.id },
      create: await this.helper.getDataForPrisma(anilist),
      update: await this.helper.getDataForPrisma(anilist),
      include: getAnilistInclude(),
    })) as unknown as AnilistWithRelations;
  }
}
