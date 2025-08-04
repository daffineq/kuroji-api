import {
  AnilistAiringSchedule,
  EndDate,
  Prisma,
  StartDate,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { FullMediaResponse } from './response.js';
import { PageInfo } from '../graphql/types/PageInfo.js';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { TmdbImage } from '../../tmdb/types/types.js';
import { aniZipSelect } from '../../mappings/types/types.js';
import { zoroSelect } from '../../zoro/types/types.js';
import { animepaheSelect } from '../../animepahe/types/types.js';
import { animeKaiSelect } from '../../animekai/types/types.js';
import { anilibriaSelect } from '../../anilibria/types/types.js';

export interface MapperAnilist {
  id: number;
  episodes?: number | null;
  airingSchedule?: AnilistAiringSchedule[] | null;
  shikimori?: {
    episodes?: number | null;
    episodesAired?: number | null;
  } | null;
  kitsu?: {
    episodeCount?: number | null;
  } | null;
  status?: string | null;
  startDate: StartDate | null;
  endDate: EndDate | null;
  seasonYear: number | null;
}

export interface AnilistResponse {
  Page: {
    media: FullMediaResponse[];
    pageInfo: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
    };
  };
}

export interface FranchiseResponse<T> {
  pageInfo: PageInfo;
  franchise: Franchise | null;
  data: T[];
}

export interface SearchResponse<T> {
  franchise: any;
  data: T[];
  pageInfo: PageInfo;
}

export interface Franchise {
  cover?: TmdbImage | null;
  banner?: TmdbImage | null;
  title?: string | null;
  franchise?: string | null;
  description?: string | null;
}

export type SortDirection = 'asc' | 'desc';
export type NullsOrder = 'nulls-first' | 'nulls-last';
export type NestedSort = {
  [key: string]:
    | SortDirection
    | NestedSort
    | {
        sort?: NullsOrder;
        [key: string]: SortDirection | NullsOrder | undefined;
      };
};

export enum RandomType {
  POPULAR = 'popular',
  HIGHLY_RATED = 'highlyRated',
  TRENDING = 'trending',
  ANY = 'any',
}

export class RandomDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(RandomType)
  type?: RandomType = RandomType.ANY;

  @ApiProperty()
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPopularity?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minScore?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxTrendingRank?: number;
}

export const basicSelect: Prisma.AnilistSelect = {
  id: true,
  idMal: true,
  title: {
    select: {
      romaji: true,
      english: true,
      native: true,
    },
  },
  synonyms: true,
  bannerImage: true,
  coverImage: {
    select: {
      color: true,
      large: true,
      medium: true,
      extraLarge: true,
    },
  },
  type: true,
  format: true,
  status: true,
  description: true,
  startDate: {
    select: {
      day: true,
      month: true,
      year: true,
    },
  },
  season: true,
  seasonYear: true,
  episodes: true,
  duration: true,
  countryOfOrigin: true,
  source: true,
  popularity: true,
  favourites: true,
  score: true,
  isLocked: true,
  isAdult: true,
  genres: true,
  nextAiringEpisode: {
    select: {
      id: true,
      episode: true,
      airingAt: true,
    },
  },
};

export const fullSelect: Prisma.AnilistSelect = {
  id: true,
  idMal: true,
  title: {
    select: {
      romaji: true,
      english: true,
      native: true,
    },
  },
  bannerImage: true,
  status: true,
  type: true,
  format: true,
  coverImage: {
    select: {
      color: true,
      large: true,
      medium: true,
      extraLarge: true,
    },
  },
  updatedAt: true,
  description: true,
  startDate: {
    select: {
      day: true,
      month: true,
      year: true,
    },
  },
  endDate: {
    select: {
      day: true,
      month: true,
      year: true,
    },
  },
  season: true,
  seasonYear: true,
  episodes: true,
  duration: true,
  countryOfOrigin: true,
  isLicensed: true,
  source: true,
  hashtag: true,
  isLocked: true,
  isAdult: true,
  averageScore: true,
  meanScore: true,
  score: true,
  popularity: true,
  trending: true,
  favourites: true,
  genres: true,
  synonyms: true,
  trailer: {
    select: {
      id: true,
      site: true,
      thumbnail: true,
    },
  },
  latestAiringEpisode: {
    select: {
      id: true,
      episode: true,
      airingAt: true,
    },
  },
  nextAiringEpisode: {
    select: {
      id: true,
      episode: true,
      airingAt: true,
    },
  },
  lastAiringEpisode: {
    select: {
      id: true,
      episode: true,
      airingAt: true,
    },
  },
  studios: {
    select: {
      isMain: true,
      studio: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  airingSchedule: {
    select: {
      id: true,
      episode: true,
      airingAt: true,
    },
  },
  tags: {
    select: {
      rank: true,
      isMediaSpoiler: true,
      tag: {
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          isGeneralSpoiler: true,
          isAdult: true,
        },
      },
    },
  },
  rankings: {
    select: {
      id: true,
      rank: true,
      type: true,
      format: true,
      year: true,
      season: true,
      allTime: true,
      context: true,
    },
  },
  externalLinks: {
    select: {
      id: true,
      url: true,
      site: true,
      siteId: true,
      type: true,
      language: true,
      color: true,
      icon: true,
      notes: true,
      isDisabled: true,
    },
  },
  streamingEpisodes: {
    select: {
      title: true,
      thumbnail: true,
      url: true,
      site: true,
    },
  },
  scoreDistribution: {
    select: {
      score: true,
      amount: true,
    },
  },
  statusDistribution: {
    select: {
      status: true,
      amount: true,
    },
  },
};

export const mappingSelect: Prisma.AnilistSelect = {
  title: {
    select: {
      romaji: true,
      english: true,
      native: true,
    },
  },
  id: true,
  idMal: true,
  seasonYear: true,
  episodes: true,
  format: true,
  airingSchedule: true,
  status: true,
  synonyms: true,
  startDate: {
    select: {
      year: true,
      month: true,
      day: true,
    },
  },
  endDate: {
    select: {
      year: true,
      month: true,
      day: true,
    },
  },
  shikimori: {
    select: {
      english: true,
      japanese: true,
      episodes: true,
      episodesAired: true,
    },
  },
  kitsu: {
    select: {
      episodeCount: true,
    },
  },
  anizip: {
    select: aniZipSelect,
  },
  anilibria: {
    select: anilibriaSelect,
  },
  zoro: {
    select: zoroSelect,
  },
  animepahe: {
    select: animepaheSelect,
  },
  animekai: {
    select: animeKaiSelect,
  },
};
