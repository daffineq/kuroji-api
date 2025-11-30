const TYPE_NAMES: Record<number, string> = {
  1: 'Banner',
  2: 'Poster',
  3: 'Background',
  5: 'Icon',
  6: 'Banner',
  7: 'Poster',
  8: 'Background',
  10: 'Icon',
  11: '16:9 Screencap',
  12: '4:3 Screencap',
  13: 'Photo',
  14: 'Poster',
  15: 'Background',
  16: 'Banner',
  18: 'Icon',
  19: 'Icon',
  20: 'Cinemagraph',
  21: 'Cinemagraph',
  22: 'ClearArt',
  23: 'ClearLogo',
  24: 'ClearArt',
  25: 'ClearLogo',
  26: 'Icon',
  27: 'Poster'
};

export function getTypeNameById(id: number): string {
  return TYPE_NAMES[id] || 'Poster';
}

export interface TvdbSearchResult {
  id: string;
  tvdb_id?: string;
  objectID?: string;
  name: string;
  aliases: string[];
  slug: string;
  image: string;
  image_url?: string;
  thumbnail?: string;
  country?: string;
  year?: string;
  first_air_time?: string;
  overview?: string;
  overviews?: Record<string, string>;
  primary_language?: string;
  primary_type?: string;
  status?: string;
  type?: string;
  translations?: Record<string, string>;
  network?: string;
  remote_ids?: Array<{
    id: string;
    type: number;
    sourceName: string;
  }>;
}

export interface TvdbInfoResult {
  id: number;
  type?: string;
  name?: string;
  slug?: string;
  image?: string;
  score?: number;
  runtime?: number;
  lastUpdated?: string;
  year?: string;
  nameTranslations?: string[];
  overviewTranslations?: string[];

  status?: {
    id: number;
    name?: string;
    recordType?: string;
    keepUpdated?: boolean;
  };

  aliases?: Array<{
    name?: string;
    language?: string;
  }>;

  artworks?: Array<{
    id: number;
    height?: number;
    image?: string;
    includesText?: boolean;
    language?: string;
    score?: number;
    thumbnail?: string;
    type?: number;
    width?: number;
  }>;

  remoteIds?: Array<{
    id: string;
    type?: number;
    sourceName?: string;
  }>;

  trailers?: Array<{
    id: number;
    url?: string;
    name?: string;
    runtime?: number;
    language?: string;
  }>;

  airsDays?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };

  airsTime?: string;
}

export interface LoginResponse {
  status: string;
  data: {
    token: string;
  };
}
