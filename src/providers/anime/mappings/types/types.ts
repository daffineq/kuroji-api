import {
  AniZip,
  AniZipEpisode,
  AniZipEpisodeTitle,
  AniZipImage,
  AniZipMapping,
  AniZipTitle,
} from '@prisma/client';

export interface AniZipWithRelations extends AniZip {
  titles?: AniZipTitle[];
  images?: AniZipImage[];
  episodes?: AniZipEpisodeWithRelations[];
  mappings?: AniZipMapping;
}

export interface AniZipEpisodeWithRelations extends AniZipEpisode {
  titles?: AniZipEpisodeTitle[];
}

export interface IAniZipTitles {
  [key: string]: string;
}

export interface IEpisodeTitle {
  [key: string]: string | null;
}

export interface IAniZipEpisode {
  tvdbShowId?: number;
  tvdbId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  absoluteEpisodeNumber?: number;
  title?: IEpisodeTitle;
  airDate?: string;
  airDateUtc?: string;
  runtime?: number;
  overview?: string;
  image?: string;
  episode?: string;
  anidbEid?: number;
  length?: number;
  airdate?: string;
  rating?: string;
}

export interface IAniZipEpisodes {
  [episodeNumber: string]: IAniZipEpisode;
}

export interface IAniZipImage {
  coverType: string;
  url: string;
}

export interface IAniZipMappings {
  animeplanet_id?: string;
  kitsu_id?: number;
  mal_id?: number;
  type?: string;
  anilist_id?: number;
  anisearch_id?: number;
  anidb_id?: number;
  notifymoe_id?: string;
  livechart_id?: number;
  thetvdb_id?: number;
  imdb_id?: string;
  themoviedb_id?: string;
}

export interface IAniZipData {
  titles: IAniZipTitles;
  episodes: IAniZipEpisodes;
  episodeCount: number;
  specialCount: number;
  images: IAniZipImage[];
  mappings: IAniZipMappings;
}

// Utility type if you need to work with individual episodes
export type IAniZipEpisodeWithNumber = IAniZipEpisode & {
  episodeKey: string; // The episode number as string key
};
