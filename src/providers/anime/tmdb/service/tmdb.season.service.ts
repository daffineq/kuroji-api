import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { AnilistService } from '../../anilist/service/anilist.service';
import {
  findBestMatchingSeason,
  findMatchingEpisodes,
  TmdbHelper,
} from '../utils/tmdb-helper';
import { TmdbService } from './tmdb.service';
import {
  DateDetails,
  AnilistAiringSchedule,
  TmdbSeasonEpisode,
} from '@prisma/client';
import { getDateStringFromAnilist } from '../../anilist/utils/anilist-helper';
import {
  TmdbSeasonEpisodeWithRelations,
  TmdbSeasonWithRelations,
} from '../types/types';

@Injectable()
export class TmdbSeasonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilistService: AnilistService,
    private readonly tmdb: TmdbService,
    private readonly helper: TmdbHelper,
  ) {}

  async getTmdbSeasonByAnilist(id: number): Promise<TmdbSeasonWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);
    const tmdb = await this.tmdb.findTmdb(id);

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

    const airingSchedule = anilist.airingSchedule || [];
    const firstEpisodeAiring = airingSchedule.find((ep) => ep.episode === 1);
    const lastEpisodeAiring = airingSchedule.reduce(
      (latest: AnilistAiringSchedule, current: AnilistAiringSchedule) => {
        if (!latest || !current.episode || !latest.episode)
          return latest || current;
        return current.episode > latest.episode ? current : latest;
      },
      null,
    );

    const totalEpisodesFromSchedule = airingSchedule.length;
    const anilistEpisodeCount =
      anilist.shikimori?.episodesAired ||
      anilist.episodes ||
      totalEpisodesFromSchedule ||
      0;

    const firstAiringDate = firstEpisodeAiring
      ? new Date((firstEpisodeAiring.airingAt ?? 0) * 1000)
          .toISOString()
          .split('T')[0]
      : null;
    const lastAiringDate = lastEpisodeAiring
      ? new Date((lastEpisodeAiring?.airingAt ?? 0) * 1000)
          .toISOString()
          .split('T')[0]
      : null;

    const bestSeason = findBestMatchingSeason(
      existTmdbSeason,
      anilist,
      anilistStartDateString,
      anilistEndDateString,
      firstAiringDate,
      lastAiringDate,
      anilistEpisodeCount,
    );

    if (!bestSeason) {
      throw new Error('Could not find matching season for AniList entry');
    }

    const SEASONS = tmdb.number_of_seasons || 1;
    const trimmedEpisodes: TmdbSeasonEpisode[] = [];
    let foundStart = false;
    let foundEnd = false;

    const startSeason = bestSeason.season_number;

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
        tmdbSeason = await this.tmdb.fetchTmdbSeason(tmdb.id, currentSeason);
        tmdbSeason.show_id = tmdb.id;
        await this.tmdb.saveTmdbSeason(tmdbSeason);
      }

      const episodes = tmdbSeason.episodes;
      if (!episodes || episodes.length === 0) continue;

      const today = new Date().toISOString().split('T')[0];

      const episodeMatches = findMatchingEpisodes(
        episodes,
        airingSchedule,
        anilistStartDateString,
        anilistEndDateString,
        firstAiringDate,
        lastAiringDate,
        today,
      );

      for (const ep of episodeMatches) {
        trimmedEpisodes.push({
          ...ep,
          episode_number: trimmedEpisodes.length + 1,
        });
      }

      if (
        foundEnd ||
        (anilistEpisodeCount > 0 &&
          trimmedEpisodes.length >= anilistEpisodeCount)
      ) {
        break;
      }

      if (
        currentSeason === startSeason &&
        trimmedEpisodes.length < anilistEpisodeCount
      ) {
        continue;
      } else {
        break;
      }
    }

    if (trimmedEpisodes.length === 0) {
      throw new Error(
        'Could not find any matching episodes between start and end date',
      );
    }

    const newSeason: TmdbSeasonWithRelations = {
      ...bestSeason,
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

    const images = await this.tmdb.fetchEpisodeImages(
      existingEpisode.show_id,
      existingEpisode.season_number,
      existingEpisode.episode_number,
    );
    images.episodeId = existingEpisode.id;
    await this.tmdb.saveImages(images);

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
}
