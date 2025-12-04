export interface ShikimoriAnime {
  id: string;
  malId?: string;
  name?: string;
  russian?: string;
  licenseNameRu?: string;
  english?: string;
  japanese?: string;
  synonyms?: string[];
  kind?: string;
  rating?: string;
  score?: number;
  status?: string;
  episodes?: number;
  episodesAired?: number;
  duration?: number;
  franchise?: string;
  url?: string;
  season?: string;
  description?: string;
  descriptionHtml?: string;
  descriptionSource?: string;

  chronology?: {
    id: number;
  }[];

  airedOn?: {
    year?: number;
    month?: number;
    day?: number;
    date?: string;
  };
  releasedOn?: {
    year?: number;
    month?: number;
    day?: number;
    date?: string;
  };
  poster?: {
    id: string;
    originalUrl?: string;
    mainUrl?: string;
  };
  videos?: {
    id: string;
    url?: string;
    name?: string;
    kind?: string;
    playerUrl?: string;
    imageUrl?: string;
  }[];
  screenshots?: {
    id: string;
    originalUrl?: string;
    x166Url?: string;
    x332Url?: string;
  }[];
}
