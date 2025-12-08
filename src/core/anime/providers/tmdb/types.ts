export interface TmdbSearchResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;

  // Movie-specific fields
  original_title?: string;
  release_date?: string;
  title?: string;
  video?: boolean;

  // Series-specific fields
  origin_country?: string[];
  original_name?: string;
  first_air_date?: string;
  name?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Last episode info for series
export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

// Network info for series
export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Season info for series
export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

// TMDB series details
export interface TmdbInfoSeries {
  adult: boolean;
  backdrop_path: string | null;
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

// TMDB unified details for movies and series
export interface TmdbInfoResult {
  adult: boolean;
  backdrop_path: string | null;
  genres: Genre[];
  homepage: string;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;

  // Movie-specific fields
  belongs_to_collection?: any | null;
  budget?: number;
  imdb_id?: string;
  original_title?: string;
  release_date?: string;
  revenue?: number;
  runtime?: number;
  title?: string;
  video?: boolean;
  origin_country?: string[];

  // Series-specific fields
  episode_run_time?: number[];
  first_air_date?: string;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: Episode;
  name?: string;
  next_episode_to_air?: Episode | null;
  networks?: Network[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  original_name?: string;
  seasons?: Season[];
  type?: string;
}

export interface TmdbTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: {
    title?: string;
    name?: string;
    overview: string;
    homepage?: string;
    biography?: string;
  };
}

export interface SeasonEpisode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  season_episode_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface TmdbImage {
  height: number;
  width: number;
  file_path: string;
  iso_639_1: string;
  type: string;
}

export interface SeasonTmdb {
  _id: string;
  air_date: string;
  episodes: SeasonEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface EpisodeMatchCandidate {
  episode: SeasonEpisode;
  confidence: number;
  reasons: string[];
  anilistEpisodeNumber: number;
}

export enum MatchStrategy {
  DATE_RANGE = 'date_range',
  EPISODE_COUNT = 'episode_count',
  AIRING_SCHEDULE = 'airing_schedule',
  SEASON_YEAR = 'season_year',
  ZORO = 'zoro',
  ANIMEPAHE = 'animepahe',
  NONE = 'none'
}

export interface MatchResult {
  episodes: SeasonEpisode[];
  primarySeason: number;
  confidence: number;
  strategy: MatchStrategy;
}

export interface SeasonEpisodeGroup {
  seasonNumber: number;
  episodes: SeasonEpisode[];
  totalEpisodes: number;
}
