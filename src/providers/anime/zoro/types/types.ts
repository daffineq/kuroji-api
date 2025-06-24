import { Zoro, EpisodeZoro } from '@prisma/client';

export interface ZoroWithRelations extends Zoro {
  episodes: EpisodeZoro[];
}

export interface ISubtitle {
  id?: string;
  url: string;
  lang: string;
}

export interface Intro {
  start: number;
  end: number;
}

export interface IVideo {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  isDASH?: boolean;
  size?: number;
  [x: string]: unknown;
}

export interface ZoroSource {
  headers?: { [key: string]: string };

  /**
   * Intro details in seconds, if available
   */
  intro?: Intro;

  /**
   * Outro details in seconds, if available
   */
  outro?: Intro;

  /**
   * Subtitle or tracks - unified as same type
   */
  subtitles?: ISubtitle[];

  /**
   * Main video sources
   */
  sources: IVideo[];

  /**
   * Optional download links
   */
  download?: string | { url?: string; quality?: string }[];

  /**
   * Optional embed URL
   */
  embedURL?: string;

  /**
   * AniList ID
   */
  anilistID?: number;

  /**
   * MyAnimeList ID
   */
  malID?: number;
}
