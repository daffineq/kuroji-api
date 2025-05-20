import { AnilistCover, AnilistNextAiringEpisode, AnilistTitle, ShikimoriPoster, StartDate } from '@prisma/client'

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

export interface BasicAnilist {
  id: number;
  idMal?: number;

  siteUrl?: string;
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
}

export interface BasicAnilistSmall {
  id: number
  idMal?: number

  siteUrl?: string
  title?: AnilistTitle

  coverImage?: AnilistCover

  type?: string
  format?: string
  status?: string

  startDate?: StartDate

  season?: string
  seasonYear?: number

  episodes?: number
  episodesAired?: number
  duration?: number

  score?: number;

  isLocked?: boolean
  isAdult?: boolean

  nextAiringEpisode?: AnilistNextAiringEpisode;

  shikimori?: BasicShikimori
}