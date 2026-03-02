export const SPECIAL_CHARS_REGEX = /[^\p{L}\p{N}\s]/gu;
export const SEASON_PATTERNS = [
  /\b(\d+)(?:st|nd|rd|th)?\s*season\b/i, // "1st season", "2nd season", "3 season"
  /\bseason\s*(\d+)\b/i, // "season 1", "season 2"
  /\bs(\d+)\b/i, // "s1", "s2"
  /\b(\d+)(期|クール)\b/ // Japanese season indicators
];

export const PART_PATTERNS = [
  /\bpart\s*(\d+)\b/i, // "part 1", "part 2"
  /\bp(\d+)\b/i, // "p1", "p2"
  /\b(\d+)部\b/ // Japanese part indicator
];

export const FORMAT_INDICATORS = [
  /\b(?:ova|oad|ona)\b/i, // Animation format indicators
  /\b(?:movie|film|theatrical)\b/i, // Movie indicators
  /\b(?:special|sp|specials)\b/i, // Special episode indicators
  /\b(?:tv|television)\s*series?\b/i, // TV series indicators
  /\b(?:web|net)\s*series?\b/i // Web series indicators
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
  /\([^)]*(?:re-?edit|director|cut|recap|compilation|remaster)[^)]*\)/i // Parenthetical indicators
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
  /\{[^}]*\}/g // Remove anything in curly braces
];

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

  return cleaned.split(' ').slice(0, 3).join(' ');
}

/**
 * Sanitizes a title string by removing unnecessary words and characters for comparison.
 * Standardizes season/part patterns for consistent comparison.
 * @param {string | undefined} title - The title string to sanitize.
 * @returns {string | undefined} - The sanitized title string, or undefined if the input was undefined.
 */
export function sanitizeTitle(title?: string): string | undefined {
  if (!title) return undefined;

  let sanitized = title.toLowerCase();

  // Remove accents & diacritics
  sanitized = sanitized.normalize('NFD').replace(/\p{M}/gu, '');

  // Standardize known season/part patterns
  sanitized = standardizedTitle(sanitized);

  return cleanTitle(sanitized);
}

/**
 * Standardizes anime title patterns like seasons, parts, etc.
 * @param {string} title - The title string to standardize.
 * @returns {string} - The standardized title.
 */
function standardizedTitle(title: string): string {
  // Season patterns
  title = title.replace(/\b(2nd|second)\s*(season)?\b/gi, 'season 2');
  title = title.replace(/\b(3rd|third)\s*(season)?\b/gi, 'season 3');
  title = title.replace(/\b(4th|fourth)\s*(season)?\b/gi, 'season 4');
  title = title.replace(/\b(5th|fifth)\s*(season)?\b/gi, 'season 5');

  // Generic S2, S3, etc
  title = title.replace(/\bs\s*([0-9]+)\b/gi, 'season $1');

  // Part patterns
  title = title.replace(/\bpart\s*([0-9]+)\b/gi, 'part $1');

  // Final season meme
  title = title.replace(/\b(final|last)\s*season\b/gi, 'final season');

  return title;
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
    'promotional video': 'MUSIC'
  };

  return typeMapping[normalized] || normalized.toUpperCase();
}

/**
 * Calculates the Jaro-Winkler distance between two strings.
 * Returns a value between 0 and 1, where 1 means the strings are identical
 * and 0 means they are completely different.
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
    (matchingChars / s1.length + matchingChars / s2.length + (matchingChars - transpositions) / matchingChars) / 3;

  let commonPrefixLength = 0;
  const maxPrefixLength = Math.min(4, Math.min(s1.length, s2.length));

  for (let i = 0; i < maxPrefixLength; i++) {
    if (s1[i] === s2[i]) {
      commonPrefixLength++;
    } else {
      break;
    }
  }

  return jaroSimilarity + commonPrefixLength * scalingFactor * (1 - jaroSimilarity);
}

/**
 * Levenshtein distance
 */
export function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1, // substitution
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j]! + 1 // deletion
        );
      }
    }
  }

  const distance = matrix[b.length]![a.length]!;
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}

