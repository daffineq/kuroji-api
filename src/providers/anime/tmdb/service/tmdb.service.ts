import { Injectable } from '@nestjs/common';
import { DateDetails, TmdbSeason, TmdbSeasonEpisode } from '@prisma/client';
import { TMDB } from '../../../../configs/tmdb.config';
import { PrismaService } from '../../../../prisma.service';
import {
  findBestMatch,
  ExpectAnime,
  deepCleanTitle,
} from '../../../mapper/mapper.helper';
import { UpdateType } from '../../../update/UpdateType';
import { AnilistService } from '../../anilist/service/anilist.service';
import {
  filterSeasonEpisodes,
  findBestMatchFromSearch,
  TmdbHelper,
} from '../utils/tmdb-helper';
import { sleep } from '../../../../utils/utils';
import { getUpdateData } from '../../../update/update.util';
import {
  TmdbWithRelations,
  TmdbSeasonWithRelations,
  TmdbSeasonEpisodeWithRelations,
  TmdbResponse,
  TmdbSeasonEpisodeImagesWithRelations,
} from '../types/types';
import { Client } from '../../../model/client';
import { UrlConfig } from '../../../../configs/url.config';
import { getDateStringFromAnilist } from '../../anilist/utils/anilist-helper';

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

  async getTmdbSeasonByAnilist(id: number): Promise<TmdbSeasonWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);
    const tmdb = await this.findTmdb(id);

    const existTmdbSeason = tmdb.seasons;

    if (!existTmdbSeason || existTmdbSeason.length === 0) {
      throw new Error(`No seasons found for TMDb ID: ${tmdb.id}`);
    }

    const anilistStartDateString = getDateStringFromAnilist(
      (anilist.startDate as DateDetails) || {},
    );

    const anilistEndDateString = getDateStringFromAnilist(
      (anilist.endDate as DateDetails) || {},
    );

    if (!anilistStartDateString) {
      return Promise.reject(
        new Error('Missing start date from AniList: ' + anilist.id),
      );
    }

    const SEASONS = tmdb.number_of_seasons || 1;

    const trimmedEpisodes: TmdbSeasonEpisode[] = [];
    let foundStart = false;
    let foundEnd = false;

    const startSeason =
      existTmdbSeason.find(
        (season) =>
          season.air_date?.toLowerCase() ===
          anilistStartDateString.toLowerCase(),
      )?.season_number || 1;

    for (
      let currentSeason = startSeason;
      currentSeason <= SEASONS;
      currentSeason++
    ) {
      let tmdbSeason = await this.prisma.tmdbSeason.findFirst({
        where: { show_id: tmdb.id, season_number: currentSeason },
        include: { episodes: true },
      });

      if (!tmdbSeason) {
        tmdbSeason = await this.fetchTmdbSeason(tmdb.id, currentSeason);
        tmdbSeason.show_id = tmdb.id;

        await this.saveTmdbSeason(tmdbSeason);
      }

      const episodes = tmdbSeason.episodes;
      if (!episodes || episodes.length === 0) continue;

      const today = new Date().toISOString().split('T')[0];

      for (let i = 0; i < episodes.length; i++) {
        const ep = episodes[i];

        if (!foundStart) {
          if (ep.air_date !== anilistStartDateString) continue;
          foundStart = true;
        }

        if (!ep.air_date || ep.air_date > today) break;

        trimmedEpisodes.push({
          ...ep,
          episode_number: trimmedEpisodes.length + 1,
        });

        if (anilistEndDateString && ep.air_date === anilistEndDateString) {
          foundEnd = true;
          break;
        }
      }

      if (foundEnd) break;
    }

    if (trimmedEpisodes.length === 0) {
      throw new Error(
        'Could not find any matching episodes between start and end date',
      );
    }

    const newSeason: TmdbSeasonWithRelations = {
      ...existTmdbSeason.find((s) => s.season_number === startSeason)!,
      episodes: trimmedEpisodes,
      show_id: tmdb.id,
    };

    return newSeason;
  }

  async getEpisodeDetails(
    epId: number,
  ): Promise<TmdbSeasonEpisodeWithRelations> {
    const include = {
      images: {
        include: {
          stills: {
            omit: {
              id: true,
              episodeImagesId: true,
            },
          },
        },
        omit: {
          episodeId: true,
        },
      },
    };

    const existingEpisode = (await this.prisma.tmdbSeasonEpisode.findUnique({
      where: { id: epId },
      include,
    })) as TmdbSeasonEpisodeWithRelations;

    if (!existingEpisode) {
      throw new Error('No episode found');
    }

    if (existingEpisode.images) {
      return existingEpisode;
    }

    const images = await this.fetchEpisodeImages(
      existingEpisode.show_id,
      existingEpisode.season_number,
      existingEpisode.episode_number,
    );
    images.episodeId = existingEpisode.id;
    await this.saveImages(images);

    return (await this.prisma.tmdbSeasonEpisode.findUnique({
      where: { id: epId },
      include,
    })) as TmdbSeasonEpisodeWithRelations;
  }

  async getEpisodeDetailsByAnilist(
    id: number,
    ep: number,
  ): Promise<TmdbSeasonEpisodeWithRelations> {
    const season = await this.getTmdbSeasonByAnilist(id);
    const epId = season.episodes.find((e) => e.episode_number === ep)?.id;

    if (!epId) {
      throw new Error('Episode id not found');
    }

    return await this.getEpisodeDetails(epId);
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
    const title =
      anilist.title?.romaji ?? anilist.title?.english ?? anilist.title?.native;

    if (!title) {
      throw new Error('No title found in AniList');
    }

    let searchResults = await this.searchTmdb(deepCleanTitle(title));

    let bestMatch = findBestMatchFromSearch(anilist, searchResults.results);
    if (!bestMatch && (anilist.title as { english: string }).english) {
      searchResults = await this.searchTmdb(
        (anilist.title as { english: string }).english,
      );
      bestMatch = findBestMatchFromSearch(anilist, searchResults.results);
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
    await this.prisma.lastUpdated.upsert({
      where: {
        unique_update: {
          entityId: String(tmdb.id),
          type: UpdateType.TMDB,
        },
      },
      create: getUpdateData(String(tmdb.id), tmdb.id ?? 0, UpdateType.TMDB),
      update: getUpdateData(String(tmdb.id), tmdb.id ?? 0, UpdateType.TMDB),
    });

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
    const type = await this.detectType(id);
    const tmdb = await this.fetchTmdb(id, type);
    await this.saveTmdb(tmdb);
    await this.updateSeason(id);
    return tmdb;
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
    const candidates = await this.prisma.tmdb.findMany({
      where: {
        OR: [
          { name: { mode: 'insensitive' } },
          { original_name: { mode: 'insensitive' } },
        ],
      },
      include: {
        seasons: true,
        last_episode_to_air: true,
        next_episode_to_air: true,
      },
    });

    const searchAnime: ExpectAnime = {
      title: {
        romaji: (anilist.title as { romaji: string }).romaji,
        english: (anilist.title as { english: string }).english,
        native: (anilist.title as { native: string }).native,
      },
    };

    const bestMatch = findBestMatch(searchAnime, candidates);
    if (bestMatch) {
      return bestMatch.result as TmdbWithRelations;
    }

    throw new Error('No matching TMDb entry found');
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
