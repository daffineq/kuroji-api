export const SPECIAL_CHARS_REGEX = /[^\p{L}\p{N}\s]/gu;
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

// NEW: Add patterns to detect derivative/re-edit versions
export const DERIVATIVE_PATTERNS = [
  /\b(?:re-?edit|redit|re-?cut)\b/i, // Re-edit indicators
  /\b(?:director'?s?\s*cut|extended\s*cut|final\s*cut)\b/i, // Director's cut
  /\b(?:new\s*edit|新編集版|compilation)\b/i, // New edit/compilation
  /\b(?:recap|recaps|summary)\b/i, // Recap versions
  /\b(?:condensed|abridged|shortened)\b/i, // Condensed versions
  /\b(?:theatrical\s*version|cinema\s*version)\b/i, // Theatrical versions
  /\b(?:alternate\s*version|alternative\s*version)\b/i, // Alternative versions
  /\b(?:extended\s*version|long\s*version)\b/i, // Extended versions
  /\b(?:remaster|remastered|remake)\b/i, // Remastered versions
  /\([^)]*(?:re-?edit|director|cut|recap|compilation|remaster)[^)]*\)/i, // Parenthetical indicators
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

export function titleSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  const similarity = 1 - distance / maxLength;

  return similarity;
}

export function hybridSimilarity(a: string, b: string): number {
  const jw = jaroWinklerDistance(a, b);
  const lev = titleSimilarity(a, b);

  return jw * 0.4 + lev * 0.6;
}

/**
 * @param title - The title to check
 * @returns Boolean indicating if this is a derivative version
 */
export function isDerivativeVersion(title: string): boolean {
  if (!title) return false;

  return DERIVATIVE_PATTERNS.some((pattern) => pattern.test(title));
}

/**
 * Higher penalty = more likely to be deprioritized
 * @param title - The title to check
 * @returns Penalty score (0 = no penalty, higher = more penalty)
 */
export function getDerivativePenalty(title: string): number {
  if (!title) return 0;

  let penalty = 0;
  const lowerTitle = title.toLowerCase();

  if (/re-?edit|redit|新編集版/i.test(title)) penalty += 0.3;
  if (/director'?s?\s*cut/i.test(title)) penalty += 0.25;
  if (/recap|summary|compilation/i.test(title)) penalty += 0.35;
  if (/condensed|abridged|shortened/i.test(title)) penalty += 0.3;
  if (/remaster|remake/i.test(title)) penalty += 0.2;
  if (/extended|long\s*version/i.test(title)) penalty += 0.15;
  if (/alternate|alternative/i.test(title)) penalty += 0.2;

  if (
    /\([^)]*(?:re-?edit|director|cut|recap|compilation|remaster)[^)]*\)/i.test(
      title,
    )
  ) {
    penalty += 0.1;
  }

  return Math.min(penalty, 0.5);
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
  if (!searchType || !candidateType) return true;

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
  isDerivative?: boolean;
  derivativePenalty?: number;
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
  japaneseTitle?: string;
  synonyms?: string[];
  year?: number;
  type?: string;
  episodes?: number;
}

/**
 * Gets all available titles from an anime title object or returns an array with just the string if given a string
 * @param title - The title to get all variations from
 * @returns Array of all available title variations
 */
function getAllTitles<T extends ExpectAnime>(candidate: T): string[] {
  if (!candidate.title) return [];
  if (typeof candidate.title === 'string' && candidate.japaneseTitle)
    return [candidate.title, candidate.japaneseTitle].concat(
      candidate.synonyms ?? [],
    );
  if (typeof candidate.title === 'string')
    return [candidate.title].concat(candidate.synonyms ?? []);

  return [
    candidate.title.userPreferred,
    candidate.title.english,
    candidate.title.romaji,
    candidate.title.native,
  ].filter((t): t is string => !!t);
}

/**
 * @param candidates - Array of candidates to sort
 * @returns Sorted array with non-derivative versions first
 */
