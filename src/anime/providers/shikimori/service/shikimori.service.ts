import { Injectable, NotFoundException } from '@nestjs/common';
import { BasicIdShik, Shikimori } from '@prisma/client';
import { PrismaService } from '../../../../prisma.service';
import { UpdateType } from '../../../../update/UpdateType';
import { UrlConfig } from '../../../../configs/url.config';
import { CustomHttpService } from '../../../../http/http.service';
import { GraphQL } from '../graphql/shikimori.graphql';
import {
  getShikimoriInclude,
  ShikimoriHelper,
  shikimoriToBasicId,
} from '../utils/shikimori-helper';
import { getUpdateData } from '../../../../update/update.util';
import { ShikimoriResponse, ShikimoriWithRelations } from '../types/types';

@Injectable()
export class ShikimoriService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: CustomHttpService,
    private readonly helper: ShikimoriHelper,
  ) {}

  async getShikimori(id: string): Promise<ShikimoriWithRelations> {
    if (!id || id == '') {
      throw new Error('Shikimori id is empty');
    }

    const existing = await this.findById(id);
    if (existing) return existing;

    const data = await this.fetchFromGraphQL(id);
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
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(anime.id) },
      create: getUpdateData(
        String(anime.id),
        Number(anime.id),
        UpdateType.SHIKIMORI,
      ),
      update: getUpdateData(
        String(anime.id),
        Number(anime.id),
        UpdateType.SHIKIMORI,
      ),
    });

    await this.prisma.shikimori.upsert({
      where: { id: anime.id },
      update: this.helper.getDataForPrisma(anime),
      create: this.helper.getDataForPrisma(anime),
    });

    return (await this.findById(anime.id))!;
  }

  async update(id: string): Promise<ShikimoriWithRelations> {
    const data = await this.fetchFromGraphQL(id);
    const anime = data.animes[0];
    if (!anime)
      throw new NotFoundException(`Shikimori not found for ID: ${id}`);

    const existing = await this.prisma.shikimori.findUnique({ where: { id } });
    if (JSON.stringify(anime) === JSON.stringify(existing)) {
      return anime;
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

  private async fetchFromGraphQL(
    id: string,
    page = 1,
    perPage = 1,
  ): Promise<ShikimoriResponse> {
    return this.http.getGraphQL(
      UrlConfig.SHIKIMORI_GRAPHQL,
      GraphQL.getShikimoriAnime(id, page, perPage),
    );
  }

  private async findById(id: string): Promise<ShikimoriWithRelations | null> {
    return this.prisma.shikimori.findUnique({
      where: { id },
      include: getShikimoriInclude(),
    }) as Promise<ShikimoriWithRelations | null>;
  }
}
