import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { getKitsuInclude, KitsuHelper } from '../util/kitsu-helper';
import { KITSU } from '../../../../configs/kitsu.config';
import { CustomHttpService } from '../../../../http/http.service';
import { findBestMatch } from '../../../../mapper/mapper.helper';
import { UpdateType } from '../../../../update/UpdateType';
import { getUpdateData } from '../../../../update/update.util';
import { KitsuWithRelations, KitsuAnime } from '../types/types';

@Injectable()
export class KitsuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: KitsuHelper,
    private readonly http: CustomHttpService,
  ) {}

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
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(kitsu.id) },
      create: getUpdateData(
        String(kitsu.id),
        kitsu.anilistId ?? 0,
        UpdateType.KITSU,
      ),
      update: getUpdateData(
        String(kitsu.id),
        kitsu.anilistId ?? 0,
        UpdateType.KITSU,
      ),
    });

    await this.prisma.kitsu.upsert({
      where: { id: kitsu.id },
      create: this.helper.getDataForPrisma(kitsu),
      update: this.helper.getDataForPrisma(kitsu),
    });

    return (await this.prisma.kitsu.findUnique({
      where: { id: kitsu.id },
      include: getKitsuInclude(),
    })) as KitsuWithRelations;
  }

  async updateKitsu(id: string): Promise<void> {
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

    const results = searchResult.map((result) => ({
      title: result.attributes.titles.en,
      id: result.id,
      year: parseInt(result.attributes.startDate.split('-')[0]),
      episodes: result.attributes.episodeCount,
    }));

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
      const data = await this.fetchKitsu(bestMatch.result.id as string);
      data.anilistId = id;
      return data;
    }

    throw new Error('Kitsu not found');
  }

  async searchKitsu(query: string): Promise<KitsuAnime[]> {
    return await this.http.getResponse(
      KITSU.searchKitsu(query),
      undefined,
      'data',
    );
  }

  async fetchKitsu(id: string): Promise<KitsuAnime> {
    return await this.http.getResponse(KITSU.getKitsu(id), undefined, 'data');
  }
}
