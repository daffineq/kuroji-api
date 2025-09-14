import { Prisma } from '@prisma/client';

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
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
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

export const mappingSelect = {
  id: true,
  idMal: true,
  title: true,
  seasonYear: true,
  format: true,
  episodes: true,
  status: true,
  synonyms: true,
  airingSchedule: true,
  shikimori: {
    select: {
      episodes: true,
      episodesAired: true
    }
  },
  kitsu: {
    select: {
      episodeCount: true
    }
  }
} satisfies Prisma.AnilistSelect;
