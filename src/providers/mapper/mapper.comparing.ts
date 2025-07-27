import { normalizeType } from './mapper.cleaning.js';

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
  return 1 - distance / maxLength;
}

export function getSimiliarity(
  target: string,
  candidate: string,
  log: boolean = false,
): number {
  if (target === candidate) return 1;
  if (!target.length || !candidate.length) return 0;

  const targetWords = target.split(/\s+/).filter((word) => word.length > 0);
  const candidateWords = candidate
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (targetWords.length === 0 || candidateWords.length === 0) return 0;

  const targetSet = new Set(targetWords);
  const candidateSet = new Set(candidateWords);

  const targetMatches = targetWords.filter((word) =>
    candidateSet.has(word),
  ).length;
  const candidateMatches = candidateWords.filter((word) =>
    targetSet.has(word),
  ).length;

  const targetContainment = targetMatches / targetWords.length;
  const candidateContainment = candidateMatches / candidateWords.length;

  const jaro = jaroWinklerDistance(target, candidate);
  const levenshtein = levenshteinSimilarity(target, candidate);
  const baseSimilarity = jaro * 0.4 + levenshtein * 0.6;

  if (candidateContainment === 1.0) {
    if (log) {
      console.log(
        `Target: ${target}, candidate: ${candidate}, candidate is contained in target, base: ${baseSimilarity}`,
      );
    }

    return baseSimilarity * 1.1;
  }

  if (targetContainment === 1.0) {
    if (log) {
      console.log(
        `Target: ${target}, candidate: ${candidate}, target is contained in candidate, base: ${baseSimilarity}`,
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
    const extraWordPenalty = Math.pow(
      0.9,
      candidateExtraWords + targetExtraWords,
    );
    penalty = extraWordPenalty * wordOverlapRatio;
  }

  const finalScore = baseSimilarity * penalty;

  if (log) {
    console.log(
      `Target: ${target}, candidate: ${candidate}, score: ${finalScore}, base: ${baseSimilarity}`,
    );
  }

  return Math.max(0, Math.min(1.0, finalScore));
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
    ['TV', 'TELEVISION', 'TV SERIES', 'ONA'],
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
