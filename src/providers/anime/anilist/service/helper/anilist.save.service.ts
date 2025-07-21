import { Injectable } from '@nestjs/common';
import { AnilistHelper } from '../../utils/anilist-helper.js';
import { PrismaService } from '../../../../../prisma.service.js';
import { FullMediaResponse } from '../../types/response.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnilistSaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
  ) {}

  async saveAnilist<T extends Prisma.AnilistSelect>(
    anilist?: FullMediaResponse,
    select?: T,
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    if (!anilist) throw new Error('No media found');

    return (await this.prisma.anilist.upsert({
      where: { id: anilist.id },
      create: await this.helper.getDataForPrisma(anilist),
      update: await this.helper.getDataForPrisma(anilist),
      select,
    })) as Prisma.AnilistGetPayload<{ select: T }>;
  }
}
