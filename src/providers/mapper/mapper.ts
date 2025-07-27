import { sanitizeTitle } from './mapper.cleaning.js';
import { areTypesCompatible, getSimiliarity } from './mapper.comparing.js';

export interface MatchResult<T> {
  similarity: number;
  method:
    | 'exact-year-episode-type-raw'
    | 'exact-year-episode-type-normalized'
    | 'exact-year-type-raw'
    | 'exact-year-type-normalized'
    | 'exact-year-episode-raw'
    | 'exact-year-episode-normalized'
    | 'exact-year-raw'
    | 'exact-year-normalized'
    | 'exact-type-raw'
    | 'exact-type-normalized'
    | 'exact'
    | 'exact-normalized'
    | 'loose'
    | 'last-resort'
    | 'null-method';
  result: T;
  title?: string;
  normalized?: string;
  year?: number;
  episodes?: number;
  type?: string;
}

export interface ExpectAnime {
  id?: unknown;
  titles?: (string | undefined | null)[];
  year?: number;
  type?: string;
  episodes?: number;
}

/**
 * Gets all available titles from an anime titles array
 * @param candidate - The anime candidate to get titles from
 * @returns Array of all available title variations
 */
function getAllTitles<T extends ExpectAnime>(candidate: T): string[] {
  return (candidate.titles || [])
    .map(sanitizeTitle)
    .filter((t): t is string => !!t);
}

/**
 * Finds the best matching anime from a list of results based on the search criteria
 * @template T - Type extending ExpectAnime interface
 * @param search - The anime to search for, containing title, year, episodes, and type information
 * @param results - Array of potential anime matches to compare against
 * @returns The best match result with similarity score and matching method, or null if no match found
 */
