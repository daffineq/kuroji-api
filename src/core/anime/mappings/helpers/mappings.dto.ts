export type sources = 'mal' | 'kitsu' | 'anilist' | 'shikimori' | 'tmdb' | 'tvdb' | 'animepahe';

export type MappingEntry = {
  id: string | number;
  name: string;
};

export interface TitleEntry {
  title: string;
  source: sources;
  language: string;
}

export interface DescriptionEntry {
  description: string;
  source: sources;
  language: string;
}

export interface ImageEntry {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  type: 'poster' | 'banner';
  source: sources;
}

export interface ScreenshotEntry {
  id: string;
  originalUrl?: string;
  x166Url?: string;
  x332Url?: string;
}

export interface ArtworkEntry {
  id: number;
  height?: number;
  image?: string;
  includesText?: boolean;
  language?: string;
  score?: number;
  thumbnail?: string;
  type?: number;
  width?: number;
}
