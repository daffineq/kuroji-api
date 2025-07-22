import {
  Tvdb,
  TvdbAlias,
  TvdbArtwork,
  TvdbRemoteId,
  TvdbTrailer,
  TvdbStatus,
  Prisma,
} from '@prisma/client';

export interface BasicTvdb {
  id: string;
  tvdb_id?: string;
  objectID?: string;
  name: string;
  aliases: string[];
  slug: string;
  image: string;
  image_url?: string;
  thumbnail?: string;
  country?: string;
  year?: string;
  first_air_time?: string;
  overview?: string;
  overviews?: Record<string, string>;
  primary_language?: string;
  primary_type?: string;
  status?: string;
  type?: string;
  translations?: Record<string, string>;
  network?: string;
  remote_ids?: Array<{
    id: string;
    type: number;
    sourceName: string;
  }>;
}

export interface SearchResponse {
  data: {
    movie: BasicTvdb;
    series: BasicTvdb;
    episode: BasicTvdb;
  }[];
  status: string;
}

export interface Response<T> {
  data: T;
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
}

export enum ETvdbStatus {
  Continuing = 'Continuing',
  Ended = 'Ended',
  Cancelled = 'Cancelled',
  Pilot = 'Pilot',
}

export interface TvdbInput {
  id: number;
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

export const tvdbSelect = {
  id: true,
  type: true,
  name: true,
  slug: true,
  image: true,
  score: true,
  runtime: true,
  lastUpdated: true,
  year: true,
  nameTranslations: true,
  overviewTranslations: true,

  status: {
    select: {
      id: true,
      name: true,
      recordType: true,
      keepUpdated: true,
    },
  },

  aliases: {
    select: {
      id: true,
      name: true,
      language: true,
    },
  },

  artworks: {
    select: {
      id: true,
      height: true,
      image: true,
      includesText: true,
      language: true,
      score: true,
      thumbnail: true,
      type: true,
      width: true,
    },
  },

  remoteIds: {
    select: {
      id: true,
      type: true,
      sourceName: true,
    },
  },

  trailers: {
    select: {
      id: true,
      url: true,
      name: true,
      runtime: true,
      language: true,
    },
  },
} satisfies Prisma.TvdbSelect;

export const tvdbArtworkSelect = {
  id: true,
  height: true,
  image: true,
  includesText: true,
  language: true,
  score: true,
  thumbnail: true,
  type: true,
  width: true,
} satisfies Prisma.TvdbArtworkSelect;

export const tvdbLanguageTranslationSelect = {
  id: true,
  name: true,
  overview: true,
  isAlias: true,
  isPrimary: true,
  language: true,
  tagline: true,
  aliases: true,
} satisfies Prisma.TvdbLanguageTranslationSelect;

export const tvdbLanguageSelect = {
  id: true,
  name: true,
  nativeName: true,
  shortCode: true,
} satisfies Prisma.TvdbLanguageSelect;

export type TvdbPayload = Prisma.TvdbGetPayload<{
  select: typeof tvdbSelect;
}>;
