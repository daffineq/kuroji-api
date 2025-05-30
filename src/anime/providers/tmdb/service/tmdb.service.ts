import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  DateDetails,
  Tmdb,
  TmdbLastEpisodeToAir,
  TmdbNextEpisodeToAir,
  TmdbReleaseSeason,
  TmdbSeason,
  TmdbSeasonEpisode,
} from '@prisma/client';
import { TMDB } from '../../../../configs/tmdb.config';
import { CustomHttpService } from '../../../../http/http.service';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch, ExpectAnime, deepCleanTitle } from '../../../../mapper/mapper.helper';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnilistService } from '../../anilist/service/anilist.service';
import { TmdbHelper } from '../utils/tmdb-helper';
import { AnilistWithRelations } from '../../anilist/model/AnilistModels'
import { sleep } from '../../../../shared/utils'
import { getUpdateData } from '../../../../update/update.util'

export interface BasicTmdb {
  id: number;
  original_name: string;
  media_type: string;
  name: string;
}

export interface TmdbResponse {
  results: BasicTmdb[];
}

export interface TmdbWithRelations extends Tmdb {
  last_episode_to_air?: TmdbLastEpisodeToAir;
  next_episode_to_air?: TmdbNextEpisodeToAir;
  seasons: TmdbReleaseSeason[]
}

export interface TmdbSeasonWithRelations extends TmdbSeason {
  episodes: TmdbSeasonEpisode[]
}

export enum TmdbStatus {
  Rumored = "Rumored",
  Planned = "Planned",
  InProduction = "In Production",
  PostProduction = "Post Production",
  Released = "Released",
  ReturningSeries = "Returning Series",
  Ended = "Ended",
  Canceled = "Canceled"
}

