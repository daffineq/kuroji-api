import { Injectable } from '@nestjs/common';
import { AnimeKai, AnimekaiEpisode } from '@prisma/client';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch } from '../../../../mapper/mapper.helper';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnimeKaiHelper } from '../utils/animekai-helper';
import { ANIME, IAnimeResult, ISource, StreamingServers, SubOrSub } from "@consumet/extensions"
import { getUpdateData } from '../../../../update/update.util'

export interface AnimekaiWithRelations extends AnimeKai {
  episodes: AnimekaiEpisode[]
}

const animekai = new ANIME.AnimeKai();

@Injectable()
export class AnimekaiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnimeKaiHelper
  ) {}

  async getAnimekaiByAnilist(id: number): Promise<AnimekaiWithRelations> {
    const existingAnimekai = await this.prisma.animeKai.findFirst({
      where: { anilistId: id },
      include: { episodes: true }
    });

    if (existingAnimekai) {
      return existingAnimekai;
    }

    const animekai = await this.findAnimekai(id);
    return this.saveAnimekai(animekai as AnimekaiWithRelations);
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    return await animekai.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
  }

  async saveAnimekai(animekai: AnimekaiWithRelations): Promise<AnimekaiWithRelations> {
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(animekai.id) },
      create: getUpdateData(String(animekai.id), animekai.anilistId ?? 0, UpdateType.ANIMEKAI),
      update: getUpdateData(String(animekai.id), animekai.anilistId ?? 0, UpdateType.ANIMEKAI),
    });

    await this.prisma.animeKai.upsert({
      where: { id: animekai.id },
      update: this.helper.getAnimekaiData(animekai),
      create: this.helper.getAnimekaiData(animekai),
    });

    return await this.prisma.animeKai.findUnique({
      where: { id: animekai.id },
      include: { episodes: true }
    }) as AnimekaiWithRelations;
  }

  async update(id: string): Promise<AnimeKai> {
    const existingAnimekai = await this.prisma.animeKai.findFirst({
      where: { id },
      include: { episodes: true }
    });

    const animekai = await this.fetchAnimekai(id) as AnimekaiWithRelations;

    if (!animekai) {
      throw new Error('Animekai not found');
    }

    animekai.anilistId = existingAnimekai?.anilistId ?? 0;

    return await this.saveAnimekai(animekai);
  }

  async fetchAnimekai(id: string): Promise<AnimeKai> {
    const info = await animekai.fetchAnimeInfo(id);
    return info as unknown as AnimeKai;
  }

  async searchAnimekai(query: string): Promise<IAnimeResult[]> {
    return (await animekai.fetchSearchSuggestions(query)).results;
  }

  async findAnimekai(id: number): Promise<AnimeKai> {
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

    const searchResult = await this.searchAnimekai(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.map(result => ({
      title: result.title,
      id: result.id,
    }));

    const searchCriteria = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english: anilist.title?.english || undefined,
        native: anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      episodes: anilist.episodes ?? undefined
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await this.fetchAnimekai(bestMatch.result.id as string);
      data.anilistId = id;
      return data;
    }

    throw new Error('Animekai not found');
  }
}
