import { Prisma, TmdbSeasonEpisode } from '@prisma/client';
import anilist from '../../anilist/anilist';
import { NotFoundError } from 'src/helpers/errors';
import tmdb from '../tmdb';
import prisma from 'src/lib/prisma';
import { getTmdbTypeByAl } from './tmdb.utils';
import tmdbFetch from './tmdb.fetch';
import { MatchResult, MatchStrategy, SeasonEpisodeGroup } from '../types';
import { MapperAnilist, mappingSelect } from '../../anilist/types';
import {
  matchByDateRange,
  matchByEpisodeCount,
  matchByAiringSchedule,
  matchBySeasonYear,
  matchByAnimepahe
} from './mapping/strategies';
import { getTmdbSeasonPrismaData } from './tmdb.prisma';

class TmdbSeasons {
  async getSeason(id: number): Promise<Prisma.TmdbSeasonGetPayload<{ include: { episodes: true } }>> {
    const al = await anilist.getAndJustSave(id, mappingSelect);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    if (getTmdbTypeByAl(al.format) === 'MOVIE') {
      throw new Error("LMAO, movies can't have seasons, you baka!");
    }

    const TMDB = await tmdb.getInfo(id, { id: true, seasons: true });

    const allEpisodes = await this.getAllEpisodes(id);
    const seasonGroups = this.groupEpisodesBySeasons(allEpisodes);

    const matchResult = await this.findBestEpisodeSequence(al, al.animepahe, allEpisodes, seasonGroups);

    if (!matchResult.episodes || matchResult.episodes.length === 0) {
      throw new NotFoundError('Could not find matching episodes for AniList entry');
    }

    if (matchResult.confidence < 0.4) {
      throw new Error(`Episode matching confidence too low (${matchResult.confidence.toFixed(2)})`);
    }

    const season = TMDB.seasons.find((s) => s.season_number === matchResult.primarySeason);
    if (!season) {
      throw new NotFoundError('Primary season not found');
    }

    const trimmedSeason: Prisma.TmdbSeasonGetPayload<{ include: { episodes: true } }> = {
      ...season,
      episodes: matchResult.episodes,
      show_id: TMDB.id
    };

    return trimmedSeason;
  }

  private async getAllEpisodes(id: number): Promise<TmdbSeasonEpisode[]> {
    const TMDB = await tmdb.getInfo(id, { id: true, seasons: true });

    const allEpisodes: TmdbSeasonEpisode[] = [];

    for (const season of TMDB.seasons) {
      let tmdbSeason = await prisma.tmdbSeason.findFirst({
        where: { show_id: TMDB.id, season_number: season.season_number },
        include: { episodes: true }
      });

      if (!tmdbSeason) {
        try {
          tmdbSeason = await tmdbFetch.fetchSeason(TMDB.id, season.season_number);

          if (!tmdbSeason) {
            continue;
          }

          tmdbSeason.show_id = TMDB.id;
          await this.save(tmdbSeason);
        } catch (error) {
          continue;
        }
      }

      if (tmdbSeason.episodes && tmdbSeason.episodes.length > 0) {
        allEpisodes.push(...tmdbSeason.episodes);
      }
    }

    return allEpisodes
      .filter((e) => e.season_number !== 0)
      .sort((a, b) => {
        if (a.season_number !== b.season_number) {
          return a.season_number - b.season_number;
        }
        return a.episode_number - b.episode_number;
      });
  }

  private async findBestEpisodeSequence(
    anilist: MapperAnilist,
    animepahe: Prisma.AnimepaheGetPayload<{ select: { episodes: true } }> | null,
    allEpisodes: TmdbSeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[]
  ): Promise<MatchResult> {
    const strategies = [
      () => matchByDateRange(anilist, allEpisodes, seasonGroups),
      () => matchByEpisodeCount(anilist, allEpisodes, seasonGroups),
      () => matchByAiringSchedule(anilist, allEpisodes),
      () => matchBySeasonYear(anilist, allEpisodes, seasonGroups),
      () => matchByAnimepahe(anilist, animepahe, allEpisodes)
    ];

    let bestMatch: MatchResult = {
      episodes: [],
      primarySeason: 1,
      confidence: 0,
      strategy: MatchStrategy.NONE
    };

    // console.log(`Trying to match ${findEpisodeCount(anilist)} episodes for AniList ID ${anilist.id}`);

    for (const [index, strategy] of strategies.entries()) {
      try {
        const result = await strategy();
        // console.log(`Strategy ${result.strategy} result:`, {
        //   episodeCount: result.episodes.length,
        //   confidence: result.confidence,
        //   primarySeason: result.primarySeason
        // });

        if (result.confidence > bestMatch.confidence) {
          bestMatch = result;
        }
      } catch (error) {
        console.warn(`Strategy ${index + 1} failed:`, error);
        continue;
      }
    }

    if (bestMatch.confidence < 0.6) {
      throw new Error('No reliable episode matching strategy succeeded');
    }

    return bestMatch;
  }

  async save<T extends Prisma.TmdbSeasonSelect>(
    season: Prisma.TmdbSeasonGetPayload<{ include: { episodes: true } }>,
    select?: T
  ): Promise<Prisma.TmdbSeasonGetPayload<{ select: T }>> {
    return prisma.tmdbSeason.upsert({
      where: { id: season.id },
      create: getTmdbSeasonPrismaData(season),
      update: getTmdbSeasonPrismaData(season),
      select
    }) as Prisma.TmdbSeasonGetPayload<{ select: T }>;
  }

  private groupEpisodesBySeasons(episodes: TmdbSeasonEpisode[]): SeasonEpisodeGroup[] {
    const seasonMap = new Map<number, TmdbSeasonEpisode[]>();

    episodes.forEach((episode) => {
      if (!seasonMap.has(episode.season_number)) {
        seasonMap.set(episode.season_number, []);
      }
      seasonMap.get(episode.season_number)!.push(episode);
    });

    return Array.from(seasonMap.entries()).map(([seasonNumber, seasonEpisodes]) => ({
      seasonNumber,
      episodes: seasonEpisodes.sort((a, b) => a.episode_number - b.episode_number),
      totalEpisodes: seasonEpisodes.length
    }));
  }
}

export default new TmdbSeasons();
