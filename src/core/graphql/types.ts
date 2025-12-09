export interface AnimeArgs {
  page?: number;
  per_page?: number;
  search?: string;
  id?: number;
  id_in?: number[];
  id_not?: number;
  id_not_in?: number[];
  id_mal?: number;
  id_mal_in?: number[];
  id_mal_not?: number;
  id_mal_not_in?: number[];
  season?: string;
  season_year?: number;
  season_year_greater?: number;
  season_year_lesser?: number;
  format?: string;
  format_in?: string[];
  format_not_in?: string[];
  status?: string;
  status_in?: string[];
  status_not_in?: string[];
  type?: string;
  source?: string;
  source_in?: string[];
  country_of_origin?: string;
  is_licensed?: boolean;
  is_adult?: boolean;
  genres?: string[];
  genres_in?: string[];
  genres_not_in?: string[];
  tags?: string[];
  tags_in?: string[];
  tags_not_in?: string[];
  minimum_tag_rank?: number;
  studios?: string[];
  studios_in?: string[];
  score_greater?: number;
  score_lesser?: number;
  popularity_greater?: number;
  popularity_lesser?: number;
  episodes_greater?: number;
  episodes_lesser?: number;
  duration_greater?: number;
  duration_lesser?: number;
  start_date_greater?: string;
  start_date_lesser?: string;
  end_date_greater?: string;
  end_date_lesser?: string;
  start_date_like?: string;
  end_date_like?: string;
  has_next_episode?: boolean;
  franchise?: string;
  sort?: string[];
}

export interface ChronologyArgs extends AnimeArgs {
  parent_id: number;
}

export interface CharacterArgs {
  page?: number;
  per_page?: number;
}

export interface EpisodeArgs {
  id: number;
}

export interface ArtworksArgs {
  page?: number;
  per_page?: number;
  iso_639_1?: string;
}

export interface EpisodesArgs {
  page?: number;
  per_page?: number;
}
