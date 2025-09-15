import { Prisma, TmdbSeasonEpisode } from '@prisma/client';
import anilist from 'src/core/anime/anilist/anilist';
import { findEpisodeCount, getDate } from 'src/core/anime/anilist/helpers/anilist.utils';
import animepahe from 'src/core/anime/animepahe/animepahe';
import { MatchStrategy, EpisodeMatchCandidate, SeasonEpisodeGroup, MatchResult } from '../../types';
import { MapperAnilist } from 'src/core/anime/anilist/types';

async function matchByDateRange(
  anilist: MapperAnilist,
  allEpisodes: TmdbSeasonEpisode[],
  seasonGroups: SeasonEpisodeGroup[]
): Promise<MatchResult> {
  const strategy = MatchStrategy.DATE_RANGE;

  const startDate = anilist.startDate ? getDate(anilist.startDate) : null;
  const endDate = anilist.endDate ? getDate(anilist.endDate) : null;

  if (!startDate || !anilist.seasonYear) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const filteredEpisodes = allEpisodes.filter((ep) => {
    if (!ep.air_date) return false;

    const airDate = new Date(ep.air_date);
    const start = new Date(startDate);

    if (isNaN(airDate.getTime()) || isNaN(start.getTime())) return false;

    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        return airDate >= start && airDate <= end;
      }
    }
    return airDate >= start;
  });

  if (filteredEpisodes.length === 0) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const expectedCount = findEpisodeCount(anilist);
  if (!expectedCount) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const episodes = selectBestEpisodes(filteredEpisodes, expectedCount);
  const primarySeason = getMostCommonSeason(episodes);

  const countMatch = episodes.length / expectedCount;
  const confidence = Math.min(0.9, countMatch * 0.85);

  return { episodes, primarySeason, confidence, strategy };
}

async function matchByEpisodeCount(
  anilist: MapperAnilist,
  allEpisodes: TmdbSeasonEpisode[],
  seasonGroups: SeasonEpisodeGroup[]
): Promise<MatchResult> {
  const strategy = MatchStrategy.EPISODE_COUNT;

  const expectedCount = findEpisodeCount(anilist);
  if (!expectedCount || !anilist.seasonYear) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
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
          episode_number: index + 1
        }));

      return {
        episodes,
        primarySeason: seasonGroup.seasonNumber,
        confidence: 0.9,
        strategy
      };
    }

    if (Math.abs(seasonYearEpisodes.length - expectedCount) <= 2) {
      const episodes = selectBestEpisodes(seasonYearEpisodes, expectedCount);

      const confidence = Math.max(0.7, 1 - Math.abs(seasonYearEpisodes.length - expectedCount) / expectedCount);

      return {
        episodes,
        primarySeason: seasonGroup.seasonNumber,
        confidence,
        strategy
      };
    }
  }

  return { episodes: [], primarySeason: 1, confidence: 0, strategy };
}

async function matchBySeasonYear(
  anilist: MapperAnilist,
  allEpisodes: TmdbSeasonEpisode[],
  seasonGroups: SeasonEpisodeGroup[]
): Promise<MatchResult> {
  const strategy = MatchStrategy.SEASON_YEAR;

  if (!anilist.seasonYear) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const anilistYear = anilist.seasonYear;
  const expectedCount = findEpisodeCount(anilist);

  if (!expectedCount) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const yearTolerance = [anilistYear, anilistYear + 1];

  let bestMatch: MatchResult = {
    episodes: [],
    primarySeason: 1,
    confidence: 0,
    strategy
  };

  for (const seasonGroup of seasonGroups) {
    for (const targetYear of yearTolerance) {
      const seasonYearEpisodes = seasonGroup.episodes.filter((ep) => {
        if (!ep.air_date) return false;
        const epYear = new Date(ep.air_date).getFullYear();
        return epYear === targetYear;
      });

      if (seasonYearEpisodes.length === 0) continue;

      const countRatio = seasonYearEpisodes.length / expectedCount;

      if (countRatio < 0.5) continue;

      const episodes = selectBestEpisodes(seasonYearEpisodes, expectedCount);

      let confidence = 0;

      if (targetYear === anilistYear) {
        confidence += 0.3;
      } else {
        confidence += 0.15;
      }

      const countAccuracy = Math.min(countRatio, 1.0);
      confidence += countAccuracy * 0.4;

      const yearConsistency = seasonYearEpisodes.length / seasonGroup.totalEpisodes;
      confidence += yearConsistency * 0.2;

      if (countRatio > 1.5 || countRatio < 0.7) {
        confidence *= 0.7;
      }

      confidence = Math.min(confidence, 0.75);

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          episodes,
          primarySeason: seasonGroup.seasonNumber,
          confidence,
          strategy
        };
      }
    }
  }

  return bestMatch;
}

async function matchByAiringSchedule(
  anilist: MapperAnilist,
  allEpisodes: TmdbSeasonEpisode[]
): Promise<MatchResult> {
  const strategy = MatchStrategy.AIRING_SCHEDULE;

  const airingSchedule = anilist.airingSchedule || [];
  if (airingSchedule.length === 0) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const matches: EpisodeMatchCandidate[] = [];

  const airingMap = new Map<string, number>();
  airingSchedule.forEach((schedule) => {
    if (schedule.airingAt && schedule.episode) {
      const airDate = new Date(schedule.airingAt * 1000).toISOString().split('T')[0];

      if (!airDate) return;

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
        anilistEpisodeNumber: anilistEpisodeNum
      });
    }
  }

  if (matches.length === 0) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const expectedCount = findEpisodeCount(anilist);

  const episodes = selectBestEpisodes(
    matches.map((m) => m.episode),
    expectedCount
  );

  const matchRatio = expectedCount ? episodes.length / expectedCount : 0;

  if (matchRatio < 0.5) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const episodesPenalty = episodes.length === expectedCount ? 1 : 0.75;
  const primarySeason = getMostCommonSeason(episodes);
  const confidence = Math.min(matchRatio, 0.95 * episodesPenalty);

  return { episodes, primarySeason, confidence, strategy };
}

