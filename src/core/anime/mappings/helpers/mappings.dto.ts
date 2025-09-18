// mappings.dto.ts
import { Prisma } from '@prisma/client';
import { SeasonEpisode } from '../../tmdb/types';
import { parseString } from 'src/helpers/parsers';

export type MappingEntry = {
  id: string | number;
  name: string;
};

export interface TitleEntry {
  title: string;
  source: string;
  language: string;
}

export interface PosterEntry {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  source: string;
}

export interface BannerEntry {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  source: string;
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
