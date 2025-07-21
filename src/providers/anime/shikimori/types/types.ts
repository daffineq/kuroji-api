import {
  Shikimori,
  ShikimoriPoster,
  AiredOn,
  ReleasedOn,
  BasicIdShik,
  ShikimoriVideo,
  ShikimoriScreenshot,
  Prisma,
} from '@prisma/client';

export interface ShikimoriWithRelations extends Shikimori {
  poster: ShikimoriPoster;
  airedOn: AiredOn;
  releasedOn: ReleasedOn;
  chronology: BasicIdShik[];
  videos: ShikimoriVideo[];
  screenshots: ShikimoriScreenshot[];
}

export interface ShikimoriResponse {
  animes: ShikimoriWithRelations[];
}

export const shikimoriSelect: Prisma.ShikimoriSelect = {
  id: true,
  malId: true,
  name: true,
  russian: true,
  licenseNameRu: true,
  english: true,
  japanese: true,
  synonyms: true,
  kind: true,
  rating: true,
  score: true,
  status: true,
  episodes: true,
  episodesAired: true,
  duration: true,
  franchise: true,
  url: true,
  season: true,
  createdAt: true,
  updatedAt: true,
  nextEpisodeAt: true,
  description: true,
  descriptionHtml: true,
  descriptionSource: true,

  poster: {
    select: {
      id: true,
      originalUrl: true,
      mainUrl: true,
    },
  },
  airedOn: {
    select: {
      id: true,
      year: true,
      month: true,
      day: true,
      date: true,
    },
  },
  releasedOn: {
    select: {
      id: true,
      year: true,
      month: true,
      day: true,
      date: true,
    },
  },
  chronology: {
    select: {
      id: true,
      malId: true,
    },
  },
  videos: {
    select: {
      id: true,
      url: true,
      name: true,
      kind: true,
      playerUrl: true,
      imageUrl: true,
    },
  },
  screenshots: {
    select: {
      id: true,
      originalUrl: true,
      x166Url: true,
      x332Url: true,
    },
  },
};

export type ShikimoriPayload = Prisma.ShikimoriGetPayload<{
  select: typeof shikimoriSelect;
}>;
