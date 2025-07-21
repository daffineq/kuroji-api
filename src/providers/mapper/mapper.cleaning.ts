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
    'promotional video': 'MUSIC',
  };

  return typeMapping[normalized] || normalized.toUpperCase();
}
