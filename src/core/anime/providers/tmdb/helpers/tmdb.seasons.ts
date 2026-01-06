import { NotFoundError } from 'src/helpers/errors';
import { MatchResult, MatchStrategy, SeasonEpisode, SeasonEpisodeGroup, SeasonTmdb } from '../types';
import { AnilistMedia } from '../../anilist/types';
import { TmdbStrategies } from './tmdb.strategies';
import { getKey, Redis } from 'src/helpers/redis.util';
import logger from 'src/helpers/logger';
import { Anilist } from '../../anilist';
import { TmdbUtils } from './tmdb.utils';
import { Tmdb } from '../tmdb';
import { Shikimori } from '../../shikimori';
import { Kitsu } from '../../kitsu';
import { TmdbFetch } from './tmdb.fetch';
import { AnimeUtils } from 'src/core/anime/helpers';
import { Meta } from 'src/core/anime/meta';
import { Module } from 'src/helpers/module';

class TmdbSeasonsModule extends Module {
  override readonly name = 'TmdbSeasons';

  async getSeason(id: number): Promise<SeasonTmdb> {
    const key = getKey('tmdb', 'seasons', id);

    const cached = await Redis.get<SeasonTmdb>(key);

    if (cached) {
      return cached;
    }

    const al = await Anilist.getInfo(id);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    if (TmdbUtils.getTmdbTypeByAl(al.format) === 'MOVIE') {
      throw new Error("LMAO, movies can't have seasons, you baka!");
    }

    const tmdb = await Tmdb.getInfo(id);

    const allEpisodes = await this.getAllEpisodes(id);
    const seasonGroups = this.groupEpisodesBySeasons(allEpisodes);

    const [shik, kit] = await Promise.all([
      Shikimori.getInfo(id).catch(() => null),
      Kitsu.getInfo(id).catch(() => null)
    ]);

    const episodeCount = AnimeUtils.getEpisodesCount(al, kit, shik);

    const matchResult = await this.findBestEpisodeSequence(al, allEpisodes, seasonGroups, episodeCount);

    if (!matchResult.episodes || matchResult.episodes.length === 0) {
      throw new NotFoundError('Could not find matching episodes for AniList entry');
    }

    if (matchResult.confidence < 0.4) {
      throw new Error(`Episode matching confidence too low (${matchResult.confidence.toFixed(2)})`);
    }

    const season = await TmdbFetch.fetchSeason(tmdb.id, matchResult.primarySeason);
    if (!season) {
      throw new NotFoundError('Primary season not found');
    }

    const trimmedSeason: SeasonTmdb = {
      ...season,
      episodes: matchResult.episodes ?? []
    };

    await Meta.update(id, { episodes: trimmedSeason.episodes });

    await Redis.set(key, trimmedSeason);

    return trimmedSeason;
  }

  async getAllEpisodes(id: number): Promise<SeasonEpisode[]> {
    const tmdb = await Tmdb.getInfo(id);

    const seasonsPromise = tmdb.seasons!.map((s) => TmdbFetch.fetchSeason(tmdb.id, s.season_number));

    const seasons = await Promise.all(seasonsPromise);

    const now = new Date();

    return seasons
      .filter((s) => s.episodes && s.episodes.length > 0)
      .flatMap((s) => s.episodes)
      .filter((e) => e.season_number != 0)
      .filter((e) => e.air_date && new Date(e.air_date) <= now)
      .sort((a, b) => {
        if (a.season_number !== b.season_number) {
          return a.season_number - b.season_number;
        }
        return a.episode_number - b.episode_number;
      });
  }

  async findBestEpisodeSequence(
    anilist: AnilistMedia,
    allEpisodes: SeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[],
    episodeCount: number | undefined | null
  ): Promise<MatchResult> {
    const strategies = [
      () => TmdbStrategies.matchByDateRange(anilist, allEpisodes, seasonGroups, episodeCount),
      () => TmdbStrategies.matchByEpisodeCount(anilist, allEpisodes, seasonGroups, episodeCount),
      () => TmdbStrategies.matchByAiringSchedule(anilist, allEpisodes, episodeCount),
      () => TmdbStrategies.matchBySeasonYear(anilist, allEpisodes, seasonGroups, episodeCount)
    ];

    let bestMatch: MatchResult = {
      episodes: [],
      primarySeason: 1,
      confidence: 0,
      strategy: MatchStrategy.NONE
    };

    // console.log(`Trying to match ${episodeCount} episodes for AniList ID ${anilist.id}`);

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
        logger.warn(`Strategy ${index + 1} failed:`, error);
        continue;
      }
    }

    if (bestMatch.confidence < 0.6) {
      throw new Error('No reliable episode matching strategy succeeded');
    }

    return bestMatch;
  }

  groupEpisodesBySeasons = (episodes: SeasonEpisode[]): SeasonEpisodeGroup[] => {
    const seasonMap = new Map<number, SeasonEpisode[]>();

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
  };
}

const TmdbSeasons = new TmdbSeasonsModule();

export { TmdbSeasons };
