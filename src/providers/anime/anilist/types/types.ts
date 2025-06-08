import {
  Anilist,
  AnilistAiringSchedule,
  AnilistCover,
  AnilistExternalLink,
  AnilistRanking,
  AnilistScoreDistribution,
  AnilistStatusDistribution,
  AnilistStreamingEpisode,
  AnilistStudio,
  AnilistTag,
  AnilistTitle,
  AnilistTrailer,
  EndDate,
  KitsuCoverImage,
  KitsuPosterImage,
  KitsuTitle,
  ShikimoriPoster,
  StartDate,
} from '@prisma/client';
import { FullMediaResponse } from './response';
import { PageInfo } from '../graphql/types/PageInfo';
import { KitsuWithRelations } from '../../kitsu/types/types';
import { ShikimoriWithRelations } from '../../shikimori/types/types';
import { ZoroWithRelations } from '../../zoro/types/types';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';

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
  franchise: Franchise;
  data: T;
}

export interface SearcnResponse<T> {
  franchise: any;
  data: T;
  pageInfo: PageInfo;
}

export interface AnilistWithRelations extends Anilist {
  title?: AnilistTitle;
  coverImage?: AnilistCover;
  startDate?: StartDate;
  endDate?: EndDate;
  trailer?: AnilistTrailer;
  studios?: AnilistStudio[];
  airingSchedule?: AnilistAiringSchedule[];
  nextAiringEpisode?: AnilistAiringSchedule;
  tags?: AnilistTag[];
  rankings?: AnilistRanking[];
  externalLinks?: AnilistExternalLink[];
  streamingEpisodes?: AnilistStreamingEpisode[];
  scoreDistribution?: AnilistScoreDistribution[];
  statusDistribution?: AnilistStatusDistribution[];
  shikimori?: ShikimoriWithRelations;
  kitsu?: KitsuWithRelations;
  zoro?: ZoroWithRelations;
}

export interface Franchise {
  cover?: string;
  banner?: string;
  title?: string;
  franchise?: string;
  description?: string;
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type Schedule = {
  [key in Weekday]: ScheduleData;
};

export interface ScheduleData {
  current: boolean;
  data: BasicAnilist[];
}

export interface BasicShikimori {
  id?: string;
  malId?: number;
  russian?: string;
  licenseNameRu?: string;
  episodes?: number;
  episodesAired?: number;
  url?: string;
  franchise?: string;
  poster?: ShikimoriPoster;
}

export interface BasicKitsu {
  id?: string;
  anilistId?: number;
  titles?: KitsuTitle;
  slug?: string;
  synopsis?: string;
  episodeCount?: number;
  episodeLength?: number;
  canonicalTitle?: string;
  averageRating?: string;
  ageRating?: string;
  ageRatingGuide?: string;
  posterImage?: KitsuPosterImage;
  coverImage?: KitsuCoverImage;
  showType?: string;
}

export interface BasicAnilist {
  id: number;
  idMal?: number;

  title?: AnilistTitle;

  synonyms?: string[];

  bannerImage?: string;
  coverImage?: AnilistCover;

  type?: string;
  format?: string;
  status?: string;
  description?: string;

  startDate?: StartDate;

  season?: string;
  seasonYear?: number;

  episodes?: number;
  sub?: number;
  dub?: number;
  duration?: number;

  countryOfOrigin?: string;
  popularity?: number;
  favourites?: number;

  score?: number;

  isLocked?: boolean;
  isAdult?: boolean;

  genres?: string[];

  nextAiringEpisode?: AnilistAiringSchedule;

  shikimori?: BasicShikimori;
  kitsu?: BasicKitsu;
}

export type SortDirection = 'asc' | 'desc';
export type NestedSort = { [key: string]: SortDirection | NestedSort };

export enum RandomType {
  POPULAR = 'popular',
  HIGHLY_RATED = 'highlyRated',
  TRENDING = 'trending',
  ANY = 'any',
}

export class RandomDto {
  @IsOptional()
  @IsEnum(RandomType)
  type?: RandomType = RandomType.ANY;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPopularity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxTrendingRank?: number;
}
