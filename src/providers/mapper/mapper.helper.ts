export const SPECIAL_CHARS_REGEX = /[^\w\s]/g;
export const SEASON_PATTERNS = [
  /\b(\d+)(?:st|nd|rd|th)?\s*season\b/i, // "1st season", "2nd season", "3 season"
  /\bseason\s*(\d+)\b/i, // "season 1", "season 2"
  /\bs(\d+)\b/i, // "s1", "s2"
  /\b(\d+)(期|クール)\b/, // Japanese season indicators
];

export const PART_PATTERNS = [
  /\bpart\s*(\d+)\b/i, // "part 1", "part 2"
  /\bp(\d+)\b/i, // "p1", "p2"
  /\b(\d+)部\b/, // Japanese part indicator
];

export const FORMAT_INDICATORS = [
  /\b(?:ova|oad|ona)\b/i, // Animation format indicators
  /\b(?:movie|film|theatrical)\b/i, // Movie indicators
  /\b(?:special|sp|specials)\b/i, // Special episode indicators
  /\b(?:tv|television)\s*series?\b/i, // TV series indicators
  /\b(?:web|net)\s*series?\b/i, // Web series indicators
];

export const EXTRA_PATTERNS = [
  /\b(?:complete|collection|series)\b/i, // Collection indicators
  /\b(?:dubbed|subbed|uncensored|uncut)\b/i, // Version indicators
  /\b(?:hd|bd|dvd|blu-ray)\b/i, // Media format
  /\b(?:remaster(?:ed)?|remake)\b/i, // Version types
  /\b(?:final|chapter|episode|vol\.?)\b/i, // Content indicators
  /[-~+:]/g, // Common separators
  /\([^)]*\)/g, // Remove anything in parentheses
  /\[[^\]]*\]/g, // Remove anything in square brackets
  /\{[^}]*\}/g, // Remove anything in curly braces
];

/**
 * Calculates the Jaro-Winkler distance between two strings.
 * Returns a value between 0 and 1, where 1 means the strings are identical
 * and 0 means they are completely different.
 *
 * @param s1 - First string to compare
 * @param s2 - Second string to compare
 * @param p - Scaling factor for how much the score is adjusted upwards for having common prefixes.
 *            Should not exceed 0.25, defaults to 0.1
 * @returns A number between 0 and 1 representing the similarity between the strings
 */
export function jaroWinklerDistance(s1: string, s2: string, p = 0.1): number {
  if (s1 === s2) return 1.0;
  if (s1.length === 0 && s2.length === 0) return 1.0;

  if (s1.length === 0 || s2.length === 0) return 0.0;

  const scalingFactor = Math.max(0, Math.min(0.25, p));
  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;

  const s1Matches: boolean[] = Array(s1.length).fill(false);
  const s2Matches: boolean[] = Array(s2.length).fill(false);

  let matchingChars = 0;

  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2.length);

    for (let j = start; j < end; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        matchingChars++;
        break;
      }
    }
  }

  if (matchingChars === 0) return 0.0;

  let transpositions = 0;
  let k = 0;

  for (let i = 0; i < s1.length; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) {
        k++;
      }

      if (s1[i] !== s2[k]) {
        transpositions++;
      }

      k++;
    }
  }

  transpositions = Math.floor(transpositions / 2);

  const jaroSimilarity =
    (matchingChars / s1.length +
      matchingChars / s2.length +
      (matchingChars - transpositions) / matchingChars) /
    3;

  let commonPrefixLength = 0;
  const maxPrefixLength = Math.min(4, Math.min(s1.length, s2.length));

  for (let i = 0; i < maxPrefixLength; i++) {
    if (s1[i] === s2[i]) {
      commonPrefixLength++;
    } else {
      break;
    }
  }

  return (
    jaroSimilarity + commonPrefixLength * scalingFactor * (1 - jaroSimilarity)
  );
}

