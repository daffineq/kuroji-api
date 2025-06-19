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

interface SeasonEpisodeGroup {
  seasonNumber: number;
  episodes: TmdbSeasonEpisode[];
  totalEpisodes: number;
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

    if (anilist.format === MediaFormat.MOVIE) {
      throw new Error('Movies cant have episodes');
    }

    const tmdb = await this.tmdb.findTmdb(id);

    if (!tmdb.seasons || tmdb.seasons.length === 0) {
      throw new Error(`No seasons found for TMDb ID: ${tmdb.id}`);
    }

    const allEpisodes = await this.getAllTmdbEpisodes(tmdb.id);

    const mainEpisodes = this.filterMainEpisodes(allEpisodes);

    console.log(JSON.stringify(mainEpisodes[mainEpisodes.length - 1]));

    const seasonGroups = this.groupEpisodesBySeasons(mainEpisodes);

    const matchResult = await this.findBestEpisodeSequence(
      anilist,
      mainEpisodes,
      seasonGroups,
    );

    if (!matchResult.episodes || matchResult.episodes.length === 0) {
      throw new Error('Could not find matching episodes for AniList entry');
    }

    if (matchResult.confidence < 0.4) {
      throw new Error(
        `Episode matching confidence too low (${matchResult.confidence.toFixed(2)})`,
      );
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
  ): Promise<TmdbSeasonEpisode[]> {
    const tmdb = await this.tmdb.getTmdb(showId);

    const allEpisodes: TmdbSeasonEpisode[] = [];

    for (const season of tmdb.seasons) {
      let tmdbSeason = await this.prisma.tmdbSeason.findFirst({
        where: { show_id: showId, season_number: season.season_number },
        include: { episodes: true },
      });

      if (!tmdbSeason) {
        try {
          tmdbSeason = await this.tmdb.fetchTmdbSeason(
            showId,
            season.season_number,
          );
          tmdbSeason.show_id = showId;
          await this.tmdb.saveTmdbSeason(tmdbSeason);
        } catch (error) {
          console.warn(
            `Season ${season.season_number} not found for show ${showId}`,
          );
          continue;
        }
      }

      if (tmdbSeason.episodes && tmdbSeason.episodes.length > 0) {
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

  private filterMainEpisodes(
    episodes: TmdbSeasonEpisode[],
  ): TmdbSeasonEpisode[] {
    const today = new Date();

    return episodes.filter((ep) => {
      const isSpecial = ep.season_number === 0;
      if (isSpecial) return false;

      if (!ep.air_date) return false;

      const airDate = new Date(ep.air_date);
      if (airDate > today) return false;

      return true;
    });
  }

  private groupEpisodesBySeasons(
    episodes: TmdbSeasonEpisode[],
  ): SeasonEpisodeGroup[] {
    const seasonMap = new Map<number, TmdbSeasonEpisode[]>();

    episodes.forEach((episode) => {
      if (!seasonMap.has(episode.season_number)) {
        seasonMap.set(episode.season_number, []);
      }
      seasonMap.get(episode.season_number)!.push(episode);
    });

    return Array.from(seasonMap.entries()).map(
      ([seasonNumber, seasonEpisodes]) => ({
        seasonNumber,
        episodes: seasonEpisodes.sort(
          (a, b) => a.episode_number - b.episode_number,
        ),
        totalEpisodes: seasonEpisodes.length,
      }),
    );
  }

  private async findBestEpisodeSequence(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[],
  ): Promise<MatchResult> {
    const strategies = [
      () => this.matchByDateRange(anilist, allEpisodes, seasonGroups),
      () => this.matchByEpisodeCount(anilist, allEpisodes, seasonGroups),
      () => this.matchByAiringSchedule(anilist, allEpisodes),
      () => this.matchBySeasonYear(anilist, allEpisodes, seasonGroups),
    ];

    let bestMatch: MatchResult = {
      episodes: [],
      primarySeason: 1,
      confidence: 0,
    };

    console.log(
      `Trying to match ${anilist.shikimori?.episodesAired ?? anilist.episodes} episodes for AniList ID ${anilist.id}`,
    );

    for (const [index, strategy] of strategies.entries()) {
      try {
        const result = await strategy();
        console.log(`Strategy ${index + 1} result:`, {
          episodeCount: result.episodes.length,
          confidence: result.confidence,
          primarySeason: result.primarySeason,
        });

        if (result.confidence > bestMatch.confidence) {
          bestMatch = result;
        }
      } catch (error) {
        console.warn(`Strategy ${index + 1} failed:`, error);
        continue;
      }
    }

    if (bestMatch.confidence < 0.4) {
      throw new Error('No reliable episode matching strategy succeeded');
    }

    return bestMatch;
  }

  private async matchByDateRange(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[],
  ): Promise<MatchResult> {
    const startDate = getDateStringFromAnilist(
      (anilist.startDate as DateDetails) || {},
    );
    const endDate = getDateStringFromAnilist(
      (anilist.endDate as DateDetails) || {},
    );

    if (!startDate || !anilist.seasonYear) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const filteredEpisodes = allEpisodes.filter((ep) => {
      if (!ep.air_date) return false;

      const airDate = new Date(ep.air_date);
      const start = new Date(startDate);

      if (isNaN(airDate.getTime()) || isNaN(start.getTime())) return false;

      if (airDate < start) return false;

      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime()) && airDate > end) return false;
      }

      return true;
    });

    if (filteredEpisodes.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const expectedCount = anilist.shikimori?.episodesAired ?? anilist.episodes;
    if (!expectedCount) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    filteredEpisodes.sort((a, b) => a.air_date!.localeCompare(b.air_date!));

    const episodes = filteredEpisodes
      .slice(0, expectedCount + 1)
      .map((ep, index) => ({
        ...ep,
        episode_number: index + 1,
      }));

    const primarySeason = this.getMostCommonSeason(episodes);

    const countMatch = episodes.length / expectedCount;
    const confidence = Math.min(0.9, countMatch * 0.85);

    return { episodes, primarySeason, confidence };
  }

  private async matchByEpisodeCount(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[],
  ): Promise<MatchResult> {
    const expectedCount = anilist.shikimori?.episodesAired ?? anilist.episodes;
    if (!expectedCount || !anilist.seasonYear) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const anilistYear = anilist.seasonYear;

    for (const seasonGroup of seasonGroups) {
      const seasonYearEpisodes = seasonGroup.episodes.filter((ep) => {
        if (!ep.air_date) return false;
        const epYear = new Date(ep.air_date).getFullYear();
        return epYear === anilistYear || epYear === anilistYear + 1;
      });

      if (seasonYearEpisodes.length === expectedCount) {
        const episodes = seasonYearEpisodes
          .sort((a, b) => a.air_date!.localeCompare(b.air_date!))
          .map((ep, index) => ({
            ...ep,
            episode_number: index + 1,
          }));

        return {
          episodes,
          primarySeason: seasonGroup.seasonNumber,
          confidence: 0.9,
        };
      }

      if (Math.abs(seasonYearEpisodes.length - expectedCount) <= 2) {
        const episodes = seasonYearEpisodes
          .sort((a, b) => a.air_date!.localeCompare(b.air_date!))
          .slice(0, expectedCount + 1)
          .map((ep, index) => ({
            ...ep,
            episode_number: index + 1,
          }));

        const confidence = Math.max(
          0.7,
          1 -
            Math.abs(seasonYearEpisodes.length - expectedCount) / expectedCount,
        );

        return {
          episodes,
          primarySeason: seasonGroup.seasonNumber,
          confidence,
        };
      }
    }

    return { episodes: [], primarySeason: 1, confidence: 0 };
  }

  private async matchBySeasonYear(
    anilist: AnilistWithRelations,
    allEpisodes: TmdbSeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[],
  ): Promise<MatchResult> {
    if (!anilist.seasonYear) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const anilistYear = anilist.seasonYear;
    const expectedCount =
      anilist.shikimori?.episodesAired || anilist.episodes || 12;

    const yearsToTry = [anilistYear, anilistYear + 1, anilistYear - 1];

    for (const yearToCheck of yearsToTry) {
      const exactYearEpisodes = allEpisodes.filter((ep) => {
        if (!ep.air_date) return false;
        const epYear = new Date(ep.air_date).getFullYear();
        return epYear === yearToCheck;
      });

      if (exactYearEpisodes.length >= expectedCount * 0.8) {
        const episodes = exactYearEpisodes
          .sort((a, b) => a.air_date!.localeCompare(b.air_date!))
          .slice(0, expectedCount + 1)
          .map((ep, index) => ({
            ...ep,
            episode_number: index + 1,
          }));

        const primarySeason = this.getMostCommonSeason(episodes);
        const yearPenalty = yearToCheck === anilistYear ? 1 : 0.8;
        const confidence = Math.min(
          0.7,
          (exactYearEpisodes.length / expectedCount) * yearPenalty,
        );

        return { episodes, primarySeason, confidence };
      }
    }

    return { episodes: [], primarySeason: 1, confidence: 0 };
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
      if (!episode.air_date) continue;

      const anilistEpisodeNum = airingMap.get(episode.air_date);
      if (anilistEpisodeNum) {
        matches.push({
          episode,
          confidence: 0.95,
          reasons: ['exact_airing_date_match'],
          anilistEpisodeNumber: anilistEpisodeNum,
        });
      }
    }

    if (matches.length === 0) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    const expectedEpisodes =
      anilist.shikimori?.episodesAired || anilist.episodes || 12;
    const matchRatio = matches.length / expectedEpisodes;

    if (matchRatio < 0.5) {
      return { episodes: [], primarySeason: 1, confidence: 0 };
    }

    matches.sort((a, b) => a.anilistEpisodeNumber - b.anilistEpisodeNumber);

    const episodes = matches.map((match, index) => ({
      ...match.episode,
      episode_number: index + 1,
    }));

    const primarySeason = this.getMostCommonSeason(episodes);
    const confidence = Math.min(matchRatio, 0.95);

    return { episodes, primarySeason, confidence };
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
