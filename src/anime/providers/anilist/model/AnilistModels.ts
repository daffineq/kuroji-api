import { Anilist, AnilistTitle, AnilistCover, StartDate, EndDate, AnilistTrailer, AnilistStudio, AnilistAiringSchedule, AnilistTag, AnilistExternalLink, AnilistStreamingEpisode, AnilistRanking, AnilistScoreDistribution, AnilistStatusDistribution } from '@prisma/client'
import { PageInfo } from '../graphql/types/PageInfo'
import { BasicAnilist } from './BasicAnilist'
import { KitsuWithRelations } from '../../kitsu/service/kitsu.service'
import { ShikimoriWithRelations } from '../../shikimori/service/shikimori.service'
import { FullMediaResponse } from './AnilistResponse'
import { ZoroWithRelations } from '../../zoro/service/zoro.service'

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
  pageInfo: PageInfo
  franchise: Franchise
  data: T
}

export interface SearcnResponse<T> {
  franchise: any
  data: T
  pageInfo: PageInfo
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
  cover?: string,
  banner?: string,
  title?: string,
  franchise?: string,
  description?: string,
}

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type Schedule = {
  [key in Weekday]: ScheduleData
}

export interface ScheduleData {
  current: boolean
  data: BasicAnilist[]
}