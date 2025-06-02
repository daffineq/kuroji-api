import {
  Tvdb,
  TvdbAlias,
  TvdbArtwork,
  TvdbRemoteId,
  TvdbTrailer,
  TvdbAirDays,
} from '@prisma/client';

export interface BasicTvdb {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface SearchResponse {
  data: {
    movie: BasicTvdb;
    series: BasicTvdb;
    episode: BasicTvdb;
  }[];
  status: string;
}

export interface RemoteId {
  id: string;
  type: number;
  sourceName: string;
}

export interface TvdbWithRelations extends Tvdb {
  status: TvdbStatus;
  aliases: TvdbAlias[];
  artworks: TvdbArtwork[];
  remoteIds: TvdbRemoteId[];
  trailers: TvdbTrailer[];
  airDays: TvdbAirDays;
}

export enum TvdbStatus {
  Continuing = 'Continuing',
  Ended = 'Ended',
  Cancelled = 'Cancelled',
  Pilot = 'Pilot',
}

export interface TvdbInput {
  id: number;
  tmdbId?: number;
  type?: string;
  name?: string;
  slug?: string;
  image?: string;
  score?: number;
  runtime?: number;
  lastUpdated?: string;
  year?: string;
  nameTranslations?: string[];
  overviewTranslations?: string[];

  status?: {
    id: number;
    name?: string;
    recordType?: string;
    keepUpdated?: boolean;
  };

  aliases?: Array<{
    name?: string;
    language?: string;
  }>;

  artworks?: Array<{
    id: number;
    height?: number;
    image?: string;
    includesText?: boolean;
    language?: string;
    score?: number;
    thumbnail?: string;
    type?: number;
    width?: number;
  }>;

  remoteIds?: Array<{
    id: string;
    type?: number;
    sourceName?: string;
  }>;

  trailers?: Array<{
    id: number;
    url?: string;
    name?: string;
    runtime?: number;
    language?: string;
  }>;

  airsDays?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };

  airsTime?: string;
}
