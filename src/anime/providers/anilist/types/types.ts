import { Anilist, AnilistAiringSchedule, AnilistCover, AnilistExternalLink, AnilistRanking, AnilistScoreDistribution, AnilistStatusDistribution, AnilistStreamingEpisode, AnilistStudio, AnilistTag, AnilistTitle, AnilistTrailer, EndDate, KitsuCoverImage, KitsuPosterImage, KitsuTitle, ShikimoriPoster, StartDate } from '@prisma/client'
import { PageInfo } from '../graphql/types/PageInfo'
import { KitsuWithRelations } from '../../kitsu/types/types'
import { ShikimoriWithRelations } from '../../shikimori/types/types'
import { ZoroWithRelations } from '../../zoro/types/types'

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

export interface BasicShikimori {
  id?: string;
  malId?: number;
  russian?: string;
  licenseNameRu?: string;
  episodes?: number,
  episodesAired?: number,
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

export interface FullMediaResponse {
  id: number
  idMal: number
  title: {
    romaji: string
    english: string
    native: string
  }
  status: string
  type: string
  format: string
  updatedAt: number
  coverImage: {
    extraLarge: string
    large: string
    medium: string
    color: string | null
  }
  recommendations: {
    edges: {
      node: {
        id: number
        rating: number
        mediaRecommendation: {
          id: number
          idMal: number
        }
      }
    }[]
  }
  description: string
  startDate: {
    year: number
    month: number
    day: number
  }
  endDate: {
    year: number
    month: number
    day: number
  }
  season: string
  seasonYear: number
  episodes: number
  duration: number
  countryOfOrigin: string
  isLicensed: boolean
  source: string
  hashtag: string
  trailer: {
    id: string
    site: string
    thumbnail: string
  } | null
  genres: string[]
  synonyms: string[]
  averageScore: number
  meanScore: number
  popularity: number
  isLocked: boolean
  trending: number
  favourites: number
  tags: {
    id: number
    name: string
    description: string
    category: string
    rank: number
    isGeneralSpoiler: boolean
    isMediaSpoiler: boolean
    isAdult: boolean
  }[]
  rankings: {
    id: number
    rank: number
    type: string
    format: string
    year: number
    season: string
    allTime: boolean
    context: string
  }[]
  characters: {
    edges: {
      id: number
      node: {
        id: number
        name: {
          full: string
          native: string
          alternative: string[]
        }
        image: {
          large: string
          medium: string
        }
      }
      role: string
      voiceActors: {
        id: number
        image: {
          large: string
          medium: string
        }
        name: {
          full: string
          native: string
          alternative: string[]
        }
        languageV2: string
      }[]
    }[]
  }
  studios: {
    edges: {
      id: number
      isMain: boolean
      node: {
        id: number
        name: string
      }
    }[]
  }
  isAdult: boolean
  nextAiringEpisode: {
    id: number
    airingAt: number
    episode: number
  } | null
  airingSchedule: {
    edges: {
      node: {
        id: number
        airingAt: number
        episode: number
      }
    }[]
  }
  externalLinks: {
    id: number
    url: string
    site: string
    type: string
  }[]
  streamingEpisodes: {
    title: string
    thumbnail: string
    url: string
    site: string
  }[]
  stats: {
    scoreDistribution: {
      score: number
      amount: number
    }[]
    statusDistribution: {
      status: string
      amount: number
    }[]
  }
  bannerImage: string
}