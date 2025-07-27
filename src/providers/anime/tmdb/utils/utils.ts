import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.js';
import { BasicTmdb } from '../types/types.js';

const ALLOWED_COUNTRIES = ['JP', 'KR', 'CN'];
const ALLOWED_LANGUAGES = ['ja', 'ko', 'zh'];

const isProbablyAnime = (tmdb: BasicTmdb): boolean => {
  const countryMatch =
    tmdb.origin_country?.some((c) => ALLOWED_COUNTRIES.includes(c)) ?? false;

  const languageMatch = ALLOWED_LANGUAGES.includes(tmdb.original_language);

  return countryMatch || languageMatch;
};

export function findBestMatchFromSearch(
  anilist: {
    title?: {
      romaji: string | null;
      english: string | null;
      native: string | null;
    } | null;
    synonyms?: string[];
  },
  results: BasicTmdb[] | undefined,
): BasicTmdb | null {
  if (!results || !Array.isArray(results)) return null;

  const searchAnime: ExpectAnime = {
    titles: [
      anilist.title?.romaji ?? null,
      anilist.title?.english ?? null,
      anilist.title?.native ?? null,
      ...(anilist.synonyms ?? []),
    ].filter((t): t is string => t !== null),
  };

  const resultsFiltered = results.filter((tmdb) => isProbablyAnime(tmdb));

  const bestMatch = findBestMatch(
    searchAnime,
    resultsFiltered.map((result) => ({
      id: result.id,
      title: [
        result.name ?? result.title,
        result.original_name ?? result.original_title,
      ].filter(Boolean),
    })),
  );

  if (bestMatch) {
    return results.find((r) => r.id === bestMatch.result.id) || null;
  }

  return null;
}
