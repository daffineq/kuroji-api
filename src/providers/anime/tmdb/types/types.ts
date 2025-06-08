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

export interface BasicTmdb {
  id: number;
  original_name: string;
  media_type: string;
  name: string;
  first_air_date: string;
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
