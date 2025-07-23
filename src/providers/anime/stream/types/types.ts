import {
  EpisodeZoro,
  AnimepaheEpisode,
  TmdbSeasonEpisode,
} from '@prisma/client';
import { AniZipEpisodeWithRelations } from '../../mappings/types/types.js';
import { TmdbImage } from '../../tmdb/types/types.js';
import { EpisodePayload } from '../../anilibria/types/types.js';

export enum SourceType {
  soft_sub = 'soft_sub',
  hard_sub = 'hard_sub',
  dub = 'dub',
  both = 'both',
}

export enum Provider {
  zoro = 'zoro',
  animekai = 'animekai',
  animepahe = 'animepahe',
  anilibria = 'anilibria',
}

export enum Language {
  russian = 'ru',
  english = 'en',
  multi = 'multi',
}

export interface Episode {
  title?: string | null;
  russianTitle?: string | null;
  image?: TmdbImage | null;
  number?: number | null;
  overview?: string | null;
  date?: string | null;
  duration?: number | null;
  filler?: boolean | null;
  sub?: boolean | null;
  dub?: boolean | null;
  availableOn: AvailableOn;
}

export interface AvailableOn {
  animepahe: boolean;
  animekai: boolean;
  zoro: boolean;
  anilibria: boolean;
}

export interface EpisodeDetails extends Episode {
  images: EpisodeImage[];
}

export interface EpisodeImage {
  image: TmdbImage | null;
  aspectRation: number;
  height: number;
  width: number;
  iso_639_1: string;
  voteAverage: number;
  voteCount: number;
}

export interface ProviderInfo {
  id: string;
  filler: boolean;
  provider: Provider;
  type: SourceType;
  language: Language;
}

export interface BestProvider<T> {
  name: 'zoro' | 'pahe' | 'tmdb' | 'anilibria' | 'anizip';
  count: number;
  episodes: T[];
}

export type EpisodeUnion =
  | EpisodeZoro
  | AnimepaheEpisode
  | TmdbSeasonEpisode
  | EpisodePayload
  | AniZipEpisodeWithRelations;
