import {
  Tmdb,
  TmdbLastEpisodeToAir,
  TmdbNextEpisodeToAir,
  TmdbReleaseSeason,
  TmdbSeason,
  TmdbSeasonEpisode,
  TmdbSeasonEpisodeImages,
  TmdbSeasonStillImage,
} from '@prisma/client';
import { TMDB } from '../../../../configs/tmdb.config.js';

export interface BasicTmdb {
  id: number;
  original_name: string;
  media_type: string;
  name: string;
  title: string;
  original_title: string;
  first_air_date: string;
  original_language: string;
  origin_country: string[];
}

export interface TmdbResponse {
  results: BasicTmdb[];
}

export interface TmdbWithRelations extends Tmdb {
  last_episode_to_air?: TmdbLastEpisodeToAir;
  next_episode_to_air?: TmdbNextEpisodeToAir;
  seasons: TmdbReleaseSeason[];
}

export interface TmdbSeasonWithRelations extends TmdbSeason {
  episodes: TmdbSeasonEpisode[];
}

export interface TmdbSeasonEpisodeWithRelations extends TmdbSeasonEpisode {
  images: TmdbSeasonEpisodeImagesWithRelations;
}

export interface TmdbSeasonEpisodeImagesWithRelations
  extends TmdbSeasonEpisodeImages {
  stills: TmdbSeasonStillImage[];
}

export enum TmdbStatus {
  Rumored = 'Rumored',
  Planned = 'Planned',
  InProduction = 'In Production',
  PostProduction = 'Post Production',
  Released = 'Released',
  ReturningSeries = 'Returning Series',
  Ended = 'Ended',
  Canceled = 'Canceled',
}

export interface TmdbImage {
  w300: string;
  w500: string;
  original: string;
}

export function getImage(
  image: string | undefined | null,
  ignore: boolean = false,
): TmdbImage | null {
  if (!image) return null;

  return {
    w300: ignore ? image : `${TMDB.getImageUrl('w300')}${image}`,
    w500: ignore ? image : `${TMDB.getImageUrl('w500')}${image}`,
    original: ignore ? image : `${TMDB.IMAGE_BASE_ORIGINAL_URL}${image}`,
  };
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface TmdbProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface TmdbSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface TmdbNetwork {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Base shared fields
interface TmdbBase {
  adult: boolean;
  backdrop_path: string | null;
  genres: TmdbGenre[];
  homepage: string;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  spoken_languages: TmdbSpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

// Movie-specific
export interface TmdbMovieDetails extends TmdbBase {
  belongs_to_collection: unknown | null;
  budget: number;
  imdb_id: string | null;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
  media_type: 'movie';
}

// TV-specific
export interface TmdbTvDetails extends TmdbBase {
  created_by: unknown[];
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TmdbLastEpisodeToAir;
  name: string;
  next_episode_to_air: TmdbNextEpisodeToAir;
  networks: TmdbNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  seasons: TmdbSeason[];
  type: string;
  media_type: 'tv';
}

// Union type for easy use
export type TmdbDetails = TmdbMovieDetails | TmdbTvDetails;

export interface TmdbDetailsMerged extends TmdbBase {
  // Common
  media_type: string;

  // Movie-specific (optional)
  belongs_to_collection?: unknown | null;
  budget?: number;
  imdb_id?: string | null;
  release_date?: string;
  revenue?: number;
  runtime?: number;
  title?: string;
  video?: boolean;

  // TV-specific (optional)
  created_by?: unknown[];
  episode_run_time?: number[];
  first_air_date?: string;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: TmdbLastEpisodeToAir;
  name?: string;
  next_episode_to_air?: TmdbNextEpisodeToAir;
  networks?: TmdbNetwork[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  original_name?: string;
  seasons?: TmdbReleaseSeason[];
  type?: string;
  original_title?: string;
}
