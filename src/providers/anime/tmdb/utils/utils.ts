import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { AnilistWithRelations } from '../../anilist/types/types.js';
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
  anilist: AnilistWithRelations,
  results: BasicTmdb[] | undefined,
): BasicTmdb | null {
  if (!results || !Array.isArray(results)) return null;

  const searchAnime: ExpectAnime = {
    title: {
      romaji: (anilist.title as { romaji: string }).romaji,
      english: (anilist.title as { english: string }).english,
      native: (anilist.title as { native: string }).native,
    },
    synonyms: anilist.synonyms,
  };

  const resultsFiltered = results.filter((tmdb) => isProbablyAnime(tmdb));

  const bestMatch = findBestMatch(
    searchAnime,
    resultsFiltered.map((result) => ({
      id: result.id,
      title: result.name ?? result.title,
      japaneseTitle: result.original_name ?? result.original_title,
    })),
  );

  if (bestMatch) {
    return results.find((r) => r.id === bestMatch.result.id) || null;
  }

  return null;
}
