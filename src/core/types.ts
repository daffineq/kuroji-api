import { AnimepaheEpisodeMetadata, AnimepaheInfoMetadata } from './anime/providers/animepahe/types';
import { MInfoMeta } from './anime/providers/mal/types';

interface Title {
  english?: string | null | undefined;
  romaji?: string | null | undefined;
  japanese?: string | null | undefined;
  native?: string | null | undefined;
}

interface Image {
  aspectRatio: number;
  lowQuality: string;
  mediumQuality: string;
  highQuality: string;
}

interface ExternalIds {
  mal: number | null | undefined;
  anilist: number | null | undefined;
  mdx: string | null | undefined;
}

interface AnimeInfo<T = unknown, E = unknown> {
  id: string | number | null | undefined;
  externalIds: ExternalIds;
  title: Title | null | undefined;
  synonyms: string[] | null | undefined;
  description: string | null | undefined;
  image: Image | null | undefined;
  banner: Image | null | undefined;
  logo: Image | null | undefined;
  airedEpisodes: number | null | undefined;
  totalEpisodes: number | null | undefined;
  metadata: T | null | undefined;
  episodes: Partial<E>[] | null | undefined;
}

export interface Episode<T = unknown> {
  id: number | string | undefined;
  title: string | null | undefined;
  image: Image | null | undefined;
  description: string | null | undefined;
  number: number | null | undefined;
  teaserUrl: string | null | undefined;
  metadata: T | null | undefined;
  isFiller: boolean | null | undefined;
  isRecap: boolean | null | undefined;
}

export interface Search<T = unknown> {
  id: number | string | null | undefined;
  title: Title | null | undefined;
  image: Image | null | undefined;
  banner: Image | null | undefined;
  logo: Image | string | null | undefined;
  description: string | null | undefined;
  airedEpisodes: number | null | undefined;
  totalEpisodes: number | null | undefined;
  metadata: T | null | undefined;
}

export enum VideoType {
  HLS = 'hls',
  DASH = 'dash',
  MP4 = 'mp4'
}

export interface Headers {
  Referer: string | null | undefined;
}

export interface IntroOutro {
  start: number | null | undefined;
  end: number | null | undefined;
}

export interface Download {
  url: string | null | undefined;
  quality: string | null | undefined;
}

export interface VideoSource {
  url: string | null | undefined;
  isM3U8: boolean | null | undefined;
  type: VideoType | null | undefined;
  quality: string | null | undefined;
  isDub: boolean | null | undefined;
}

export interface Subtitle {
  id: string | null | undefined;
  source: string | null | undefined;
  label: string | null | undefined;
  srcLang: string | null | undefined;
}

export interface Source<T = unknown> {
  headers: Headers | null | undefined;
  intro: IntroOutro | null | undefined;
  outro: IntroOutro | null | undefined;
  sources: Partial<VideoSource>[];
  subtitles: Partial<Subtitle>[] | null | undefined;
  download: Partial<Download>[] | string | null | undefined;
  chapters: string | null | undefined;
  thumbnails: string | null | undefined;
  metadata: T | null | undefined;
}

export interface CrysolineWrapper<T = unknown> {
  success: boolean;
  data: T | null | undefined;
}

export interface ReleaseDate {
  year: number | null | undefined;
  month: number | null | undefined;
  day: number | null | undefined;
}

export type AnimepaheInfo = AnimeInfo<AnimepaheInfoMetadata, Episode<AnimepaheEpisodeMetadata>>;
export type MALInfo = AnimeInfo<MInfoMeta, Episode>;
