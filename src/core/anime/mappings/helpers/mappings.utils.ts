import { AniZipMappings, MappingEntry } from '../types';

export function toMappingsArray(mappings: AniZipMappings): MappingEntry[] {
  const result: MappingEntry[] = [];

  const entries: [keyof AniZipMappings, string][] = [
    ['animeplanet_id', 'animeplanet'],
    ['kitsu_id', 'kitsu'],
    ['mal_id', 'mal'],
    ['anilist_id', 'anilist'],
    ['anisearch_id', 'anisearch'],
    ['anidb_id', 'anidb'],
    ['notifymoe_id', 'notifymoe'],
    ['livechart_id', 'livechart'],
    ['thetvdb_id', 'thetvdb'],
    ['imdb_id', 'imdb'],
    ['themoviedb_id', 'tmdb']
  ];

  for (const [key, name] of entries) {
    const value = mappings[key];
    if (value !== undefined && value !== null && value !== '') {
      result.push({ id: `${value}`, name });
    }
  }

  return result;
}
