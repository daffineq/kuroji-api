import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma.service.js';
import { mappingSelect } from '../../types/types.js';

@Injectable()
export class AnilistUtilService {
  constructor(private readonly prisma: PrismaService) {}

  async getMappingAnilist(id: number, mal: boolean = false) {
    const where = mal ? { idMal: id } : { id };
    const existing = await this.prisma.anilist.findUnique({
      where,
      select: mappingSelect,
    });

    if (existing) return existing;
  }
}
