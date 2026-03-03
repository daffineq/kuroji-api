import { DateUtils } from 'src/helpers/date';
import { AnilistMedia } from '../providers/anilist/types';
import { KitsuAnime } from '../providers/kitsu/types';
import { ShikimoriAnime } from '../providers/shikimori/types';
import { AniZipMappings } from 'src/core/types';
import { AnimeLinkPayload } from '../types';

const getEpisodesCount = (
  anilist: AnilistMedia,
  kitsu: KitsuAnime | null,
  shikimori: ShikimoriAnime | null
): number | undefined | null => {
  const airedSchedule =
    anilist.airingSchedule?.edges
      ?.filter((schedule) => schedule.node.airingAt != null && DateUtils.isPast(schedule.node.airingAt))
      .sort((a, b) => (b.node.airingAt ?? 0) - (a.node.airingAt ?? 0)) ?? [];

  const totalEpisodes: (number | null | undefined)[] = [
    anilist.episodes,
    shikimori?.episodes,
    kitsu?.attributes.episodeCount
  ];

  const airedEpisodes: (number | null | undefined)[] = [shikimori?.episodesAired, airedSchedule?.length];

  const total = totalEpisodes.find((v) => typeof v === 'number' && v > 0);
  const aired = airedEpisodes.find((v) => typeof v === 'number' && v > 0);

  const isAiring = anilist.status === 'RELEASING';

  if (isAiring) {
    return aired;
  }

  return total ?? aired ?? null;
};

const pickBestTitle = (a: AnilistMedia): string | null => {
  return a.title.romaji ?? a.title.english ?? a.title.native ?? null;
};

const countryToLanguage: Record<string, string> = {
  JP: 'ja',
  KR: 'ko',
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  US: 'en',
  GB: 'en',
  CA: 'en',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  ES: 'es'
};

const getLanguage = (country: string): string | null => {
  if (!country) return null;

  return countryToLanguage[country] ?? null;
};

const getType = (format: string | null | undefined): 'movie' | 'series' => {
  switch (format) {
    case 'MOVIE':
      return 'movie';
    case 'TV':
    case 'ONA':
    case 'OVA':
    case 'SPECIAL':
    case 'TV_SHORT':
      return 'series';
    default:
      return 'series';
  }
};

const toLinksArray = (mappings: AniZipMappings | undefined): AnimeLinkPayload[] => {
  const result: AnimeLinkPayload[] = [];

  if (!mappings) {
    return result;
  }

  const entries: [keyof AniZipMappings, string][] = [
    ['animeplanet_id', 'animeplanet'],
    ['kitsu_id', 'kitsu'],
    ['mal_id', 'mal'],
    ['anilist_id', 'anilist'],
    ['anisearch_id', 'anisearch'],
    ['anidb_id', 'anidb'],
    ['notifymoe_id', 'notifymoe'],
    ['livechart_id', 'livechart'],
    ['thetvdb_id', 'tvdb'],
    ['imdb_id', 'imdb'],
    ['themoviedb_id', 'tmdb']
  ];

  for (const [key, name] of entries) {
    const value = mappings[key];
    if (value !== undefined && value !== null && value !== '') {
      result.push({ link: `${value}`, label: name, type: 'mapping' });
    }
  }

  return result;
};

export enum ArtworkType {
  POSTER = 'poster',
  BACKGROUND = 'background',
  LOGO = 'logo',
  ICON = 'icon',
  SCREENCAP = 'screencap',
  PHOTO = 'photo',
  CLEARART = 'clearart',
  UNKOWN = 'unkown'
}

const TVDB_TYPE_MAP: Record<number, ArtworkType> = {
  1: ArtworkType.BACKGROUND, // Banner -> Background
  2: ArtworkType.POSTER, // Poster
  3: ArtworkType.BACKGROUND, // Background
  5: ArtworkType.ICON, // Icon
  6: ArtworkType.BACKGROUND, // Banner -> Background
  7: ArtworkType.POSTER, // Poster
  8: ArtworkType.BACKGROUND, // Background
  10: ArtworkType.ICON, // Icon
  11: ArtworkType.SCREENCAP, // 16:9 Screencap
  12: ArtworkType.SCREENCAP, // 4:3 Screencap
  13: ArtworkType.PHOTO, // Photo
  14: ArtworkType.POSTER, // Poster
  15: ArtworkType.BACKGROUND, // Background
  16: ArtworkType.BACKGROUND, // Banner -> Background
  18: ArtworkType.ICON, // Icon
  19: ArtworkType.ICON, // Icon
  20: ArtworkType.BACKGROUND, // Cinemagraph -> Background
  21: ArtworkType.BACKGROUND, // Cinemagraph -> Background
  22: ArtworkType.CLEARART, // ClearArt
  23: ArtworkType.LOGO, // ClearLogo -> Logo
  24: ArtworkType.CLEARART, // ClearArt
  25: ArtworkType.LOGO, // ClearLogo -> Logo
  26: ArtworkType.ICON, // Icon
  27: ArtworkType.POSTER // Poster
};

const TMDB_TYPE_MAP: Record<string, ArtworkType> = {
  backdrop: ArtworkType.BACKGROUND,
  logo: ArtworkType.LOGO,
  poster: ArtworkType.POSTER
};

const unifyArtworkType = (type?: number | string): ArtworkType => {
  if (typeof type === 'number') {
    const unified = TVDB_TYPE_MAP[type];
    if (!unified) {
      return ArtworkType.UNKOWN;
    }
    return unified;
  }

  if (typeof type === 'string') {
    const normalized = type.toLowerCase().trim();

    const unified = TMDB_TYPE_MAP[normalized];
    if (unified) {
      return unified;
    }

    if (Object.values(ArtworkType).includes(normalized as ArtworkType)) {
      return normalized as ArtworkType;
    }

    if (normalized.includes('banner')) return ArtworkType.BACKGROUND;
    if (normalized.includes('background')) return ArtworkType.BACKGROUND;
    if (normalized.includes('backdrop')) return ArtworkType.BACKGROUND;
    if (normalized.includes('logo')) return ArtworkType.LOGO;
    if (normalized.includes('clear')) {
      if (normalized.includes('logo')) return ArtworkType.LOGO;
      return ArtworkType.CLEARART;
    }
    if (normalized.includes('poster')) return ArtworkType.POSTER;
    if (normalized.includes('icon')) return ArtworkType.ICON;
    if (normalized.includes('screencap') || normalized.includes('screenshot')) return ArtworkType.SCREENCAP;
    if (normalized.includes('photo')) return ArtworkType.PHOTO;

    return ArtworkType.UNKOWN;
  }

  return ArtworkType.UNKOWN;
};

const AnimeUtils = {
  getEpisodesCount,
  pickBestTitle,
  getType,
  toLinksArray,
  unifyArtworkType,
  getLanguage
};

export { AnimeUtils };
