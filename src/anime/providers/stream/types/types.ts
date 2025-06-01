export enum SourceType {
  soft_sub = 'soft_sub',
  hard_sub = 'hard_sub',
  dub = 'dub',
  both = 'both',
}

export enum Provider {
  zoro = 'zoro',
  animekai = 'animekai',
  animepahe = 'animepahe',
}

export interface Episode {
  title: string | null;
  image: TmdbImage;
  number: number | null;
  overview: string;
  date: string;
  duration: number;
  filler: boolean | null;
  sub: boolean | null;
  dub: boolean | null;
}

export interface EpisodeDetails extends Episode {
  images: EpisodeImage[];
}

export interface EpisodeImage {
  image: TmdbImage;
  aspectRation: number;
  height: number;
  width: number;
  iso_639_1: string;
  voteAverage: number;
  voteCount: number;
}

export interface ProviderInfo {
  id: string;
  filler: boolean;
  provider: Provider;
  type: SourceType;
}

export interface TmdbImage {
  w300: string;
  w500: string;
  original: string;
}