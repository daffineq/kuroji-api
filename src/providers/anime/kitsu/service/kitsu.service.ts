import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { getKitsuInclude, KitsuHelper } from '../util/kitsu-helper.js';
import { KITSU } from '../../../../configs/kitsu.config.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { KitsuWithRelations, KitsuAnime } from '../types/types.js';
import { Client } from '../../../model/client.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { findEpisodeCount } from '../../anilist/utils/anilist-helper.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';

@Injectable()
export class KitsuService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly anilist: AnilistUtilService,
    private readonly helper: KitsuHelper,
  ) {
    super(UrlConfig.KITSU);
  }

  async getKitsu(id: string): Promise<KitsuWithRelations> {
    const existingKitsu = (await this.prisma.kitsu.findFirst({
      where: {
        id,
      },
      include: getKitsuInclude(),
    })) as KitsuWithRelations;

    if (existingKitsu) {
      return existingKitsu;
    }

    const rawKitsu = await this.fetchKitsu(id);

    return await this.saveKitsu(rawKitsu);
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

    const mapping = await this.mappings.getMapping(id);

    if (!mapping) {
      throw new Error('No mapping found');
    }

    const kitsuId = mapping.mappings?.kitsuId;

    if (!kitsuId) {
      const rawKitsu = await this.findKitsuByAnilist(id);
      await this.mappings.updateAniZipMappings(mapping.id, {
        kitsuId: rawKitsu.id,
      });
      return await this.saveKitsu(rawKitsu);
    }

    const rawKitsu = await this.fetchKitsu(kitsuId);
    rawKitsu.anilistId = id;
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
    const existingKitsu = await this.getKitsu(id);

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
    const anilist = await this.anilist.getMappingAnilist(id);

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

    const searchCriteria: ExpectAnime = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english: anilist.title?.english || undefined,
        native: anilist.title?.native || undefined,
      },
      synonyms: anilist.synonyms,
      year: anilist.seasonYear ?? undefined,
      episodes: findEpisodeCount(anilist),
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
