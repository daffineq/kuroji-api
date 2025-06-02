import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch } from '../../../../mapper/mapper.helper';
import { UpdateType } from '../../../../update/UpdateType';
import { AnimeKaiHelper } from '../utils/animekai-helper';
import {
  ANIME,
  IAnimeInfo,
  IAnimeResult,
  ISearch,
  ISource,
  StreamingServers,
  SubOrSub,
} from '@consumet/extensions';
import { getUpdateData } from '../../../../update/update.util';
import { CustomHttpService } from '../../../../http/http.service';
import { UrlConfig } from '../../../../configs/url.config';
import { AnimekaiWithRelations } from '../types/types';

const animekai = new ANIME.AnimeKai();

@Injectable()
export class AnimekaiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnimeKaiHelper,
    private readonly http: CustomHttpService,
  ) {}

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
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(animekai.id) },
      create: getUpdateData(
        String(animekai.id),
        animekai.anilistId ?? 0,
        UpdateType.ANIMEKAI,
      ),
      update: getUpdateData(
        String(animekai.id),
        animekai.anilistId ?? 0,
        UpdateType.ANIMEKAI,
      ),
    });

    await this.prisma.animeKai.upsert({
      where: { id: animekai.id },
      update: this.helper.getAnimekaiData(animekai),
      create: this.helper.getAnimekaiData(animekai),
    });

    return (await this.prisma.animeKai.findUnique({
      where: { id: animekai.id },
      include: { episodes: true },
    })) as AnimekaiWithRelations;
  }

  async update(id: string): Promise<AnimekaiWithRelations> {
    const existingAnimekai = await this.prisma.animeKai.findFirst({
      where: { id },
      include: { episodes: true },
    });

    const animekai = await this.fetchAnimekai(id);

    if (!animekai) {
      throw new Error('Animekai not found');
    }

    animekai.anilistId = existingAnimekai?.anilistId ?? 0;

    return await this.saveAnimekai(animekai);
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    // return await animekai.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
    return this.http.getResponse(
      UrlConfig.ANIMEKAI + 'watch/' + episodeId + '?dub=' + dub,
    );
  }

  async fetchAnimekai(id: string): Promise<IAnimeInfo> {
    // return await animekai.fetchAnimeInfo(id);
    return this.http.getResponse(UrlConfig.ANIMEKAI + 'info?id=' + id);
  }

  async searchAnimekai(query: string): Promise<ISearch<IAnimeResult>> {
    // return (await animekai.fetchSearchSuggestions(query)).results;
    return this.http.getResponse(UrlConfig.ANIMEKAI + query);
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
        english: anilist.title?.english || undefined,
        native: anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      episodes: anilist.episodes ?? undefined,
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
