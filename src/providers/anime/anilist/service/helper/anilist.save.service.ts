import { Injectable } from '@nestjs/common';
import { AnilistResponse, AnilistWithRelations } from '../../types/types.js';
import {
  AnilistHelper,
  getAnilistInclude,
} from '../../utils/anilist-helper.js';
import { PrismaService } from '../../../../../prisma.service.js';
import { FullMediaResponse } from '../../types/response.js';

@Injectable()
export class AnilistSaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
  ) {}

  async saveAnilist(
    anilist?: FullMediaResponse,
  ): Promise<AnilistWithRelations> {
    if (!anilist) {
      throw new Error('No media found');
    }

    return (await this.prisma.anilist.upsert({
      where: { id: anilist.id },
      create: await this.helper.getDataForPrisma(anilist),
      update: await this.helper.getDataForPrisma(anilist),
      include: getAnilistInclude(),
    })) as unknown as AnilistWithRelations;
  }
}
