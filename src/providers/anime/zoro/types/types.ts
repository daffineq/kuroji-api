import { ISource } from '@consumet/extensions';
import { Zoro, EpisodeZoro } from '@prisma/client';

export interface ZoroWithRelations extends Zoro {
  episodes: EpisodeZoro[];
}

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