@Injectable()
export class TmdbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilistService: AnilistService,
    private readonly customHttpService: CustomHttpService,
    private readonly helper: TmdbHelper,
  ) {}

  // Core TMDB Methods
  async getTmdb(id: number): Promise<TmdbWithRelations> {
    const existingTmdb = await this.prisma.tmdb.findUnique({
      where: { id },
      include: { 
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      }
    }) as TmdbWithRelations;

    if (existingTmdb) return existingTmdb;

    const type = await this.detectType(id);
    const tmdb = await this.fetchTmdb(id, type);

    return await this.saveTmdb(tmdb as TmdbWithRelations);
  }

  async getTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    return await this.findTmdb(id);
  }

  async getTmdbSeasonByAnilist(id: number): Promise<TmdbSeasonWithRelations> {
    const anilist = await this.anilistService.getAnilist(id)
    const tmdb = await this.findTmdb(id);

    const existTmdbSeason = tmdb.seasons

    if (!existTmdbSeason || existTmdbSeason.length === 0) {
      throw new Error(`No seasons found for TMDb ID: ${tmdb.id}`);
    }

    const { year, month, day } = anilist.startDate as DateDetails || {}
    const { year: endYear, month: endMonth, day: endDay } = anilist.endDate as DateDetails || {}

    let anilistStartDateString: string | null = null
    let anilistEndDateString: string | null = null

    if (year && month && day) {
      anilistStartDateString = `${year.toString().padStart(4, '0')}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }

    if (endYear && endMonth && endDay) {
      anilistEndDateString = `${endYear.toString().padStart(4, '0')}-${endMonth
        .toString()
        .padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`
    }

    if (!anilistStartDateString) {
      return Promise.reject(new Error('Missing start date from AniList: ' + anilist.id));
    }

    const SEASONS = tmdb.number_of_seasons || 1

    let seasonNumber = existTmdbSeason.find(
      (season) =>
        season.air_date?.toLowerCase() === anilistStartDateString.toLowerCase(),
    )?.season_number || 1

    for (let currentSeason = seasonNumber; currentSeason <= SEASONS; currentSeason++) {
      let tmdbSeason = await this.prisma.tmdbSeason.findFirst({
        where: { show_id: tmdb.id, season_number: currentSeason },
        include: { episodes: true }
      });

      if (!tmdbSeason) {
        tmdbSeason = await this.fetchTmdbSeason(tmdb.id, currentSeason);
        tmdbSeason.show_id = tmdb.id

        await this.saveTmdbSeason(tmdbSeason)
      }

      const episodes = tmdbSeason.episodes
      if (!episodes || episodes.length === 0) continue

      let startIndex = episodes.findIndex(ep => ep.air_date === anilistStartDateString)
      if (startIndex === -1) continue

      const trimmedEpisodes: TmdbSeasonEpisode[] = []

      const today = new Date().toISOString().split('T')[0]

      for (let i = startIndex; i < episodes.length; i++) {
        const ep = { ...episodes[i], episode_number: trimmedEpisodes.length + 1 }

        if (ep.air_date && ep.air_date > today) break

        trimmedEpisodes.push(ep)
        if (ep.air_date === anilistEndDateString) break
      }

      if (trimmedEpisodes.length === 0) continue

      const newSeason: TmdbSeasonWithRelations = {
        ...tmdbSeason,
        episodes: trimmedEpisodes,
        show_id: tmdb.id,
      }

      return newSeason
    }

    throw new Error('Not found');
  }  

  // Data Fetching Methods
  async fetchTmdb(id: number, type: string): Promise<TmdbWithRelations> {
    const url =
      type === 'tv' ? TMDB.getTvDetails(id) : TMDB.getMovieDetails(id);
    return this.customHttpService.getResponse(url);
  }

  async fetchTmdbSeason(id: number, seasonNumber: number): Promise<TmdbSeasonWithRelations> {
    const seasonData: TmdbSeasonWithRelations = await this.customHttpService.getResponse(
      TMDB.getSeasonDetails(id, seasonNumber),
    );
    return this.filterSeasonEpisodes(seasonData);
  }

  async fetchTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);
    const title = anilist.title?.romaji ?? anilist.title?.english ?? anilist.title?.native;

    if (!title) {
      throw new Error('No title found in AniList');
    }

    let searchResults = await this.searchTmdb(
      deepCleanTitle(title)
    );

    let bestMatch = this.findBestMatchFromSearch(
      anilist,
      searchResults.results,
    );
    if (!bestMatch && (anilist.title as { english: string }).english) {
      searchResults = await this.searchTmdb(
        (anilist.title as { english: string }).english,
      );
      bestMatch = this.findBestMatchFromSearch(anilist, searchResults.results);
    }
    if (!bestMatch) {
      throw new Error('No matching TMDb entry found');
    }
    const fetchedTmdb = await this.fetchTmdb(
      bestMatch.id,
      bestMatch.media_type,
    );
    fetchedTmdb.media_type = bestMatch.media_type;
    return await this.saveTmdb(fetchedTmdb);
  }

  async searchTmdb(query: string): Promise<TmdbResponse> {
    return this.customHttpService.getResponse(TMDB.multiSearch(query));
  }

  // Database Operations
  async saveTmdb(tmdb: TmdbWithRelations): Promise<TmdbWithRelations> {
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(tmdb.id) },
      create: getUpdateData(String(tmdb.id), tmdb.id ?? 0, UpdateType.TMDB),
      update: getUpdateData(String(tmdb.id), tmdb.id ?? 0, UpdateType.TMDB),
    });

    await this.prisma.tmdb.upsert({
      where: { id: tmdb.id },
      update: this.helper.getTmdbData(tmdb),
      create: this.helper.getTmdbData(tmdb),
    })

    return await this.prisma.tmdb.findUnique({
      where: { id: tmdb.id },
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      }
    }) as TmdbWithRelations;
  }

  async saveTmdbSeason(tmdbSeason: TmdbSeason): Promise<TmdbSeason> {
    return this.prisma.tmdbSeason.upsert({
      where: { id: tmdbSeason.id },
      update: this.helper.getTmdbSeasonData(tmdbSeason),
      create: this.helper.getTmdbSeasonData(tmdbSeason),
    });
  }

  // Update Methods
  async update(id: number): Promise<TmdbWithRelations> {
    const type = await this.detectType(id);
    const tmdb = await this.fetchTmdb(id, type);
    await this.saveTmdb(tmdb);
    await this.updateSeason(id);
    return tmdb;
  }

  async updateSeason(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.prisma.tmdb.findFirst({
      where: { id },
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      }
    }) as TmdbWithRelations;

    if (!tmdb) {
      throw new Error(`TMDb ID ${id} not found`);
    }

    for (const season of tmdb.seasons) {
      const tmdbSeason = await this.fetchTmdbSeason(id, season.season_number || 1);
      await this.saveTmdbSeason(tmdbSeason);

      await sleep(5);
    }

    return tmdb;
  }

  // Matching Methods
  async findTmdb(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.findMatchInPrisma(id).catch(() => null)
    if (tmdb) return tmdb;
    return await this.fetchTmdbByAnilist(id);
  }

  async findMatchInPrisma(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);
    const candidates = await this.prisma.tmdb.findMany({
      where: {
        OR: [
          { name: { mode: 'insensitive' } },
          { original_name: { mode: 'insensitive' } }
        ]
      },
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      }
    });

    const searchAnime: ExpectAnime = {
      title: {
        romaji: (anilist.title as { romaji: string }).romaji,
        english: (anilist.title as { english: string }).english,
        native: (anilist.title as { native: string }).native
      }
    };

    const bestMatch = findBestMatch(searchAnime, candidates);
    if (bestMatch) {
      return bestMatch.result as TmdbWithRelations;
    }

    throw new Error('No matching TMDb entry found');
  }

  findBestMatchFromCandidates(
    anilist: AnilistWithRelations,
    candidates: TmdbWithRelations[],
  ): TmdbWithRelations | null {
    const searchAnime: ExpectAnime = {
      title: {
        romaji: (anilist.title as { romaji: string }).romaji,
        english: (anilist.title as { english: string }).english,
        native: (anilist.title as { native: string }).native
      },
      year: anilist.startDate?.year ?? undefined,
      episodes: anilist.episodes ?? undefined
    };

    const mediaTypeFiltered = candidates.filter(
      tmdb => tmdb.media_type?.toLowerCase() === anilist.format?.toLowerCase()
    );

    const bestMatch = findBestMatch(searchAnime, mediaTypeFiltered);
    if (bestMatch) {
      return bestMatch.result;
    }

    return null;
  }

  findBestMatchFromSearch(
    anilist: AnilistWithRelations,
    results: BasicTmdb[] | undefined,
  ): BasicTmdb | null {
    if (!results || !Array.isArray(results)) return null;

    const searchAnime: ExpectAnime = {
      title: {
        romaji: (anilist.title as { romaji: string }).romaji,
        english: (anilist.title as { english: string }).english,
        native: (anilist.title as { native: string }).native
      },
      year: anilist.startDate?.year ?? undefined,
      episodes: anilist.episodes ?? undefined
    };

    const bestMatch = findBestMatch(searchAnime, results.map(result => ({
      id: result.id,
      title: {
        english: result.name,
        native: result.original_name
      }
    })));

    if (bestMatch) {
      return results.find(r => r.id === bestMatch.result.id) || null;
    }

    return null;
  }

  // Helper Methods
  private filterSeasonEpisodes(seasonData: TmdbSeasonWithRelations): TmdbSeasonWithRelations {
    const filteredEpisodes = (seasonData.episodes).map((episode) => ({
      id: episode.id,
      air_date: episode.air_date,
      episode_number: episode.episode_number,
      episode_type: episode.episode_type,
      name: episode.name,
      overview: episode.overview,
      production_code: episode.production_code,
      runtime: episode.runtime,
      season_number: episode.season_number,
      show_id: episode.show_id,
      still_path: episode.still_path,
      vote_average: episode.vote_average,
      vote_count: episode.vote_count,
    })) as TmdbSeasonEpisode[];

    seasonData.episodes = filteredEpisodes;
    return seasonData;
  }

  async detectType(id: number): Promise<string> {
    try {
      await this.customHttpService.getResponse(TMDB.getTvDetails(id));
      return 'tv';
    } catch (e1) {
      try {
        await this.customHttpService.getResponse(TMDB.getMovieDetails(id));
        return 'movie';
      } catch (e2) {
        throw new Error('ID not found in TMDb as Movie or TV Show.');
      }
    }
  }
}