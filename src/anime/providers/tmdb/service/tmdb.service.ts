import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  DateDetails,
  Tmdb,
  TmdbReleaseSeason,
  TmdbSeason,
  TmdbSeasonEpisode,
} from '@prisma/client';
import { TMDB } from '../../../../configs/tmdb.config';
import { CustomHttpService } from '../../../../http/http.service';
import { PrismaService } from '../../../../prisma.service';
import { ScrapeHelper } from '../../../../scrapper/scrape-helper';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnilistService } from '../../anilist/service/anilist.service';
import { TmdbHelper } from '../utils/tmdb-helper';
import { AnilistWithRelations } from '../../anilist/model/AnilistModels'
import { sleep } from '../../../../shared/utils'

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
    @Inject(forwardRef(() => AnilistService))
    private readonly anilistService: AnilistService,
    private readonly customHttpService: CustomHttpService,
    private readonly helper: TmdbHelper,
  ) {}

  async getTmdb(id: number): Promise<TmdbWithRelations> {
    const existingTmdb = await this.prisma.tmdb.findUnique({
      where: { id },
      include: { seasons: true }
    });

    if (existingTmdb) return existingTmdb;

    const tmdb = await this.fetchTmdb(id, await this.detectType(id));

    return await this.saveTmdb(tmdb as TmdbWithRelations);
  }

  async getTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    return await this.findTmdb(id);
  }

  async getTmdbSeasonByAnilist(id: number, formatEpisodes = true): Promise<TmdbSeasonWithRelations> {
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
        tmdbSeason = await this.fetchTmdbSeason(tmdb.id, currentSeason)
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
        let ep;

        if (formatEpisodes) {
          ep = { ...episodes[i], episode_number: trimmedEpisodes.length + 1 }
        } else {
          ep = { ...episodes[i] }
        }

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

  async saveTmdb(tmdb: TmdbWithRelations): Promise<TmdbWithRelations> {
    await this.prisma.lastUpdated.create({
      data: {
        entityId: String(tmdb.id),
        externalId: tmdb.id,
        type: UpdateType.TMDB,
      },
    });

    await this.prisma.tmdb.upsert({
      where: { id: tmdb.id },
      update: this.helper.getTmdbData(tmdb),
      create: this.helper.getTmdbData(tmdb),
    })

    return await this.prisma.tmdb.findUnique({
      where: { id: tmdb.id },
      include: { seasons: true }
    }) as TmdbWithRelations;
  }

  async saveTmdbSeason(tmdbSeason: TmdbSeason): Promise<TmdbSeason> {
    return this.prisma.tmdbSeason.upsert({
      where: { id: tmdbSeason.id },
      update: this.helper.getTmdbSeasonData(tmdbSeason),
      create: this.helper.getTmdbSeasonData(tmdbSeason),
    });
  }

  async update(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.fetchTmdb(id, await this.detectType(id));
    await this.saveTmdb(tmdb);
    await this.updateSeason(id);
    return tmdb;
  }

  async updateSeason(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.prisma.tmdb.findFirst({
      where: { id },
      include: { seasons: true }
    });

    if (!tmdb) {
      throw new Error(`TMDb ID ${id} not found`);
    }

    for (const season of tmdb.seasons) {
      const tmdbSeason = await this.fetchTmdbSeason(id, season.season_number || 1);
      await this.saveTmdbSeason(tmdbSeason);

      sleep(5);
    }

    return tmdb;
  }

  async fetchTmdb(id: number, type: string): Promise<TmdbWithRelations> {
    const url =
      type === 'tv' ? TMDB.getTvDetails(id) : TMDB.getMovieDetails(id);
    return this.customHttpService.getResponse(url);
  }

  async fetchTmdbSeason(id: number, seasonNumber: number): Promise<TmdbSeasonWithRelations> {
    const seasonData: TmdbSeasonWithRelations = await this.customHttpService.getResponse(
      TMDB.getSeasonDetails(id, seasonNumber),
    );

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

  async searchTmdb(query: string): Promise<TmdbResponse> {
    return this.customHttpService.getResponse(TMDB.multiSearch(query));
  }

  async findTmdb(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.findMatchInPrisma(id)
    if (tmdb) return tmdb;
    return await this.fetchTmdbByAnilist(id);
  }

  async findMatchInPrisma(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);

    let match = await this.prisma.tmdb.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: (anilist.title as { romaji: string }).romaji,
              mode: 'insensitive',
            }
          },
          {
            name: {
              equals: (anilist.title as { english: string }).english,
              mode: 'insensitive',
            }
          },
          {
            original_name: {
              equals: (anilist.title as { native: string }).native,
              mode: 'insensitive',
            }
          }
        ]
      },
      include: { seasons: true }
    });

    if (match && this.isTitleMatch(anilist, match as TmdbWithRelations)) {
      return match as TmdbWithRelations;
    }

    const candidates = await this.prisma.tmdb.findMany({
      where: {
        OR: [
          {
            name: {
              contains: ScrapeHelper.normalizeTitle((anilist.title as { romaji: string }).romaji),
              mode: 'insensitive',
            }
          },
          {
            name: {
              contains: ScrapeHelper.normalizeTitle((anilist.title as { english: string }).english || ''),
              mode: 'insensitive',
            }
          },
          {
            original_name: {
              contains: ScrapeHelper.normalizeTitle((anilist.title as { native: string }).native),
              mode: 'insensitive',
            }
          }
        ]
      },
      include: { seasons: true }
    });

    const bestMatch = this.findBestMatchFromCandidates(anilist, candidates as TmdbWithRelations[]);
    
    if (bestMatch) {
      return bestMatch;
    }

    return Promise.resolve(undefined as unknown as TmdbWithRelations);
  }

  isTitleMatch(anilist: AnilistWithRelations, tmdb: TmdbWithRelations): boolean {
    if (anilist.format?.toLowerCase() != tmdb.media_type?.toLowerCase()) {
      return false;
    }

    return ScrapeHelper.compareTitles(
      (anilist.title as { romaji: string }).romaji,
      (anilist.title as { english: string }).english,
      (anilist.title as { native: string }).native,
      anilist.synonyms,
      tmdb.name!!,
      tmdb.original_name!!,
    );
  }

  findBestMatchFromCandidates(
    anilist: AnilistWithRelations,
    candidates: TmdbWithRelations[],
  ): TmdbWithRelations | null {
    return candidates.find((tmdb) => this.isTitleMatch(anilist, tmdb)) || null;
  }

  async fetchTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);

    let searchResults = await this.searchTmdb(
      ScrapeHelper.normalizeTitle(anilist.title?.romaji ?? anilist.title?.english ?? ''),
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

  findBestMatchFromSearch(
    anilist: AnilistWithRelations,
    results: BasicTmdb[] | undefined,
  ): BasicTmdb | null {
    if (!results || !Array.isArray(results)) return null

    return (
      results.find((result) =>
        anilist.format?.toLowerCase() === result.media_type.toLowerCase() &&
        ScrapeHelper.compareTitles(
          (anilist.title as { romaji: string }).romaji,
          (anilist.title as { english: string }).english,
          (anilist.title as { native: string }).native,
          anilist.synonyms,
          result.name,
          result.original_name,
        )
      ) || null
    )
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