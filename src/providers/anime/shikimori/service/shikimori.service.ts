import { Injectable, NotFoundException } from '@nestjs/common';
import { BasicIdShik, Prisma, Shikimori } from '@prisma/client';
import { PrismaService } from '../../../../prisma.service.js';
import {
  ShikimoriHelper,
  shikimoriToBasicId,
} from '../utils/shikimori-helper.js';
import { ShikimoriWithRelations } from '../types/types.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { shikimoriFetch } from './shikimori.fetch.service.js';

@Injectable()
export class ShikimoriService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
    private readonly helper: ShikimoriHelper,
  ) {}

  async getShikimori<T extends Prisma.ShikimoriSelect>(
    id: string,
    select?: T,
  ): Promise<Prisma.ShikimoriGetPayload<{ select: T }>> {
    if (!id || id == '') throw new Error('Shikimori id is empty');

    const existing = await this.prisma.shikimori.findUnique({
      where: { id },
      select,
    });

    if (existing) {
      return existing as Prisma.ShikimoriGetPayload<{ select: T }>;
    }

    const anilist = await this.anilist.getMappingAnilist(+id, true);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const data = await shikimoriFetch.fetchFromGraphQL(id);
    const anime = data.animes[0];

    if (!anime)
      throw new NotFoundException(`No Shikimori data found for ID: ${id}`);

    return await this.saveShikimori(anime);
  }

  async getChronology(id: string): Promise<BasicIdShik[]> {
    const shikimori = await this.prisma.shikimori.findUnique({
      where: { id },
      select: { chronology: true },
    });

    if (!shikimori)
      throw new NotFoundException(`No Shikimori data found for ID: ${id}`);

    return shikimori.chronology;
  }

  async saveShikimori<T extends Prisma.ShikimoriSelect>(
    anime: ShikimoriWithRelations,
    select?: T,
  ): Promise<Prisma.ShikimoriGetPayload<{ select: T }>> {
    return (await this.prisma.shikimori.upsert({
      where: { id: anime.id },
      update: this.helper.getDataForPrisma(anime),
      create: this.helper.getDataForPrisma(anime),
      select,
    })) as Prisma.ShikimoriGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.ShikimoriSelect>(
    id: string,
    select?: T,
  ): Promise<Prisma.ShikimoriGetPayload<{ select: T }>> {
    const data = await shikimoriFetch.fetchFromGraphQL(id);
    const anime = data.animes[0];
    if (!anime)
      throw new NotFoundException(`No Shikimori data found for ID: ${id}`);

    return this.saveShikimori(anime, select);
  }

  async getFranchise(franchise: string): Promise<Shikimori[]> {
    return this.prisma.shikimori.findMany({ where: { franchise } });
  }

  async getFranchiseIds(franchise: string): Promise<BasicIdShik[]> {
    const items = await this.getFranchise(franchise);
    return items.map((item) => shikimoriToBasicId(item));
  }
}
