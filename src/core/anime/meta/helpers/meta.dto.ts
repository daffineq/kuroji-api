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

export type MappingEntry = {
  id: string | number;
  name: string;
};

export interface TitleEntry {
  title: string;
  source: string;
  language: string;
}

export interface DescriptionEntry {
  description: string;
  source: string;
  language: string;
}

export interface ImageEntry {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  type: 'poster' | 'background';
  source: string;
}

export interface ScreenshotEntry {
  url: string;
  small?: string;
  medium?: string;
  large?: string;
  source: string;
}

export interface VideoEntry {
  url: string;
  title?: string;
  thumbnail?: string;
  artist?: string;
  type?: string;
  source: string;
}

export interface ArtworkEntry {
  url: string;
  height?: number;
  width?: number;
  large?: string;
  medium?: string;
  iso_639_1?: string;
  type: ArtworkType;
  source: string;
}

export interface ChronologyEntry {
  parentId: number;
  relatedId: number;
  order: number;
}

export interface MetaPayload {
  id: number;

  // Scalar fields
  franchise?: string | null;
  rating?: string | null;
  episodes_aired?: number | null;
  episodes_total?: number | null;
  moreinfo?: string | null;
  broadcast?: string | null;
  nsfw?: boolean;

  // Relational fields
  mappings?: MappingEntry[] | MappingEntry;
  titles?: TitleEntry[] | TitleEntry;
  descriptions?: DescriptionEntry[] | DescriptionEntry;
  images?: ImageEntry[] | ImageEntry;
  videos?: VideoEntry[] | VideoEntry;
  screenshots?: ScreenshotEntry[] | ScreenshotEntry;
  artworks?: ArtworkEntry[] | ArtworkEntry;
  chronologies?: ChronologyEntry[] | ChronologyEntry;
}

export const unifyArtworkType = (type?: number | string): ArtworkType => {
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
