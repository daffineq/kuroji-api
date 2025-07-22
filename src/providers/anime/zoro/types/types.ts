import { ISource } from '@consumet/extensions';
import { Prisma } from '@prisma/client';

export interface ZoroSource {
  headers?: { [key: string]: string };

  tracks?: {
    url: string;
    lang: string;
  }[];

  intro?: {
    start: number;
    end: number;
  };

  outro?: {
    start: number;
    end: number;
  };

  sources: {
    url: string;
    isM3U8?: boolean;
    type?: string;
    [key: string]: unknown;
  }[];

  anilistID?: number;
  malID?: number;
}

export function convertZoroSource(data: ZoroSource): ISource {
  return {
    headers: data.headers,
    intro: data.intro,
    outro: data.outro,
    subtitles: data.tracks,
    sources: data.sources,
  };
}

export const zoroSelect = {
  id: true,
  title: true,
  malID: true,
  alID: true,
  japaneseTitle: true,
  image: true,
  description: true,
  type: true,
  url: true,
  updatedAt: true,
  subOrDub: true,
  hasSub: true,
  hasDub: true,
  status: true,
  season: true,
  totalEpisodes: true,

  episodes: {
    select: {
      id: true,
      number: true,
      title: true,
      isFiller: true,
      isSubbed: true,
      isDubbed: true,
      url: true,
    },
  },
} satisfies Prisma.ZoroSelect;

export type ZoroPayload = Prisma.ZoroGetPayload<{ select: typeof zoroSelect }>;
