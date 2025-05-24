import { AnilistCover, AnilistNextAiringEpisode, AnilistTitle, KitsuCoverImage, KitsuPosterImage, KitsuTitle, ShikimoriPoster, StartDate } from '@prisma/client'

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
  moreInfo?: string;

  startDate?: StartDate;

  season?: string;
  seasonYear?: number;

  episodes?: number;
  episodesAired?: number;
  duration?: number;

  countryOfOrigin?: string;
  popularity?: number;
  favourites?: number;

  score?: number;

  isLocked?: boolean;
  isAdult?: boolean;

  genres?: string[];

  nextAiringEpisode?: AnilistNextAiringEpisode;

  shikimori?: BasicShikimori;
  kitsu?: BasicKitsu;
}