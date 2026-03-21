import { Image } from '@crysoline/lib/dist/core/types';
import { EpisodeProvider, TmdbEpisode, TmdbUtils } from '../anime';
import { NatMap } from 'ioredis';

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
  country?: string;
  is_licensed?: boolean;
  is_adult?: boolean;
  genres?: string;
  genres_in?: string[];
  genres_not_in?: string[];
  tags?: string;
  tags_in?: string[];
  tags_not_in?: string[];
  minimum_tag_rank?: number;
  studios?: string;
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

export interface SourceArgs {
  source?: string;
}

export interface ChronologyArgs extends AnimeArgs {
  parent_id: number;
}

export interface RecommendationArgs extends AnimeArgs {
  parent_id: number;
}

export interface CharacterArgs {
  page?: number;
  per_page?: number;
  parent_id: number;
}

export interface EpisodeArgs {
  id: number;
  number: number;
}

export interface ArtworksArgs extends SourceArgs {
  iso_639_1?: string;
}

export interface SourcesArgs {
  id: number;
  ep_id: string;
}

export interface LinkArgs {
  type?: string;
}

export interface MergedEpisode {
  number: number;
  title: string | null;
  overview: string | null;
  image: Image | string | null;
  runtime: number | null;
  air_date: string | null;
  is_filler?: boolean | false;
  providers?: EpisodeProvider[];
}

export const formatEpisodeData = (episode: {
  title: string | null;
  air_date: string | null;
  overview: string | null;
  number: number;
  runtime: number | null;
  image: {
    small: string | null;
    medium: string | null;
    large: string | null;
  } | null;
}): MergedEpisode => ({
  title: episode.title,
  air_date: episode.air_date,
  overview: episode.overview,
  number: episode.number,
  runtime: episode.runtime,
  image: {
    aspectRatio: 1,
    small: episode.image?.small ?? '',
    medium: episode.image?.medium ?? '',
    large: episode.image?.large ?? ''
  }
});
