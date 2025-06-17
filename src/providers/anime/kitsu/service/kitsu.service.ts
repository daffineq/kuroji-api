import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { getKitsuInclude, KitsuHelper } from '../util/kitsu-helper';
import { KITSU } from '../../../../configs/kitsu.config';
import { findBestMatch } from '../../../mapper/mapper.helper';
import { KitsuWithRelations, KitsuAnime } from '../types/types';
import { Client } from '../../../model/client';
import { UrlConfig } from '../../../../configs/url.config';

@Injectable()
export class KitsuService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: KitsuHelper,
  ) {
    super(UrlConfig.KITSU);
  }

  async getKitsuByAnilist(id: number): Promise<KitsuWithRelations> {
    const existingKitsu = (await this.prisma.kitsu.findFirst({
      where: {
        anilistId: id,
      },
      include: getKitsuInclude(),
    })) as KitsuWithRelations;

    if (existingKitsu) {
      return existingKitsu;
    }

    const rawKitsu = await this.findKitsuByAnilist(id);

    return await this.saveKitsu(rawKitsu);
  }

  async saveKitsu(kitsu: KitsuAnime): Promise<KitsuWithRelations> {
    return (await this.prisma.kitsu.upsert({
      where: { id: kitsu.id },
      create: this.helper.getDataForPrisma(kitsu),
      update: this.helper.getDataForPrisma(kitsu),
      include: getKitsuInclude(),
    })) as KitsuWithRelations;
  }

  async update(id: string): Promise<void> {
    const existingKitsu = (await this.prisma.kitsu.findUnique({
      where: { id: id },
      include: getKitsuInclude(),
    })) as KitsuWithRelations;

    if (!existingKitsu) {
      throw new Error('Not found');
    }

    const rawKitsu = await this.fetchKitsu(id);
    rawKitsu.anilistId = existingKitsu.anilistId ?? 0;

    await this.saveKitsu(rawKitsu);
  }

  async updateByAnilist(id: number) {
    const kitsu = await this.getKitsuByAnilist(id);
    return await this.update(kitsu.id);
  }

  async findKitsuByAnilist(id: number): Promise<KitsuAnime> {
    const anilist = await this.prisma.anilist.findUnique({
      where: { id: id },
      select: {
        title: {
          select: {
            romaji: true,
            english: true,
            native: true,
          },
        },
        seasonYear: true,
        episodes: true,
      },
    });

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const searchResult = await this.searchKitsu(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.map((result) => {
      const startDate = result.attributes.startDate;
      const year = startDate ? parseInt(startDate.split('-')[0]) : undefined;

      return {
        title: result.attributes.titles.en,
        id: result.id,
        year,
        episodes: result.attributes.episodeCount,
      };
    });

    const searchCriteria = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english: anilist.title?.english || undefined,
        native: anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      episodes: anilist.episodes ?? undefined,
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await this.fetchKitsu(bestMatch.result.id);
      data.anilistId = id;
      return data;
    }

    throw new Error('Kitsu not found');
  }

  async searchKitsu(query: string): Promise<KitsuAnime[]> {
    const { data, error } = await this.client.get<KitsuAnime[]>(
      KITSU.searchKitsu(query),
      {
        jsonPath: 'data',
      },
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchKitsu(id: string): Promise<KitsuAnime> {
    const { data, error } = await this.client.get<KitsuAnime>(
      KITSU.getKitsu(id),
      {
        jsonPath: 'data',
      },
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}