/**
 * Cleans and normalizes a given title string for comparison.
 * @param {string | undefined} title - The title string to clean.
 * @returns {string | undefined} - The cleaned and normalized title string, or undefined if the input was undefined.
 */
export function cleanTitle(title?: string): string | undefined {
  if (!title) return undefined;

  // Normalize the string to remove accents and other diacritical marks
  return (
    title
      .normalize('NFKC')
      // Replace non-word characters with spaces
      .replace(/[^\w\s]/g, ' ')
      // Remove duplicate spaces
      .replace(/\s+/g, ' ')
      // Trim leading and trailing spaces
      .trim()
      // Limit the length of the title to 100 characters
      .slice(0, 100)
  );
}

export function deepCleanTitle(title: string): string {
  if (!title) return '';

  // Convert to lowercase and trim
  let cleaned = title.toLowerCase().trim();

  // Remove all special characters
  cleaned = cleaned.replace(SPECIAL_CHARS_REGEX, ' ');

  // Remove season indicators
  SEASON_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Remove part indicators
  PART_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Remove format indicators
  FORMAT_INDICATORS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Remove extra patterns
  EXTRA_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Additional cleaning steps
  cleaned = cleaned
    // Remove year patterns
    .replace(/\b\d{4}\b/g, '')
    // Remove single digits (often season/part numbers)
    .replace(/\b\d\b/g, '')
    // Remove common anime title prefixes
    .replace(/^(?:the|a|an)\s+/i, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Remove leading/trailing spaces
    .trim();

  return cleaned;
}

/**
 * Sanitizes a title string by removing unnecessary words and characters for comparison.
 * @param {string | undefined} title - The title string to sanitize.
 * @returns {string | undefined} - The sanitized title string, or undefined if the input was undefined.
 */
export function sanitizeTitle(title?: string): string | undefined {
  // We need to sanitize this shit because some anime titles are fucking ass
  if (!title) return undefined;

  let sanitized = title.toLowerCase();

  // Normalize the string to remove accents and other diacritical marks, and then remove diacritical marks
  sanitized = sanitized.normalize('NFD').replace(/\p{M}/gu, '');
  return cleanTitle(sanitized);
}

/**
 * Normalizes anime type for comparison
 * @param type - The anime type to normalize
 * @returns Normalized type string or undefined
 */
export function normalizeType(type?: string): string | undefined {
  if (!type) return undefined;

  const normalized = type.toLowerCase().trim();

  // Map common type variations to standard types
  const typeMapping: Record<string, string> = {
    tv: 'TV',
    television: 'TV',
    'tv series': 'TV',
    movie: 'MOVIE',
    film: 'MOVIE',
    theatrical: 'MOVIE',
    ova: 'OVA',
    ona: 'ONA',
    oad: 'OAD',
    special: 'SPECIAL',
    specials: 'SPECIAL',
    sp: 'SPECIAL',
    music: 'MUSIC',
    pv: 'MUSIC',
    'promotional video': 'MUSIC',
  };

  return typeMapping[normalized] || normalized.toUpperCase();
}

/**
 * Checks if two anime types are compatible for matching
 * @param searchType - The search type
 * @param candidateType - The candidate type
 * @returns Boolean indicating if types are compatible
 */
export function areTypesCompatible(
  searchType?: string,
  candidateType?: string,
): boolean {
  if (!searchType || !candidateType) return true; // If either is missing, don't filter by type

  const normalizedSearch = normalizeType(searchType);
  const normalizedCandidate = normalizeType(candidateType);

  if (!normalizedSearch || !normalizedCandidate) return true;

  // Exact match
  if (normalizedSearch === normalizedCandidate) return true;

  // Compatible type groups
  const compatibleGroups = [
    ['TV', 'TELEVISION', 'TV SERIES'],
    ['MOVIE', 'FILM', 'THEATRICAL'],
    ['OVA', 'OAD'],
    ['SPECIAL', 'SPECIALS', 'SP'],
    ['MUSIC', 'PV', 'PROMOTIONAL VIDEO'],
  ];

  for (const group of compatibleGroups) {
    if (
      group.includes(normalizedSearch) &&
      group.includes(normalizedCandidate)
    ) {
      return true;
    }
  }

  return false;
}

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
  title?:
    | string
    | {
        english?: string;
        romaji?: string;
        native?: string;
        userPreferred?: string;
      };
  japaneseTitle?: string; // ← just add this line
  year?: number;
  type?: string;
  episodes?: number;
}

