import { Injectable } from '@nestjs/common';
import { AnimeKai, AnimekaiEpisode } from '@prisma/client';
import { UrlConfig } from '../../../../configs/url.config';
import { CustomHttpService } from '../../../../http/http.service';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch, ScrapeHelper } from '../../../../scrapper/scrape-helper';
import { Source } from '../../stream/model/Source';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnilistService } from '../../anilist/service/anilist.service';
import { AnimeKaiHelper } from '../utils/animekai-helper';
import { TmdbService } from '../../tmdb/service/tmdb.service'

export interface BasicAnimekai {
  id: string;
  title: string;
  url: string;
  japaneseTitle: string;
  image: string;
  type: string;
}

export interface AnimekaiResponse {
  results: BasicAnimekai[];
}

export interface AnimekaiWithRelations extends AnimeKai {
  episodes: AnimekaiEpisode[]
}

@Injectable()
export class AnimekaiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilistService: AnilistService,
    private readonly tmdbService: TmdbService,
    private readonly customHttpService: CustomHttpService,
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

  async getSources(episodeId: string, dub: boolean): Promise<Source> {
    const animekai = await this.customHttpService.getResponse(
      UrlConfig.ANIMEKAI + 'watch/' + episodeId + '?dub=' + dub
    )

    return animekai as Source
  }

  async saveAnimekai(animekai: AnimekaiWithRelations): Promise<AnimekaiWithRelations> {
    await this.prisma.lastUpdated.create({
      data: {
        entityId: animekai.id,
        externalId: animekai.anilistId,
        type: UpdateType.ANIMEKAI,
      },
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

    if (existingAnimekai?.episodes !== animekai.episodes) {
      const tmdb = await this.tmdbService.getTmdbByAnilist(animekai.anilistId);

      if (tmdb) {
        await this.tmdbService.update(tmdb.id);
      }
    }

    return await this.saveAnimekai(animekai);
  }

  async fetchAnimekai(id: string): Promise<AnimeKai> {
    return this.customHttpService.getResponse(
      UrlConfig.ANIMEKAI + 'info?id=' + id,
    );
  }

  async searchAnimekai(query: string): Promise<AnimekaiResponse> {
    return this.customHttpService.getResponse(UrlConfig.ANIMEKAI + query);
  }

  async findAnimekai(id: number): Promise<AnimeKai> {
    const anilist = await this.anilistService.getAnilist(id);
    const searchResult = await this.searchAnimekai(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map(result => ({
      title: result.title,
      id: result.id
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
