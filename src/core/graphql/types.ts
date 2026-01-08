import { Image } from '@crysoline/lib/dist/core/types';
import { EpisodeProvider, TmdbEpisode, TmdbUtils } from '../anime';

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
  number: number;
}

export interface ArtworksArgs {
  page?: number;
  per_page?: number;
  iso_639_1?: string;
}

export interface SourcesArgs {
  id: number;
  ep_id: string;
}

export interface MergedEpisode {
  number: number;
  title: string | null;
  overview: string | null;
  image: Image | string | null;
  runtime: number | null;
  air_date: string | null;
  providers: EpisodeProvider[];
}

export const formatEpisodeData = (episode: TmdbEpisode) => ({
  title: episode.name,
  air_date: episode.air_date,
  overview: episode.overview,
  number: episode.episode_number,
  runtime: episode.runtime,
  image: {
    aspectRatio: 1,
    small: TmdbUtils.getImage('w300', episode.still_path) ?? '',
    medium: TmdbUtils.getImage('w780', episode.still_path) ?? '',
    large: TmdbUtils.getImage('original', episode.still_path) ?? ''
  }
});
