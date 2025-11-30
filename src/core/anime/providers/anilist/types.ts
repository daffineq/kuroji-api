export interface AnilistMediaResponse {
  data: {
    Media: AnilistMedia;
  };
}

export interface AnilistMedia {
  id: number;
  idMal?: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
    userPreferred?: string;
  };
  type?: string;
  format?: string;
  status?: string;
  description?: string;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
  season?: string;
  seasonYear?: number;
  episodes?: number;
  duration?: number;
  countryOfOrigin?: string;
  isLicensed?: boolean;
  source?: string;
  hashtag?: string;
  trailer?: {
    id?: string;
    site?: string;
    thumbnail?: string;
  };
  updatedAt?: number;
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    color?: string;
  };
  bannerImage?: string;
  genres: string[];
  synonyms: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  isLocked?: boolean;
  trending?: number;
  favourites?: number;
  tags: {
    id: number;
    name: string;
    description?: string;
    category?: string;
    rank?: number;
    isGeneralSpoiler?: boolean;
    isMediaSpoiler?: boolean;
    isAdult?: boolean;
  }[];
  characters: {
    edges: {
      favouriteOrder?: number;
      id: number;
      name?: string;
      node: {
        id: number;
        name: {
          first?: string;
          middle?: string;
          last?: string;
          full?: string;
          native?: string;
          alternative?: string[];
          alternativeSpoiler?: string[];
          userPreferred?: string;
        };
        image?: {
          large?: string;
          medium?: string;
        };
        description?: string;
        gender?: string;
        dateOfBirth?: {
          year?: number;
          month?: number;
          day?: number;
        };
        age?: string;
        bloodType?: string;
        isFavourite?: boolean;
        isFavouriteBlocked?: boolean;
        siteUrl?: string;
        favourites?: number;
        modNotes?: string;
      };
      role?: string;
      voiceActors?: {
        id: number;
        name: {
          first?: string;
          middle?: string;
          last?: string;
          full?: string;
          native?: string;
          alternative?: string[];
          userPreferred?: string;
        };
        image?: {
          large?: string;
          medium?: string;
        };
        age?: number;
        bloodType?: string;
        dateOfBirth?: {
          year?: number;
          month?: number;
          day?: number;
        };
        dateOfDeath?: {
          year?: number;
          month?: number;
          day?: number;
        };
        description?: string;
        favourites?: number;
        gender?: string;
        homeTown?: string;
        languageV2?: string;
        siteUrl?: string;
      }[];
    }[];
  };
  studios: {
    edges: {
      favouriteOrder?: number;
      id: number;
      isMain?: boolean;
      node: {
        id: number;
        name: string;
        siteUrl?: string;
        favourites?: number;
        isAnimationStudio?: boolean;
      };
    }[];
  };
  isAdult?: boolean;
  nextAiringEpisode?: {
    airingAt: number;
    episode: number;
    id: number;
    mediaId: number;
    timeUntilAiring: number;
  };
  airingSchedule?: {
    edges: {
      id: number;
      node: {
        airingAt: number;
        episode: number;
        id: number;
        mediaId: number;
        timeUntilAiring: number;
      };
    }[];
  };
  externalLinks: {
    id: number;
    url: string;
    site: string;
    siteId?: number;
    type?: string;
    language?: string;
    color?: string;
    icon?: string;
    notes?: string;
    isDisabled?: boolean;
  }[];
  streamingEpisodes: {
    title: string;
    thumbnail: string;
    url: string;
    site: string;
  }[];
  rankings: {
    id: number;
    rank: number;
    type: string;
    format?: string;
    year?: number;
    season?: string;
    allTime?: boolean;
    context: string;
  }[];
  stats?: {
    scoreDistribution: {
      score: number;
      amount: number;
    }[];
    statusDistribution: {
      status: string;
      amount: number;
    }[];
  };
  siteUrl?: string;
}

export enum MediaType {
  ANIME = 'ANIME',
  MANGA = 'MANGA'
}

export enum MediaFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
  MANGA = 'MANGA',
  NOVEL = 'NOVEL',
  ONE_SHOT = 'ONE_SHOT'
}

export enum MediaStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
  HIATUS = 'HIATUS'
}

export enum MediaSeason {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL'
}

export function normalizeMediaSeason(season?: string | null): string | null | undefined {
  if (season == null) return season;

  switch (season.toUpperCase()) {
    case 'FALL':
      return 'autumn';
    case 'WINTER':
    case 'SPRING':
    case 'SUMMER':
      return season.toLowerCase();
    default:
      return season;
  }
}

export enum MediaSource {
  ORIGINAL = 'ORIGINAL',
  MANGA = 'MANGA',
  LIGHT_NOVEL = 'LIGHT_NOVEL',
  VISUAL_NOVEL = 'VISUAL_NOVEL',
  VIDEO_GAME = 'VIDEO_GAME',
  OTHER = 'OTHER',
  NOVEL = 'NOVEL',
  DOUJINSHI = 'DOUJINSHI',
  ANIME = 'ANIME'
}

export enum MediaCountry {
  JP = 'JP',
  KR = 'KR',
  CN = 'CN',
  TW = 'TW'
}

export enum MediaSort {
  ID = 'id',
  ID_DESC = 'id_desc',
  TITLE_ROMAJI = 'title_romaji',
  TITLE_ROMAJI_DESC = 'title_romaji_desc',
  TITLE_ENGLISH = 'title_english',
  TITLE_ENGLISH_DESC = 'title_english_desc',
  TITLE_NATIVE = 'title_native',
  TITLE_NATIVE_DESC = 'title_native_desc',
  TYPE = 'type',
  TYPE_DESC = 'type_desc',
  FORMAT = 'format',
  FORMAT_DESC = 'format_desc',
  START_DATE = 'start_date',
  START_DATE_DESC = 'start_date_desc',
  END_DATE = 'end_date',
  END_DATE_DESC = 'end_date_desc',
  SCORE = 'score',
  SCORE_DESC = 'score_desc',
  POPULARITY = 'popularity',
  POPULARITY_DESC = 'popularity_desc',
  FAVOURITES = 'favourites',
  FAVOURITES_DESC = 'favourites_desc',
  TRENDING = 'trending',
  TRENDING_DESC = 'trending_desc',
  EPISODES = 'episodes',
  EPISODES_DESC = 'episodes_desc',
  DURATION = 'duration',
  DURATION_DESC = 'duration_desc',
  STATUS = 'status',
  STATUS_DESC = 'status_desc',
  UPDATED_AT = 'updated_at',
  UPDATED_AT_DESC = 'updated_at_desc',
  LATEST_EPISODE = 'latest_episode',
  LATEST_EPISODE_DESC = 'latest_episode_desc',
  NEXT_EPISODE = 'next_episode',
  NEXT_EPISODE_DESC = 'next_episode_desc',
  LAST_EPISODE = 'last_episode',
  LAST_EPISODE_DESC = 'last_episode_desc'
}

export enum TagSort {
  ID = 'id',
  ID_DESC = 'id_desc',
  NAME = 'name',
  NAME_DESC = 'name_desc',
  CATEGORY = 'category',
  CATEGORY_DESC = 'category_desc'
}

export enum AgeRating {
  G = 'g',
  PG = 'pg',
  PG_13 = 'pg_13',
  R = 'r',
  R_PLUS = 'r_plus',
  RX = 'rx'
}