/**
 * Gets all available titles from an anime title object or returns an array with just the string if given a string
 * @param title - The title to get all variations from
 * @returns Array of all available title variations
 */
function getAllTitles(
  title?:
    | string
    | {
        english?: string | null;
        romaji?: string | null;
        native?: string | null;
        userPreferred?: string | null;
      },
  japaneseTitle: string | null = null,
): string[] {
  if (!title) return [];
  if (typeof title === 'string' && japaneseTitle) return [title, japaneseTitle];
  if (typeof title === 'string') return [title];

  return [
    title.userPreferred,
    title.english,
    title.romaji,
    title.native,
  ].filter((t): t is string => !!t);
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
): MatchResult<T> | null => {
  // Calculate the best match after 10 fucking layers of security for most accurate asf match.
  if (!search || !results || results.length === 0) return null;

  const searchTitles = getAllTitles(search.title);
  if (searchTitles.length === 0) return null;

  const searchYear = search.year;
  const searchEpisodes = search.episodes;
  const searchType = search.type;

  // Normalize search titles
  const normalizedSearchTitles = searchTitles
    .map(sanitizeTitle)
    .filter((t): t is string => !!t);
  if (normalizedSearchTitles.length === 0) return null;

  // 1. Exact Match with year, episodes, and type
  if (searchYear && searchEpisodes && searchType) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      if (
        candidate.year === searchYear &&
        candidate.episodes === searchEpisodes &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-episode-type-raw',
              result: candidate,
              title: searchTitle,
              year: searchYear,
              episodes: searchEpisodes,
              type: candidate.type,
            };
          }
        }
      }
    }
  }

  // 2. Exact Match with normalized titles, year, episodes, and type
  if (searchYear && searchEpisodes && searchType) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );
      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (
        candidate.year === searchYear &&
        candidate.episodes === searchEpisodes &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-episode-type-normalized',
              result: candidate,
              normalized: normalizedSearchTitle,
              year: searchYear,
              episodes: searchEpisodes,
              type: candidate.type,
            };
          }
        }
      }
    }
  }

  // 3. Exact Match with year and type
  if (searchYear && searchType) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      if (
        candidate.year === searchYear &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-type-raw',
              result: candidate,
              title: searchTitle,
              year: searchYear,
              type: candidate.type,
            };
          }
        }
      }
    }
  }

  // 4. Exact Match with normalized titles, year, and type
  if (searchYear && searchType) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );
      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (
        candidate.year === searchYear &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-type-normalized',
              result: candidate,
              normalized: normalizedSearchTitle,
              year: searchYear,
              type: candidate.type,
            };
          }
        }
      }
    }
  }

  // 5. Exact Match with year and episodes (original logic)
  if (searchYear && searchEpisodes) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      if (
        candidate.year === searchYear &&
        candidate.episodes === searchEpisodes
      ) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-episode-raw',
              result: candidate,
              title: searchTitle,
              year: searchYear,
              episodes: searchEpisodes,
            };
          }
        }
      }
    }
  }

  // 6. Exact Match with normalized titles, year and episodes (original logic)
  if (searchYear && searchEpisodes) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (
        candidate.year === searchYear &&
        candidate.episodes === searchEpisodes
      ) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-episode-normalized',
              result: candidate,
              normalized: normalizedSearchTitle,
              year: searchYear,
              episodes: searchEpisodes,
            };
          }
        }
      }
    }
  }

  // 7. Exact Match with year (original logic)
  if (searchYear) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      if (candidate.year === searchYear) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-raw',
              result: candidate,
              title: searchTitle,
              year: searchYear,
            };
          }
        }
      }
    }
  }

  // 8. Exact Match with normalized titles and year (original logic)
  if (searchYear) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (candidate.year === searchYear) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return {
              similarity: 1,
              method: 'exact-year-normalized',
              result: candidate,
              normalized: normalizedSearchTitle,
              year: searchYear,
            };
          }
        }
      }
    }
  }

  // 9. Exact Match with type only
  if (searchType) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      if (areTypesCompatible(searchType, candidate.type)) {
        for (const searchTitle of searchTitles) {
          if (candidateTitles.includes(searchTitle)) {
            return {
              similarity: 1,
              method: 'exact-type-raw',
              result: candidate,
              title: searchTitle,
              type: candidate.type,
            };
          }
        }
      }
    }
  }

  // 10. Exact Match with normalized titles and type
  if (searchType) {
    for (const candidate of results) {
      const candidateTitles = getAllTitles(
        candidate.title,
        candidate.japaneseTitle,
      );

      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (areTypesCompatible(searchType, candidate.type)) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return {
              similarity: 1,
              method: 'exact-type-normalized',
              result: candidate,
              normalized: normalizedSearchTitle,
              type: candidate.type,
            };
          }
        }
      }
    }
  }

  // 11. Exact title match (original logic)
  for (const candidate of results) {
    const candidateTitles = getAllTitles(
      candidate.title,
      candidate.japaneseTitle,
    );

    for (const searchTitle of searchTitles) {
      if (candidateTitles.includes(searchTitle)) {
        return {
          similarity: 1,
          method: 'exact',
          result: candidate,
          title: searchTitle,
        };
      }
    }
  }

  // 12. Exact normalized title match (original logic)
  for (const candidate of results) {
    const candidateTitles = getAllTitles(
      candidate.title,
      candidate.japaneseTitle,
    );

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
        return {
          similarity: 1,
          method: 'exact-normalized',
          result: candidate,
          normalized: normalizedSearchTitle,
        };
      }
    }
  }

  // 13. Loose match (similarity >= 0.8) with type preference
  let bestLooseMatch: MatchResult<T> | null = null;

  for (const candidate of results) {
    const candidateTitles = getAllTitles(
      candidate.title,
      candidate.japaneseTitle,
    );

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      for (const normalizedCandidateTitle of normalizedCandidateTitles) {
        const similarity = jaroWinklerDistance(
          normalizedSearchTitle,
          normalizedCandidateTitle,
        );

        if (similarity >= 0.8) {
          // Boost similarity if type matches
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
              normalized: normalizedSearchTitle,
            };
          }
        }
      }
    }
  }

  if (bestLooseMatch) return bestLooseMatch;

  // 14. Last resort fuzzy match (similarity >= 0.7) with type preference
  let bestFuzzyMatch: MatchResult<T> | null = null;

  for (const candidate of results) {
    const candidateTitles = getAllTitles(
      candidate.title,
      candidate.japaneseTitle,
    );

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      for (const normalizedCandidateTitle of normalizedCandidateTitles) {
        const similarity = jaroWinklerDistance(
          normalizedSearchTitle,
          normalizedCandidateTitle,
        );

        if (similarity >= 0.7) {
          // Boost similarity if type matches
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
              normalized: normalizedSearchTitle,
            };
          }
        }
      }
    }
  }

  if (bestFuzzyMatch) return bestFuzzyMatch;

  // 15. Check if there's any match with similarity >= 0.6 with type preference
  let bestPossibleMatch: MatchResult<T> | null = null;
  let highestSimilarity = 0;

  for (const candidate of results) {
    const candidateTitles = getAllTitles(
      candidate.title,
      candidate.japaneseTitle,
    );

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      for (const normalizedCandidateTitle of normalizedCandidateTitles) {
        const similarity = jaroWinklerDistance(
          normalizedSearchTitle,
          normalizedCandidateTitle,
        );

        // Boost similarity if type matches
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
            normalized: normalizedSearchTitle,
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
