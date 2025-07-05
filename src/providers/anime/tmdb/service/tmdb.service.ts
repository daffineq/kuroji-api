import { Injectable } from '@nestjs/common';
import { TmdbSeason } from '@prisma/client';
import { TMDB } from '../../../../configs/tmdb.config.js';
import { PrismaService } from '../../../../prisma.service.js';
import {
  findBestMatch,
  ExpectAnime,
  deepCleanTitle,
} from '../../../mapper/mapper.helper.js';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import {
  filterSeasonEpisodes,
  findBestMatchFromSearch,
  TmdbHelper,
} from '../utils/tmdb-helper.js';
import { sleep } from '../../../../utils/utils.js';
import {
  TmdbWithRelations,
  TmdbSeasonWithRelations,
  TmdbResponse,
  TmdbSeasonEpisodeImagesWithRelations,
  BasicTmdb,
} from '../types/types.js';
import { Client } from '../../../model/client.js';
import { UrlConfig } from '../../../../configs/url.config.js';

@Injectable()
export class TmdbService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilistService: AnilistService,
    private readonly helper: TmdbHelper,
  ) {
    super(UrlConfig.TMDB);
  }

  // Core TMDB Methods
  async getTmdb(id: number): Promise<TmdbWithRelations> {
    const existingTmdb = (await this.prisma.tmdb.findUnique({
      where: { id },
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      },
    })) as TmdbWithRelations;

    if (existingTmdb) return existingTmdb;

    const type = await this.detectType(id);
    const tmdb = await this.fetchTmdb(id, type);

    return await this.saveTmdb(tmdb);
  }

  async getTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    return await this.findTmdb(id);
  }

  // Data Fetching Methods
  async fetchTmdb(id: number, type: string): Promise<TmdbWithRelations> {
    const url =
      type === 'tv' ? TMDB.getTvDetails(id) : TMDB.getMovieDetails(id);
    const { data, error } = await this.client.get<TmdbWithRelations>(url);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchTmdbSeason(
    id: number,
    seasonNumber: number,
  ): Promise<TmdbSeasonWithRelations> {
    const { data, error } = await this.client.get<TmdbSeasonWithRelations>(
      TMDB.getSeasonDetails(id, seasonNumber),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return filterSeasonEpisodes(data);
  }

  async fetchTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);
    const possibleTitles = [
      anilist.title?.native,
      anilist.title?.romaji,
      anilist.title?.english,
    ].filter(Boolean) as string[];

    if (possibleTitles.length === 0) {
      throw new Error('No title found in AniList');
    }

    let bestMatch: BasicTmdb | null = null;

    for (const title of possibleTitles) {
      const searchResults = await this.searchTmdb(deepCleanTitle(title));
      bestMatch = findBestMatchFromSearch(anilist, searchResults.results);
      if (bestMatch) break;
    }

    if (!bestMatch) {
      throw new Error('No matching TMDb entry found');
    }

    const fetchedTmdb = await this.fetchTmdb(
      bestMatch.id,
      bestMatch.media_type,
    );
    fetchedTmdb.media_type = bestMatch.media_type;

    return this.saveTmdb(fetchedTmdb);
  }

  async searchTmdb(query: string): Promise<TmdbResponse> {
    const { data, error } = await this.client.get<TmdbResponse>(
      TMDB.multiSearch(query),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchEpisodeImages(
    tvId: number,
    seasonNumber: number,
    episode: number,
  ): Promise<TmdbSeasonEpisodeImagesWithRelations> {
    const { data, error } =
      await this.client.get<TmdbSeasonEpisodeImagesWithRelations>(
        TMDB.getEpisodeImages(tvId, seasonNumber, episode),
      );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  // Database Operations
  async saveTmdb(tmdb: TmdbWithRelations): Promise<TmdbWithRelations> {
    return (await this.prisma.tmdb.upsert({
      where: { id: tmdb.id },
      update: this.helper.getTmdbData(tmdb),
      create: this.helper.getTmdbData(tmdb),
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      },
    })) as TmdbWithRelations;
  }

  async saveTmdbSeason(
    tmdbSeason: TmdbSeasonWithRelations,
  ): Promise<TmdbSeason> {
    return this.prisma.tmdbSeason.upsert({
      where: { id: tmdbSeason.id },
      update: this.helper.getTmdbSeasonData(tmdbSeason),
      create: this.helper.getTmdbSeasonData(tmdbSeason),
      include: {
        episodes: true,
      },
    });
  }

  async saveImages(
    images: TmdbSeasonEpisodeImagesWithRelations,
  ): Promise<TmdbSeasonEpisodeImagesWithRelations> {
    return this.prisma.tmdbSeasonEpisodeImages.create({
      data: this.helper.getTmdbEpisodeImagesData(images),
      include: {
        stills: true,
      },
    });
  }

  // Update Methods
  async update(id: number): Promise<TmdbWithRelations> {
    const existingTmdb = await this.getTmdb(id);
    const tmdb = await this.fetchTmdb(id, existingTmdb.media_type ?? 'tv');
    await this.saveTmdb(tmdb);
    await this.updateSeason(id);
    return tmdb;
  }

  async updateByAnilist(id: number) {
    const tmdb = await this.getTmdbByAnilist(id);
    return await this.update(tmdb.id);
  }

  async updateSeason(id: number): Promise<TmdbWithRelations> {
    const tmdb = (await this.prisma.tmdb.findFirst({
      where: { id },
      include: {
        seasons: true,
      },
    })) as TmdbWithRelations;

    if (!tmdb) {
      throw new Error(`TMDb ID ${id} not found`);
    }

    for (const season of tmdb.seasons) {
      const tmdbSeason = await this.fetchTmdbSeason(
        id,
        season.season_number || 1,
      );
      tmdbSeason.show_id = tmdb.id;
      await this.saveTmdbSeason(tmdbSeason);

      await sleep(15);
    }

    return tmdb;
  }

  // Matching Methods
  async findTmdb(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.findMatchInPrisma(id).catch(() => null);
    if (tmdb) return tmdb;
    return await this.fetchTmdbByAnilist(id);
  }

  async findMatchInPrisma(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);

    const titles = [
      anilist.title?.native,
      anilist.title?.romaji,
      anilist.title?.english,
    ].filter(Boolean) as string[];

    const candidates = await this.prisma.tmdb.findMany({
      where: {
        OR: titles.flatMap((t) => [
          { name: { contains: deepCleanTitle(t), mode: 'insensitive' } },
          {
            original_name: { contains: deepCleanTitle(t), mode: 'insensitive' },
          },
        ]),
      },
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      },
      take: 25,
    });

    const searchAnime: ExpectAnime = {
      title: {
        romaji: anilist.title?.romaji ?? undefined,
        english: anilist.title?.english ?? undefined,
        native: anilist.title?.native ?? undefined,
      },
      synonyms: anilist.synonyms,
    };

    const bestMatch = findBestMatch(
      searchAnime,
      candidates.map((result) => ({
        id: result.id,
        title: result.name ?? undefined,
        japaneseTitle: result.original_name ?? undefined,
      })),
    );

    if (!bestMatch) {
      throw new Error('No matching TMDb entry found');
    }

    return candidates.find(
      (c) => c.id === bestMatch.result.id,
    )! as TmdbWithRelations;
  }

  async detectType(id: number): Promise<string> {
    try {
      await this.fetchTmdb(id, 'tv');
      return 'tv';
    } catch (_) {
      try {
        await this.fetchTmdb(id, 'movie');
        return 'movie';
      } catch (_) {
        throw new Error('ID not found in TVDB as Movie or Series.');
      }
    }
  }
}
