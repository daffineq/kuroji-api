interface MSearchMeta {
  type: string | null;
  score: string | null;
  members: string | null;
}

interface MLink {
  label: string | null;
  url: string | null;
}

interface MEpisode {
  number: number;
  title: string;
  url: string;
  thumbnail: string | null;
}

export interface MVideo {
  title: string;
  url: string;
  thumbnail: string | null;
  artist?: string | null;
  type: 'trailer' | 'music';
}

export interface MInfoMeta {
  moreInfo: string | null;
  score: string | null;
  rank: string | null;
  popularity: string | null;
  members: string | null;
  type: string | null;
  episodes: string | null;
  status: string | null;
  aired: string | null;
  premiered: string | null;
  broadcast: string | null;
  producers: string[] | null;
  licensors: string[] | null;
  studios: string[] | null;
  source: string | null;
  genres: string[] | null;
  themes: string[] | null;
  duration: string | null;
  rating: string | null;
  favorites: string | null;
  externalLinks: MLink[] | null;
  streamingLinks: MLink[] | null;
  videos: MVideo[] | null;
}
