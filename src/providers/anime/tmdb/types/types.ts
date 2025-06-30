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

export function getImage(image: string | undefined | null): TmdbImage | null {
  if (!image) return null;

  return {
    w300: `${TMDB.getImageUrl('w300')}${image}`,
    w500: `${TMDB.getImageUrl('w500')}${image}`,
    original: `${TMDB.IMAGE_BASE_ORIGINAL_URL}${image}`,
  };
}
