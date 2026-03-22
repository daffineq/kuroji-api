export const REMOVE_WORDS_REGEX =
  /\b(season|part|cour|arc|chapter|movie|ova|special|edition|final|complete|ver|version|s\d+|\d+(st|nd|rd|th)?)\b/gi;

// prettier-ignore
export const SKIP_WORDS = [
  'san', 'kun', 'chan', 'sama', 'dono', 'senpai', 'kohai', 'sensei',
  'no', 'ni', 'de', 'to', 'ga', 'wo', 'o', 'wa', 'mo', 'ya', 'ka', 'kara', 'made', 'e',
  'na', 'ne', 'yo', 'desu', 'da', 'suru', 'naru', 'aru', 'nai',
  'the', 'a', 'an', 'of', 'in', 'on', 'at', 'by', 'for', 'from', 'with', 'and', 'or',
  'but', 'nor', 'so', 'yet', 'into', 'onto', 'over', 'under', 'between', 'without',
  'within', 'through', 'about', 'around', 'after', 'before', 'during', 'since',
  'until', 'till', 'upon', 'via', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being'
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

export function getSearchTitle(title: string): string {
  if (!title) return '';

  let cleaned = title.toLowerCase().trim();

  cleaned = cleaned
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/[:\-]/g, ' ')
    .replace(REMOVE_WORDS_REGEX, '')
    .replace(/\b\d+\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(/\s+/);

  const result: string[] = [];
  let wordCount = 0;

  for (const token of tokens) {
    result.push(token);

    if (!SKIP_WORDS.includes(token)) {
      wordCount++;
    }

    if (wordCount >= 2) break;
  }

  return result.join(' ');
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

export function getSimilarity(target: string, candidate: string, log: boolean = false): number {
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

interface CandidateAnime<T> {
  expect: T;
  score: number;
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

  const sortedResults = results.filter((r) => !exclude.includes(r.id as string));

  const searchTitles = getAllTitles(search);
  if (searchTitles.length === 0) return null;

  const candidates: CandidateAnime<T>[] = [];

  for (const candidate of sortedResults) {
    const candidateTitles = getAllTitles(candidate);

    let score = 0;

    if (!search.year || candidate.year === search.year) score++;
    if (!search.episodes || candidate.episodes === search.episodes) score++;
    if (!search.language || candidate.language === search.language) score += 4;
    if (!search.type || (candidate.type && areTypesCompatible(search.type, candidate.type))) score++;

    let similarity = 0;

    for (const searchTitle of searchTitles) {
      for (const candidateTitle of candidateTitles) {
        similarity = Math.max(similarity, getSimilarity(searchTitle, candidateTitle));
      }
    }

    if (similarity < 0.5) {
      continue;
    }

    candidates.push({
      expect: candidate,
      score: similarity * 10 + score
    });
  }

  return (
    candidates.sort((a, b) => {
      return b.score - a.score;
    })[0]?.expect ?? null
  );
};
