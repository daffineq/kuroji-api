import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch } from '../../../mapper/mapper.helper';
import {
  ANIME,
  IAnimeInfo,
  IAnimeResult,
  ISearch,
  ISource,
  StreamingServers,
  SubOrSub,
} from '@consumet/extensions';
import { UrlConfig } from '../../../../configs/url.config';
import { AnimekaiWithRelations } from '../types/types';
import { Client } from '../../../model/client';
import { getAnimekaiData } from '../utils/animekai-helper';

const animekai = new ANIME.AnimeKai();

@Injectable()
export class AnimekaiService extends Client {
  constructor(private readonly prisma: PrismaService) {
    super(UrlConfig.ANIMEKAI);
  }

  async getAnimekaiByAnilist(id: number): Promise<AnimekaiWithRelations> {
    const existingAnimekai = await this.prisma.animeKai.findFirst({
      where: { anilistId: id },
      include: { episodes: true },
    });

    if (existingAnimekai) {
      return existingAnimekai;
    }

    const animekai = await this.findAnimekai(id);
    return this.saveAnimekai(animekai);
  }

  async saveAnimekai(animekai: IAnimeInfo): Promise<AnimekaiWithRelations> {
    return await this.prisma.animeKai.upsert({
      where: { id: animekai.id },
      update: getAnimekaiData(animekai),
      create: getAnimekaiData(animekai),
      include: { episodes: true },
    });
  }

  async update(
    id: number,
    force: boolean = false,
  ): Promise<AnimekaiWithRelations> {
    if (force) {
      const animekai = await this.findAnimekai(id);

      if (!animekai) {
        throw new Error('Animekai not found');
      }

      animekai.anilistId = id;

      return await this.saveAnimekai(animekai);
    }

    const existingAnimekai = await this.prisma.animeKai.findFirst({
      where: { anilistId: id },
      include: { episodes: true },
    });

    if (!existingAnimekai) {
      throw new Error('Animekai not found');
    }

    const animekai = await this.fetchAnimekai(existingAnimekai.id);

    if (!animekai) {
      throw new Error('Animekai not found');
    }

    animekai.anilistId = id;

    return await this.saveAnimekai(animekai);
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    // return await animekai.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
    const { data, error } = await this.client.get<ISource>(
      `watch/${episodeId}?dub=${dub}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchAnimekai(id: string): Promise<IAnimeInfo> {
    // return await animekai.fetchAnimeInfo(id);
    const { data, error } = await this.client.get<IAnimeInfo>(`info?id=${id}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async searchAnimekai(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await animekai.search(q)).results;
    const { data, error } = await this.client.get<ISearch<IAnimeResult>>(q);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async findAnimekai(id: number): Promise<IAnimeInfo> {
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
        shikimori: {
          select: {
            english: true,
            japanese: true,
            episodesAired: true,
          },
        },
      },
    });

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const searchResult = await this.searchAnimekai(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map((result) => ({
      title: result.title,
      id: result.id,
    }));

    const searchCriteria = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english:
          anilist.shikimori?.english || anilist.title?.english || undefined,
        native:
          anilist.shikimori?.japanese || anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      episodes:
        anilist.shikimori?.episodesAired ?? anilist.episodes ?? undefined,
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await this.fetchAnimekai(bestMatch.result.id);
      data.anilistId = id;
      return data;
    }

    throw new Error('Animekai not found');
  }
}