export const findBestMatch = <T extends ExpectAnime>(
  search: ExpectAnime,
  results: T[],
  exclude: string[] = [],
): MatchResult<T> | null => {
  // Calculate the best match after 10 fucking layers of security for most accurate asf match.
  if (!search || !results || results.length === 0) return null;

  const sortedResults = results.filter(
    (r) => exclude.indexOf(r.id as string) === -1,
  );

  const searchTitles = getAllTitles(search);
  if (searchTitles.length === 0) return null;

  const searchYear = search.year;
  const searchEpisodes = search.episodes;
  const searchType = search.type;

  const createMatchResult = (
    similarity: number,
    method: MatchResult<T>['method'],
    candidate: T,
    matchedTitle?: string,
    normalizedTitle?: string,
  ): MatchResult<T> => {
    return {
      similarity: similarity,
      method,
      result: candidate,
      title: matchedTitle,
      normalized: normalizedTitle,
      year: searchYear,
      episodes: searchEpisodes,
      type: candidate.type,
    };
  };

  // 1. Exact Match with year, episodes, and type
  if (searchYear && searchEpisodes && searchType) {
    for (const candidate of sortedResults) {
      const candidateTitles = getAllTitles(candidate);

      if (
        candidate.year === searchYear &&
        candidate.episodes === searchEpisodes &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return createMatchResult(
              1,
              'exact-year-episode-type-raw',
              candidate,
              searchTitle,
            );
          }
        }
      }
    }
  }

  // 2. Exact Match with normalized titles, year, episodes, and type
  if (searchYear && searchEpisodes && searchType) {
    for (const candidate of sortedResults) {
      const candidateTitles = getAllTitles(candidate);

      if (
        candidate.year === searchYear &&
        candidate.episodes === searchEpisodes &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return createMatchResult(
              1,
              'exact-year-episode-type-normalized',
              candidate,
              undefined,
              searchTitle,
            );
          }
        }
      }
    }
  }

  // 3. Exact Match with year and type
  if (searchYear && searchType) {
    for (const candidate of sortedResults) {
      const candidateTitles = getAllTitles(candidate);

      if (
        candidate.year === searchYear &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return createMatchResult(
              1,
              'exact-year-type-raw',
              candidate,
              searchTitle,
            );
          }
        }
      }
    }
  }

  // 4. Exact Match with normalized titles, year, and type
  if (searchYear && searchType) {
    for (const candidate of sortedResults) {
      const candidateTitles = getAllTitles(candidate);

      if (
        candidate.year === searchYear &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return createMatchResult(
              1,
              'exact-year-type-normalized',
              candidate,
              undefined,
              searchTitle,
            );
          }
        }
      }
    }
  }

  // 5. Exact Match with type only
  if (searchType) {
    for (const candidate of sortedResults) {
      const candidateTitles = getAllTitles(candidate);

      if (areTypesCompatible(searchType, candidate.type)) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return createMatchResult(
              1,
              'exact-type-raw',
              candidate,
              searchTitle,
            );
          }
        }
      }
    }
  }

  // 6. Exact Match with normalized titles and type
  if (searchType) {
    for (const candidate of sortedResults) {
      const candidateTitles = getAllTitles(candidate);

      if (areTypesCompatible(searchType, candidate.type)) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return createMatchResult(
              1,
              'exact-type-normalized',
              candidate,
              undefined,
              searchTitle,
            );
          }
        }
      }
    }
  }

  // 7. Loose match (similarity >= 0.7) with type preference
  let bestLooseMatch: MatchResult<T> | null = null;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    for (const searchTitle of searchTitles) {
      for (const candidateTitle of candidateTitles) {
        const similarity = getSimiliarity(searchTitle, candidateTitle);

        if (similarity >= 0.7) {
          const adjustedSimilarity =
            searchType && areTypesCompatible(searchType, candidate.type)
              ? Math.min(1.0, similarity + 0.05)
              : similarity;

          if (
            !bestLooseMatch ||
            adjustedSimilarity > bestLooseMatch.similarity ||
            (adjustedSimilarity === bestLooseMatch.similarity &&
              searchType &&
              areTypesCompatible(searchType, candidate.type))
          ) {
            bestLooseMatch = {
              similarity: adjustedSimilarity,
              method: 'loose',
              result: candidate,
              normalized: searchTitle,
            };
          }
        }
      }
    }
  }

  if (bestLooseMatch) return bestLooseMatch;

  // 8. Last resort fuzzy match (similarity >= 0.65) with type preference
  let bestFuzzyMatch: MatchResult<T> | null = null;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    for (const searchTitle of searchTitles) {
      for (const candidateTitle of candidateTitles) {
        const similarity = getSimiliarity(searchTitle, candidateTitle);

        if (similarity >= 0.65) {
          const adjustedSimilarity =
            searchType && areTypesCompatible(searchType, candidate.type)
              ? Math.min(1.0, similarity + 0.03)
              : similarity;

          if (
            !bestFuzzyMatch ||
            adjustedSimilarity > bestFuzzyMatch.similarity ||
            (adjustedSimilarity === bestFuzzyMatch.similarity &&
              searchType &&
              areTypesCompatible(searchType, candidate.type))
          ) {
            bestFuzzyMatch = {
              similarity: adjustedSimilarity,
              method: 'last-resort',
              result: candidate,
              normalized: searchTitle,
            };
          }
        }
      }
    }
  }

  if (bestFuzzyMatch) return bestFuzzyMatch;

  // 9. Check if there's any match with similarity >= 0.6 with type preference
  let bestPossibleMatch: MatchResult<T> | null = null;
  let highestSimilarity = 0;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    for (const searchTitle of searchTitles) {
      for (const candidateTitle of candidateTitles) {
        const similarity = getSimiliarity(searchTitle, candidateTitle);

        const adjustedSimilarity =
          searchType && areTypesCompatible(searchType, candidate.type)
            ? Math.min(1.0, similarity + 0.02)
            : similarity;

        if (
          adjustedSimilarity > highestSimilarity ||
          (adjustedSimilarity === highestSimilarity &&
            searchType &&
            areTypesCompatible(searchType, candidate.type))
        ) {
          highestSimilarity = adjustedSimilarity;
          bestPossibleMatch = {
            similarity: adjustedSimilarity,
            method: 'null-method',
            result: candidate,
            normalized: searchTitle,
          };
        }
      }
    }
  }

  // Return null if similarity is less than 0.6
  if (bestPossibleMatch && bestPossibleMatch.similarity >= 0.6) {
    return bestPossibleMatch;
  }

  return null;
};
