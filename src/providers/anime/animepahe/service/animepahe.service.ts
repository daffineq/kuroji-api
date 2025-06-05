import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch } from '../../../mapper/mapper.helper';
import { UpdateType } from '../../../update/UpdateType';
import { AnimePaheHelper } from '../utils/animepahe-helper';
import {
  ANIME,
  IAnimeInfo,
  IAnimeResult,
  ISearch,
  ISource,
} from '@consumet/extensions';
import { getUpdateData } from '../../../update/update.util';
import { UrlConfig } from '../../../../configs/url.config';
import { AnimepaheWithRelations } from '../types/types';
import { Client } from '../../../model/client';

const animepahe = new ANIME.AnimePahe();

@Injectable()
export class AnimepaheService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnimePaheHelper,
  ) {
    super(UrlConfig.ANIMEPAHE);
  }

  async getAnimepaheByAnilist(id: number): Promise<AnimepaheWithRelations> {
    const existingAnimepahe = await this.prisma.animepahe.findFirst({
      where: { alId: id },
      include: {
        externalLinks: true,
        episodes: true,
      },
    });

    if (existingAnimepahe) {
      return existingAnimepahe;
    }

    const animepahe = await this.findAnimepahe(id);
    return this.saveAnimepahe(animepahe);
  }

  async saveAnimepahe(animepahe: IAnimeInfo): Promise<AnimepaheWithRelations> {
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(animepahe.id) },
      create: getUpdateData(
        String(animepahe.id),
        animepahe.alId,
        UpdateType.ANIMEPAHE,
      ),
      update: getUpdateData(
        String(animepahe.id),
        animepahe.alId,
        UpdateType.ANIMEPAHE,
      ),
    });

    await this.prisma.animepahe.upsert({
      where: { id: animepahe.id },
      update: this.helper.getAnimePaheData(animepahe),
      create: this.helper.getAnimePaheData(animepahe),
      include: {
        externalLinks: true,
        episodes: true,
      },
    });

    return await this.prisma.animepahe.upsert({
      where: { id: animepahe.id },
      update: this.helper.getAnimePaheData(animepahe),
      create: this.helper.getAnimePaheData(animepahe),
      include: {
        externalLinks: true,
        episodes: true,
      },
    });
  }

  async update(id: string): Promise<AnimepaheWithRelations> {
    const existingAnimepahe = await this.prisma.animepahe.findFirst({
      where: { id },
      include: { episodes: true },
    });

    const animepahe = await this.fetchAnimepahe(id);

    if (!animepahe) {
      throw new Error('Animepahe not found');
    }

    animepahe.alId = existingAnimepahe?.alId || 0;

    return await this.saveAnimepahe(animepahe);
  }

  async getSources(episodeId: string): Promise<ISource> {
    // return await animepahe.fetchEpisodeSources(episodeId);
    const { data, error } = await this.client.get<ISource>(
      `watch?episodeId=${episodeId}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchAnimepahe(id: string): Promise<IAnimeInfo> {
    // return await animepahe.fetchAnimeInfo(id);
    const { data, error } = await this.client.get<IAnimeInfo>(`info?id=${id}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async searchAnimepahe(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await animepahe.search(q)).results;
    const { data, error } = await this.client.get<ISearch<IAnimeResult>>(q);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async findAnimepahe(id: number): Promise<IAnimeInfo> {
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

    const searchResult = await this.searchAnimepahe(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map((result) => ({
      title: result.title,
      id: result.id,
      year:
        typeof result.releaseDate === 'string'
          ? parseInt(result.releaseDate)
          : result.releaseDate,
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
      const data = await this.fetchAnimepahe(bestMatch.result.id);
      data.alId = id;
      return data;
    }

    throw new Error('Animepahe not found');
  }
}
