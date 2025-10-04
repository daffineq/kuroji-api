interface AnimepaheExternalLink {
  id: string;
  url: string;
  sourceName: string;
}

interface AnimepaheRelation {
  id: string;
  title: string | null;
  image: string | null;
  url: string | null;
  releaseDate: string | null;
  type: string | null;
  relationType: string | null;
}

interface AnimepaheInfoMetadata {
  year: number | null;
  season: string | null;
  status: string | null;
  type: string | null;
  startDate: string | null;
  endDate: string | null;
  duration: string | null;
  genres: string[] | null;
  studios: string[] | null;
  themes: string[] | null;
  demographics: string[] | null;
  externalLinks: AnimepaheExternalLink[];
}

interface AnimepaheEpisodeMetadata {
  duration: string | null;
  url: string | null;
}

interface AnimepaheSearchMetadata {
  year: number | null;
  rating: number | null;
  type: string | null;
}

export type {
  AnimepaheExternalLink,
  AnimepaheRelation,
  AnimepaheInfoMetadata,
  AnimepaheEpisodeMetadata,
  AnimepaheSearchMetadata
};
