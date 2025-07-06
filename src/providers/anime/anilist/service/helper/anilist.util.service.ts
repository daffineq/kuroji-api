import { Injectable } from '@nestjs/common';
import {
  getAnilistMappingSelect,
  reorderAnilistItems,
} from '../../utils/anilist-helper.js';
import { AnilistWithRelations } from '../../types/types.js';
import { PrismaService } from '../../../../../prisma.service.js';

@Injectable()
export class AnilistUtilService {
  constructor(private readonly prisma: PrismaService) {}

  async adjustAnilist(
    anilist: AnilistWithRelations,
  ): Promise<AnilistWithRelations> {
    return reorderAnilistItems(anilist) as AnilistWithRelations;
  }

  async getMappingAnilist(id: number, mal: boolean = false) {
    const where = mal ? { idMal: id } : { id };
    let existing = await this.prisma.anilist.findUnique({
      where,
      select: getAnilistMappingSelect(),
    });

    if (existing) return existing;
  }
}