// Zoro is not implemented yet
// async function matchByZoro(
//   anilist: MapperAnilist,
//   zoro: ZoroPayload | null,
//   allEpisodes: TmdbSeasonEpisode[],
// ): Promise<MatchResult> {
//   const strategy = MatchStrategy.ZORO;

//   if (!zoro || !zoro.episodes || zoro.episodes.length === 0) {
//     return { episodes: [], primarySeason: 1, confidence: 0, strategy };
//   }

//   const matches: EpisodeMatchCandidate[] = [];

//   zoro.episodes.forEach((zoroEp, index) => {
//     const formatTitle = (title?: string | null) =>
//       (title ?? '')
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, '')
//         .trim();

//     const tmdbEp = allEpisodes.find(
//       (ep) => formatTitle(ep.name) === formatTitle(zoroEp.title),
//     );

//     if (tmdbEp) {
//       matches.push({
//         episode: tmdbEp,
//         confidence: 0.9,
//         reasons: ['zoro_title_match'],
//         anilistEpisodeNumber: zoroEp.number ?? index + 1,
//       });
//     }
//   });

//   if (matches.length === 0) {
//     return { episodes: [], primarySeason: 1, confidence: 0, strategy };
//   }

//   const expectedCount = findEpisodeCount(anilist);
//   if (!expectedCount) {
//     return { episodes: [], primarySeason: 1, confidence: 0, strategy };
//   }

//   const episodes = selectBestEpisodes(
//     matches.map((m) => m.episode),
//     expectedCount,
//   );

//   const matchRatio = expectedCount ? episodes.length / expectedCount : 0;
//   if (matchRatio < 0.5) {
//     return { episodes: [], primarySeason: 1, confidence: 0, strategy };
//   }

//   const episodesPenalty = episodes.length === expectedCount ? 1 : 0.75;
//   const primarySeason = getMostCommonSeason(episodes);
//   const confidence = Math.min(matchRatio, 0.9 * episodesPenalty);

//   return { episodes, primarySeason, confidence, strategy };
// }

async function matchByAnimepahe(
  anilist: MapperAnilist,
  animepahe: Prisma.AnimepaheGetPayload<{ select: { episodes: true } }> | null,
  allEpisodes: TmdbSeasonEpisode[]
): Promise<MatchResult> {
  const strategy = MatchStrategy.ANIMEPAHE;

  if (!animepahe || !animepahe.episodes || animepahe.episodes.length === 0) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const matches: EpisodeMatchCandidate[] = [];

  animepahe.episodes.forEach((animepaheEp, index) => {
    const tmdbEp = allEpisodes.find((ep) => ep.episode_number === animepaheEp.number);

    if (tmdbEp) {
      matches.push({
        episode: tmdbEp,
        confidence: 0.7,
        reasons: ['animepahe_episode_number_match'],
        anilistEpisodeNumber: animepaheEp.number ?? index + 1
      });
    }
  });

  if (matches.length === 0) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const expectedCount = findEpisodeCount(anilist);
  if (!expectedCount) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const episodes = selectBestEpisodes(
    matches.map((m) => m.episode),
    expectedCount
  );

  const matchRatio = expectedCount ? episodes.length / expectedCount : 0;
  if (matchRatio < 0.5) {
    return { episodes: [], primarySeason: 1, confidence: 0, strategy };
  }

  const episodesPenalty = episodes.length === expectedCount ? 1 : 0.75;
  const primarySeason = getMostCommonSeason(episodes);
  const confidence = Math.min(matchRatio, 0.7 * episodesPenalty);

  return { episodes, primarySeason, confidence, strategy };
}

function getMostCommonSeason(episodes: TmdbSeasonEpisode[]): number {
  const seasonCounts = new Map<number, number>();
  episodes.forEach((ep) => {
    seasonCounts.set(ep.season_number, (seasonCounts.get(ep.season_number) || 0) + 1);
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

function selectBestEpisodes(episodes: TmdbSeasonEpisode[], expectedCount?: number | null): TmdbSeasonEpisode[] {
  if (episodes.length === 0) return [];

  const regularEpisodes = episodes.filter((ep) => ep.season_number !== 0);
  const specialEpisodes = episodes.filter((ep) => ep.season_number === 0);

  const sortByAirDate = (a: TmdbSeasonEpisode, b: TmdbSeasonEpisode) => a.air_date!.localeCompare(b.air_date!);

  let selected: TmdbSeasonEpisode[];

  if (regularEpisodes.length > 0) {
    selected = [...regularEpisodes].sort(sortByAirDate);

    if (expectedCount) {
      selected = selected.slice(0, expectedCount);
    }
  } else if (specialEpisodes.length > 0 && expectedCount) {
    selected = [...specialEpisodes].sort(sortByAirDate).slice(0, expectedCount);
  } else {
    selected = [...episodes].sort(sortByAirDate);

    if (expectedCount) {
      selected = selected.slice(0, expectedCount);
    }
  }

  return selected.map((ep, index) => ({
    ...ep,
    episode_number: index + 1
  }));
}

export { matchByDateRange, matchByAiringSchedule, matchByEpisodeCount, matchBySeasonYear, matchByAnimepahe };
