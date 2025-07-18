import { Injectable, NotFoundException } from '@nestjs/common';
import { BasicIdShik, Shikimori } from '@prisma/client';
import { PrismaService } from '../../../../prisma.service.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import {
  getShikimoriInclude,
  ShikimoriHelper,
  shikimoriToBasicId,
} from '../utils/shikimori-helper.js';
import { ShikimoriWithRelations } from '../types/types.js';
import { Client } from '../../../model/client.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { shikimoriFetch } from './shikimori.fetch.service.js';

@Injectable()
export class ShikimoriService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
    private readonly helper: ShikimoriHelper,
  ) {
    super(UrlConfig.SHIKIMORI_GRAPHQL);
  }

  async getShikimori(id: string): Promise<ShikimoriWithRelations> {
    if (!id || id == '') {
      throw new Error('Shikimori id is empty');
    }

    const existing = await this.findById(id);
    if (existing) return existing;

    const anilist = await this.anilist.getMappingAnilist(+id, true);

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const data = await shikimoriFetch.fetchFromGraphQL(id);
    const anime = data.animes[0];
    if (!anime)
      throw new NotFoundException(`No Shikimori data found for ID: ${id}`);

    return await this.saveShikimori(anime);
  }

  async getChronology(id: string): Promise<BasicIdShik[]> {
    const shikimori = await this.prisma.shikimori.findUnique({
      where: { id },
      include: { chronology: true },
    });

    if (!shikimori)
      throw new NotFoundException(`Shikimori not found for ID: ${id}`);
    return shikimori.chronology;
  }

  async saveShikimori(
    anime: ShikimoriWithRelations,
  ): Promise<ShikimoriWithRelations> {
    return (await this.prisma.shikimori.upsert({
      where: { id: anime.id },
      update: this.helper.getDataForPrisma(anime),
      create: this.helper.getDataForPrisma(anime),
      include: getShikimoriInclude(),
    })) as ShikimoriWithRelations;
  }

  async update(id: string): Promise<ShikimoriWithRelations> {
    const data = await shikimoriFetch.fetchFromGraphQL(id);
    const anime = data.animes[0];

    if (!anime) {
      throw new NotFoundException(`Shikimori not found for ID: ${id}`);
    }

    return this.saveShikimori(anime);
  }

  async getFranchise(franchise: string): Promise<Shikimori[]> {
    return this.prisma.shikimori.findMany({ where: { franchise } });
  }

  async getFranchiseIds(franchise: string): Promise<BasicIdShik[]> {
    const items = await this.getFranchise(franchise);
    return items.map((item) => shikimoriToBasicId(item));
  }

  private async findById(id: string): Promise<ShikimoriWithRelations | null> {
    return this.prisma.shikimori.findUnique({
      where: { id },
      include: getShikimoriInclude(),
    }) as Promise<ShikimoriWithRelations | null>;
  }
}
