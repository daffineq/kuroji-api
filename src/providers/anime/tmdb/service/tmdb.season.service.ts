import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { AnilistService } from '../../anilist/service/anilist.service';
import { TmdbService } from './tmdb.service';
import { DateDetails, TmdbSeasonEpisode } from '@prisma/client';
import { getDateStringFromAnilist } from '../../anilist/utils/anilist-helper';
import {
  TmdbSeasonEpisodeWithRelations,
  TmdbSeasonWithRelations,
} from '../types/types';
import { AnilistWithRelations } from '../../anilist/types/types';
import { MediaFormat } from '@consumet/extensions';

interface EpisodeMatchCandidate {
  episode: TmdbSeasonEpisode;
  confidence: number;
  reasons: string[];
  anilistEpisodeNumber: number;
}

interface MatchResult {
  episodes: TmdbSeasonEpisode[];
  primarySeason: number;
  confidence: number;
}

@Injectable()
export class TmdbSeasonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilistService: AnilistService,
    private readonly tmdb: TmdbService,
  ) {}

  async getTmdbSeasonByAnilist(id: number): Promise<TmdbSeasonWithRelations> {
    const anilist = await this.anilistService.getAnilist(id);
    const tmdb = await this.tmdb.findTmdb(id);

    if (anilist.format === MediaFormat.MOVIE) {
      throw new Error('Movies cant have episodes');
    }

    if (!tmdb.seasons || tmdb.seasons.length === 0) {
      throw new Error(`No seasons found for TMDb ID: ${tmdb.id}`);
    }

    const allEpisodes = await this.getAllTmdbEpisodes(
      tmdb.id,
      tmdb.number_of_seasons || 1,
    );

    const matchResult = await this.findBestEpisodeSequence(
      anilist,
      allEpisodes,
    );

    if (!matchResult.episodes || matchResult.episodes.length === 0) {
      throw new Error('Could not find matching episodes for AniList entry');
    }

    const season = tmdb.seasons.find(
      (s) => s.season_number === matchResult.primarySeason,
    );
    if (!season) {
      throw new Error('Primary season not found');
    }

    const trimmedSeason: TmdbSeasonWithRelations = {
      ...season,
      episodes: matchResult.episodes,
      show_id: tmdb.id,
    };

    return trimmedSeason;
  }

  private async getAllTmdbEpisodes(
    showId: number,
    totalSeasons: number,
  ): Promise<TmdbSeasonEpisode[]> {
    const allEpisodes: TmdbSeasonEpisode[] = [];

    for (let seasonNum = 1; seasonNum <= totalSeasons; seasonNum++) {
      let tmdbSeason = await this.prisma.tmdbSeason.findFirst({
        where: { show_id: showId, season_number: seasonNum },
        include: { episodes: true },
      });

      if (!tmdbSeason) {
        tmdbSeason = await this.tmdb.fetchTmdbSeason(showId, seasonNum);
        tmdbSeason.show_id = showId;
        await this.tmdb.saveTmdbSeason(tmdbSeason);
      }

      if (tmdbSeason.episodes) {
        allEpisodes.push(...tmdbSeason.episodes);
      }
    }

    return allEpisodes.sort((a, b) => {
      if (a.season_number !== b.season_number) {
        return a.season_number - b.season_number;
      }
      return a.episode_number - b.episode_number;
    });
  }

  private async findBestEpisodeSequence(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
  ): Promise<MatchResult> {
    const strategies = [
      () => this.matchByAiringSchedule(anilist, allEpisodes),
      () => this.matchByDateRange(anilist, allEpisodes),
      () => this.matchByEpisodeCount(anilist, allEpisodes),
      () => this.matchBySeasonYear(anilist, allEpisodes),
    ];

    let bestMatch: MatchResult = {
      episodes: [],
      primarySeason: 1,
      confidence: 0,
    };

    for (const strategy of strategies) {
      const result = await strategy();
      if (result.confidence > bestMatch.confidence) {
        bestMatch = result;
      }
    }

    if (bestMatch.confidence < 0.5) {
      bestMatch = this.fallbackMatching(anilist, allEpisodes);
    }

    return bestMatch;
  }

  private async matchByAiringSchedule(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
  ): Promise<MatchResult> {
    const airingSchedule = anilist.airingSchedule || [];
    if (airingSchedule.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const matches: EpisodeMatchCandidate[] = [];
    const today = new Date().toISOString().split('T')[0];

    const airingMap = new Map<string, number>();
    airingSchedule.forEach((schedule) => {
      if (schedule.airingAt && schedule.episode) {
        const airDate = new Date(schedule.airingAt * 1000)
          .toISOString()
          .split('T')[0];
        airingMap.set(airDate, schedule.episode);
      }
    });

    for (const episode of allEpisodes) {
      if (!episode.air_date || episode.air_date > today) continue;

      const anilistEpisodeNum = airingMap.get(episode.air_date);
      if (anilistEpisodeNum) {
        matches.push({
          episode,
          confidence: 0.9,
          reasons: ['exact_airing_date_match'],
          anilistEpisodeNumber: anilistEpisodeNum,
        });
      }
    }

    if (matches.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    matches.sort((a, b) => a.anilistEpisodeNumber - b.anilistEpisodeNumber);

    const episodes = matches.map((match, index) => ({
      ...match.episode,
      episode_number: index + 1,
    }));

    const primarySeason = this.getMostCommonSeason(episodes);
    const confidence = Math.min(
      matches.length / Math.max(anilist.episodes || 12, 1),
      1,
    );

    return { episodes, primarySeason, confidence };
  }

  private async matchByDateRange(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
  ): Promise<MatchResult> {
    const startDate = getDateStringFromAnilist(
      (anilist.startDate as DateDetails) || {},
    );
    const endDate = getDateStringFromAnilist(
      (anilist.endDate as DateDetails) || {},
    );

    if (!startDate) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    const filteredEpisodes = allEpisodes.filter((ep) => {
      if (!ep.air_date || ep.air_date > today) return false;

      const epDate = ep.air_date;
      if (epDate < startDate) return false;
      if (endDate && epDate > endDate) return false;

      return true;
    });

    if (filteredEpisodes.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const episodes = filteredEpisodes.map((ep, index) => ({
      ...ep,
      episode_number: index + 1,
    }));

    const primarySeason = this.getMostCommonSeason(episodes);

    const expectedCount = anilist.episodes || 12;
    const countDiff = Math.abs(episodes.length - expectedCount);
    const confidence = Math.max(0.2, 1 - countDiff / expectedCount);

    return { episodes, primarySeason, confidence };
  }

  private async matchByEpisodeCount(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
  ): Promise<MatchResult> {
    const expectedCount = anilist.episodes;
    if (!expectedCount) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    const availableEpisodes = allEpisodes.filter(
      (ep) => ep.air_date && ep.air_date <= today,
    );

    if (availableEpisodes.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    let bestSequence: TmdbSeasonEpisode[] = [];
    let bestConfidence = 0;

    for (
      let start = 0;
      start <= availableEpisodes.length - expectedCount;
      start++
    ) {
      const sequence = availableEpisodes.slice(start, start + expectedCount);

      let validSequence = true;
      for (let i = 1; i < sequence.length; i++) {
        const prevDate = new Date(sequence[i - 1].air_date!);
        const currDate = new Date(sequence[i].air_date!);
        const daysDiff =
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff > 30) {
          validSequence = false;
          break;
        }
      }

      if (validSequence) {
        const confidence = 0.7;
        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          bestSequence = sequence;
        }
      }
    }

    if (bestSequence.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const episodes = bestSequence.map((ep, index) => ({
      ...ep,
      episode_number: index + 1,
    }));

    const primarySeason = this.getMostCommonSeason(episodes);

    return { episodes, primarySeason, confidence: bestConfidence };
  }

  private async matchBySeasonYear(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
  ): Promise<MatchResult> {
    if (!anilist.seasonYear) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    const yearEpisodes = allEpisodes.filter((ep) => {
      if (!ep.air_date || ep.air_date > today) return false;
      const epYear = new Date(ep.air_date).getFullYear();
      return Math.abs(epYear - anilist.seasonYear!) <= 1;
    });

    if (yearEpisodes.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const expectedCount = anilist.episodes || Math.min(yearEpisodes.length, 24);
    const episodes = yearEpisodes.slice(0, expectedCount).map((ep, index) => ({
      ...ep,
      episode_number: index + 1,
    }));

    const primarySeason = this.getMostCommonSeason(episodes);
    const confidence = 0.5;

    return { episodes, primarySeason, confidence };
  }

  private fallbackMatching(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
  ): MatchResult {
    const today = new Date().toISOString().split('T')[0];
    const availableEpisodes = allEpisodes.filter(
      (ep) => ep.air_date && ep.air_date <= today,
    );

    if (availableEpisodes.length === 0) {
      throw new Error('No available episodes found');
    }

    const expectedCount = anilist.episodes || 12;
    const season1Episodes = availableEpisodes.filter(
      (ep) => ep.season_number === 1,
    );

    const episodes = season1Episodes
      .slice(0, expectedCount)
      .map((ep, index) => ({
        ...ep,
        episode_number: index + 1,
      }));

    return {
      episodes:
        episodes.length > 0
          ? episodes
          : availableEpisodes.slice(0, expectedCount),
      primarySeason: 1,
      confidence: 0.3,
    };
  }

  private getMostCommonSeason(episodes: TmdbSeasonEpisode[]): number {
    const seasonCounts = new Map<number, number>();
    episodes.forEach((ep) => {
      seasonCounts.set(
        ep.season_number,
        (seasonCounts.get(ep.season_number) || 0) + 1,
      );
    });

    let mostCommonSeason = 1;
    let maxCount = 0;
    seasonCounts.forEach((count, season) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonSeason = season;
      }
    });

    return mostCommonSeason;
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
