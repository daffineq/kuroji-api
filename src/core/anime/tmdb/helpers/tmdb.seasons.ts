import anilist from '../../anilist/anilist';
import { NotFoundError } from 'src/helpers/errors';
import tmdb from '../tmdb';
import { getTmdbTypeByAl } from './tmdb.utils';
import tmdbFetch from './tmdb.fetch';
import { MatchResult, MatchStrategy, SeasonEpisode, SeasonEpisodeGroup, SeasonTmdb } from '../types';
import { AnilistMedia } from '../../anilist/types';
import {
  matchByDateRange,
  matchByEpisodeCount,
  matchByAiringSchedule,
  matchBySeasonYear,
  matchByAnimepahe
} from './mapping/strategies';
import { AnimepaheInfo } from 'src/core/types';
import animepahe from '../../animepahe/animepahe';
import shikimori from '../../shikimori/shikimori';
import kitsu from '../../kitsu/kitsu';
import { getEpisodesCount } from '../../helpers/get.episodes';
import mappings from '../../mappings/mappings';
import { getKey, Redis } from 'src/helpers/redis.util';

class TmdbSeasons {
  async getSeason(id: number): Promise<SeasonTmdb> {
    const key = getKey('tmdb', 'seasons', id);

    const cached = await Redis.get<SeasonTmdb>(key);

    if (cached) {
      return cached;
    }

    const al = await anilist.getInfo(id);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    if (getTmdbTypeByAl(al.format) === 'MOVIE') {
      throw new Error("LMAO, movies can't have seasons, you baka!");
    }

    const TMDB = await tmdb.getInfo(id);

    const allEpisodes = await this.getAllEpisodes(id);
    const seasonGroups = this.groupEpisodesBySeasons(allEpisodes);

    const [pahe, shik, kit] = await Promise.all([
      animepahe.getInfo(id).catch(() => null),
      shikimori.getInfo(id).catch(() => null),
      kitsu.getInfo(id).catch(() => null)
    ]);

    const episodeCount = getEpisodesCount(al, kit, shik);

    const matchResult = await this.findBestEpisodeSequence(al, pahe, allEpisodes, seasonGroups, episodeCount);

    if (!matchResult.episodes || matchResult.episodes.length === 0) {
      throw new NotFoundError('Could not find matching episodes for AniList entry');
    }

    if (matchResult.confidence < 0.4) {
      throw new Error(`Episode matching confidence too low (${matchResult.confidence.toFixed(2)})`);
    }

    const season = await tmdbFetch.fetchSeason(TMDB.id, matchResult.primarySeason);
    if (!season) {
      throw new NotFoundError('Primary season not found');
    }

    const trimmedSeason: SeasonTmdb = {
      ...season,
      episodes: matchResult.episodes ?? []
    };

    await mappings.addEpisodes(id, trimmedSeason.episodes);

    await Redis.set(key, trimmedSeason);

    return trimmedSeason;
  }

  private async getAllEpisodes(id: number): Promise<SeasonEpisode[]> {
    const TMDB = await tmdb.getInfo(id);

    const allEpisodes: SeasonEpisode[] = [];

    for (const season of TMDB.seasons!) {
      const tmdbSeason = await tmdbFetch.fetchSeason(TMDB.id, season.season_number);

      if (!tmdbSeason) {
        continue;
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
    anilist: AnilistMedia,
    animepahe: AnimepaheInfo | null,
    allEpisodes: SeasonEpisode[],
    seasonGroups: SeasonEpisodeGroup[],
    episodeCount: number | undefined | null
  ): Promise<MatchResult> {
    const strategies = [
      () => matchByDateRange(anilist, allEpisodes, seasonGroups, episodeCount),
      () => matchByEpisodeCount(anilist, allEpisodes, seasonGroups, episodeCount),
      () => matchByAiringSchedule(anilist, allEpisodes, episodeCount),
      () => matchBySeasonYear(anilist, allEpisodes, seasonGroups, episodeCount),
      () => matchByAnimepahe(anilist, animepahe, allEpisodes, episodeCount)
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
        console.warn(`Strategy ${index + 1} failed:`, error);
        continue;
      }
    }

    if (bestMatch.confidence < 0.6) {
      throw new Error('No reliable episode matching strategy succeeded');
    }

    return bestMatch;
  }

  private groupEpisodesBySeasons(episodes: SeasonEpisode[]): SeasonEpisodeGroup[] {
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
  }
}

export default new TmdbSeasons();