export function getSimiliarity(target: string, candidate: string, log: boolean = false): number {
  if (target === candidate) return 1;
  if (!target.length || !candidate.length) return 0;

  const targetWords = target.split(/\s+/).filter((word) => word.length > 0);
  const candidateWords = candidate.split(/\s+/).filter((word) => word.length > 0);

  if (targetWords.length === 0 || candidateWords.length === 0) return 0;

  const targetSet = new Set(targetWords);
  const candidateSet = new Set(candidateWords);

  const targetMatches = targetWords.filter((word) => candidateSet.has(word)).length;
  const candidateMatches = candidateWords.filter((word) => targetSet.has(word)).length;

  const targetContainment = targetMatches / targetWords.length;
  const candidateContainment = candidateMatches / candidateWords.length;

  const jaro = jaroWinklerDistance(target, candidate);
  const levenshtein = levenshteinSimilarity(target, candidate);
  const baseSimilarity = jaro * 0.4 + levenshtein * 0.6;

  if (candidateContainment === 1.0) {
    if (log) {
      console.log(
        `Target: ${target}, candidate: ${candidate}, candidate is contained in target, base: ${baseSimilarity}`
      );
    }

    return baseSimilarity * 1.1;
  }

  if (targetContainment === 1.0) {
    if (log) {
      console.log(
        `Target: ${target}, candidate: ${candidate}, target is contained in candidate, base: ${baseSimilarity}`
      );
    }

    return baseSimilarity * 1.05;
  }

  const matchingWords = Math.min(targetMatches, candidateMatches);
  const totalUniqueWords = new Set([...targetWords, ...candidateWords]).size;
  const wordOverlapRatio = matchingWords / totalUniqueWords;

  const candidateExtraWords = candidateWords.length - candidateMatches;
  const targetExtraWords = targetWords.length - targetMatches;

  let penalty = 1;

  if (wordOverlapRatio < 0.5) {
    const extraWordPenalty = Math.pow(0.9, candidateExtraWords + targetExtraWords);
    penalty = extraWordPenalty * wordOverlapRatio;
  }

  const finalScore = baseSimilarity * penalty;

  if (log) {
    console.log(`Target: ${target}, candidate: ${candidate}, score: ${finalScore}, base: ${baseSimilarity}`);
  }

  return Math.max(0, Math.min(1.0, finalScore));
}

/**
 * Checks if two anime types are compatible for matching
 * @param searchType - The search type
 * @param candidateType - The candidate type
 * @returns Boolean indicating if types are compatible
 */
export function areTypesCompatible(searchType?: string, candidateType?: string): boolean {
  if (!searchType || !candidateType) return true;

  const normalizedSearch = normalizeType(searchType);
  const normalizedCandidate = normalizeType(candidateType);

  if (!normalizedSearch || !normalizedCandidate) return true;

  // Exact match
  if (normalizedSearch === normalizedCandidate) return true;

  // Compatible type groups
  const compatibleGroups = [
    ['TV', 'TELEVISION', 'TV SERIES', 'ONA', 'SERIES'],
    ['MOVIE', 'FILM', 'THEATRICAL'],
    ['OVA', 'OAD'],
    ['SPECIAL', 'SPECIALS', 'SP'],
    ['MUSIC', 'PV', 'PROMOTIONAL VIDEO']
  ];

  for (const group of compatibleGroups) {
    if (group.includes(normalizedSearch) && group.includes(normalizedCandidate)) {
      return true;
    }
  }

  return false;
}

export interface ExpectAnime {
  id?: unknown;
  titles?: (string | undefined | null)[];
  year?: number;
  type?: string;
  episodes?: number;
  language?: string;
}

/**
 * Gets all available titles from an anime titles array
 * @param candidate - The anime candidate to get titles from
 * @returns Array of all available title variations
 */
function getAllTitles<T extends ExpectAnime>(candidate: T): string[] {
  return (candidate.titles || []).map((title) => sanitizeTitle(title as string)).filter((t): t is string => !!t);
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
  exclude: string[] = []
): T | null => {
  if (!search || !results || results.length === 0) return null;

  const sortedResults = results.filter((r) => exclude.indexOf(r.id as string) === -1);

  const searchTitles = getAllTitles(search);
  if (searchTitles.length === 0) return null;

  const searchYear = search.year;
  const searchEpisodes = search.episodes;
  const searchType = search.type;
  const searchLanguage = search.language;

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    const matchYear = !searchYear || candidate.year === searchYear;
    const matchEpisodes = !searchEpisodes || candidate.episodes === searchEpisodes;
    const matchLanguage = !searchLanguage || candidate.language === searchLanguage;
    const matchType = !searchType || (candidate.type && areTypesCompatible(searchType, candidate.type));

    for (const searchTitle of searchTitles) {
      for (const candidateTitle of candidateTitles) {
        const similiarity = getSimiliarity(searchTitle, candidateTitle);

        if (similiarity > 0.7 && matchYear && matchEpisodes && matchLanguage && matchType) {
          return candidate;
        }

        if (similiarity > 0.9) {
          return candidate;
        }
      }
    }
  }

  return null;
};
