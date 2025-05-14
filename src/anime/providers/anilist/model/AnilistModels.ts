import { Anilist, AnilistTitle, AnilistCover, StartDate, EndDate, AnilistTrailer, AnilistCharacter, AnilistStudio, AnilistAiringSchedule, AnilistNextAiringEpisode, AnilistTag, AnilistExternalLink, AnilistStreamingEpisode, Shikimori, AnilistRanking, AnilistScoreDistribution, AnilistStatusDistribution, AnilistPromoVideo, AnilistMusicVideo, AnilistJikanEpisode } from '@prisma/client'
import { PageInfo } from '../graphql/types/PageInfo'
import { BasicAnilistSmall } from './BasicAnilist'

export interface AnilistResponse {
  Page: {
    media: Anilist[];
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
  cover?: AnilistCover;
  startDate?: StartDate;
  endDate?: EndDate;
  trailer?: AnilistTrailer;
  characters?: AnilistCharacter[];
  studios?: AnilistStudio[];
  airingSchedule?: AnilistAiringSchedule[];
  nextAiringEpisode?: AnilistNextAiringEpisode;
  tags?: AnilistTag[];
  rankings?: AnilistRanking[];
  externalLinks?: AnilistExternalLink[];
  streamingEpisodes?: AnilistStreamingEpisode[];
  scoreDistribution?: AnilistScoreDistribution[];
  statusDistribution?: AnilistStatusDistribution[];
  promoVideos?: AnilistPromoVideo[];
  jikanEpisodes?: AnilistJikanEpisode[];
  musicVideos?: AnilistMusicVideo[];
  shikimori?: Shikimori;
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
  data: BasicAnilistSmall[]
}