function sortCandidatesByPreference<T extends ExpectAnime>(
  candidates: T[],
): T[] {
  return candidates.sort((a, b) => {
    const aTitles = getAllTitles(a);
    const bTitles = getAllTitles(b);

    const aIsDerivative = aTitles.some((title) => isDerivativeVersion(title));
    const bIsDerivative = bTitles.some((title) => isDerivativeVersion(title));

    // Non-derivative versions come first
    if (aIsDerivative && !bIsDerivative) return 1;
    if (!aIsDerivative && bIsDerivative) return -1;

    // If both are derivative or both are non-derivative, maintain original order
    return 0;
  });
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

  const sortedResults = sortCandidatesByPreference(results).filter(
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
    const candidateTitles = getAllTitles(candidate);
    const isDerivative = candidateTitles.some((title) =>
      isDerivativeVersion(title),
    );
    const derivativePenalty = isDerivative
      ? Math.max(...candidateTitles.map(getDerivativePenalty))
      : 0;

    const adjustedSimilarity = Math.max(0, similarity - derivativePenalty);

    return {
      similarity: adjustedSimilarity,
      method,
      result: candidate,
      title: matchedTitle,
      normalized: normalizedTitle,
      year: searchYear,
      episodes: searchEpisodes,
      type: candidate.type,
      isDerivative,
      derivativePenalty,
    };
  };

  // Normalize search titles
  const normalizedSearchTitles = searchTitles
    .map(sanitizeTitle)
    .filter((t): t is string => !!t);
  if (normalizedSearchTitles.length === 0) return null;

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
            return createMatchResult(
              1,
              'exact-year-episode-type-normalized',
              candidate,
              undefined,
              normalizedSearchTitle,
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
      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (
        candidate.year === searchYear &&
        areTypesCompatible(searchType, candidate.type)
      ) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return createMatchResult(
              1,
              'exact-year-type-normalized',
              candidate,
              undefined,
              normalizedSearchTitle,
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

      const normalizedCandidateTitles = candidateTitles
        .map(sanitizeTitle)
        .filter((t): t is string => !!t);

      if (areTypesCompatible(searchType, candidate.type)) {
        for (const normalizedSearchTitle of normalizedSearchTitles) {
          if (normalizedCandidateTitles.includes(normalizedSearchTitle)) {
            return createMatchResult(
              1,
              'exact-type-normalized',
              candidate,
              undefined,
              normalizedSearchTitle,
            );
          }
        }
      }
    }
  }

  // 7. Loose match (similarity >= 0.8) with type preference
  let bestLooseMatch: MatchResult<T> | null = null;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      for (const normalizedCandidateTitle of normalizedCandidateTitles) {
        const similarity = hybridSimilarity(
          normalizedSearchTitle,
          normalizedCandidateTitle,
        );

        if (similarity >= 0.8) {
          let adjustedSimilarity =
            searchType && areTypesCompatible(searchType, candidate.type)
              ? Math.min(1.0, similarity + 0.05)
              : similarity;

          const candidateAllTitles = getAllTitles(candidate);
          const isDerivative = candidateAllTitles.some((title) =>
            isDerivativeVersion(title),
          );
          const derivativePenalty = isDerivative
            ? Math.max(...candidateAllTitles.map(getDerivativePenalty))
            : 0;

          adjustedSimilarity = Math.max(
            0,
            adjustedSimilarity - derivativePenalty,
          );

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
              isDerivative,
              derivativePenalty,
            };
          }
        }
      }
    }
  }

  if (bestLooseMatch) return bestLooseMatch;

  // 8. Last resort fuzzy match (similarity >= 0.7) with type preference
  let bestFuzzyMatch: MatchResult<T> | null = null;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      for (const normalizedCandidateTitle of normalizedCandidateTitles) {
        const similarity = hybridSimilarity(
          normalizedSearchTitle,
          normalizedCandidateTitle,
        );

        if (similarity >= 0.7) {
          let adjustedSimilarity =
            searchType && areTypesCompatible(searchType, candidate.type)
              ? Math.min(1.0, similarity + 0.03)
              : similarity;

          const candidateAllTitles = getAllTitles(candidate);
          const isDerivative = candidateAllTitles.some((title) =>
            isDerivativeVersion(title),
          );
          const derivativePenalty = isDerivative
            ? Math.max(...candidateAllTitles.map(getDerivativePenalty))
            : 0;

          adjustedSimilarity = Math.max(
            0,
            adjustedSimilarity - derivativePenalty,
          );

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

  // 9. Check if there's any match with similarity >= 0.6 with type preference
  let bestPossibleMatch: MatchResult<T> | null = null;
  let highestSimilarity = 0;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    const normalizedCandidateTitles = candidateTitles
      .map(sanitizeTitle)
      .filter((t): t is string => !!t);

    for (const normalizedSearchTitle of normalizedSearchTitles) {
      for (const normalizedCandidateTitle of normalizedCandidateTitles) {
        const similarity = hybridSimilarity(
          normalizedSearchTitle,
          normalizedCandidateTitle,
        );

        let adjustedSimilarity =
          searchType && areTypesCompatible(searchType, candidate.type)
            ? Math.min(1.0, similarity + 0.02)
            : similarity;

        const candidateAllTitles = getAllTitles(candidate);
        const isDerivative = candidateAllTitles.some((title) =>
          isDerivativeVersion(title),
        );
        const derivativePenalty = isDerivative
          ? Math.max(...candidateAllTitles.map(getDerivativePenalty))
          : 0;

        adjustedSimilarity = Math.max(
          0,
          adjustedSimilarity - derivativePenalty,
        );

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
