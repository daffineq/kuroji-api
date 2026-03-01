export interface ShikimoriAnime {
  id: string;
  malId: string;
  name: string;
  russian: string;
  licenseNameRu: string;
  english: string;
  japanese: string;
  synonyms: string[];
  kind: string;
  rating: string;
  score: number;
  status: string;
  episodes: number;
  episodesAired: number;
  duration: number;
  franchise: string;
  url: string;
  season: string;
  description: string;
  descriptionHtml: string;
  descriptionSource: string;

  chronology: ShikimoriChronology[];

  airedOn: ShikimoriDate;
  releasedOn: ShikimoriDate;

  poster: ShikimoriPoster;

  videos: ShikimoriVideo[];
  screenshots: ShikimoriScreenshot[];
}

export interface ShikimoriDate {
  year: number;
  month: number;
  day: number;
  date: string;
}

export interface ShikimoriChronology {
  id: number;
}

export interface ShikimoriPoster {
  id: string;
  originalUrl: string;
  mainUrl: string;
}

export interface ShikimoriVideo {
  id: string;
  url: string;
  name: string;
  kind: string;
  playerUrl: string;
  imageUrl: string;
}

export interface ShikimoriScreenshot {
  id: string;
  originalUrl: string;
  x166Url: string;
  x332Url: string;
}
