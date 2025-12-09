import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { SeasonTmdb, TmdbImage, TmdbInfoResult, TmdbSearchResult, TmdbTranslation } from '../types';
import { KurojiClient } from 'src/lib/http';

const client = new KurojiClient(env.TMDB);

const fetchSeries = async (id: number): Promise<TmdbInfoResult> => {
  const { data, error } = await client.get<TmdbInfoResult>(`tv/${id}?api_key=${env.TMDB_AP_KEY}`);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const fetchSeason = async (id: number, season: number): Promise<SeasonTmdb> => {
  const { data, error } = await client.get<SeasonTmdb>(`tv/${id}/season/${season}?api_key=${env.TMDB_AP_KEY}`);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const fetchMovie = async (id: number): Promise<TmdbInfoResult> => {
  const { data, error } = await client.get<TmdbInfoResult>(`movie/${id}?api_key=${env.TMDB_AP_KEY}`);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const searchSeries = async (q: string): Promise<Array<TmdbSearchResult>> => {
  const { data, error } = await client.get<Array<TmdbSearchResult>>(
    `search/tv?api_key=${env.TMDB_AP_KEY}&query=${q}`,
    {
      jsonPath: 'results'
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const searchMovie = async (q: string): Promise<Array<TmdbSearchResult>> => {
  const { data, error } = await client.get<Array<TmdbSearchResult>>(
    `search/movie?api_key=${env.TMDB_AP_KEY}&query=${q}`,
    {
      jsonPath: 'results'
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const getMovieImages = async (id: number): Promise<TmdbImage[]> => {
  const { data, error } = await client.get<{
    backdrops: TmdbImage[];
    logos: TmdbImage[];
    posters: TmdbImage[];
  }>(`movie/${id}/images?api_key=${env.TMDB_AP_KEY}`);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  data.backdrops.forEach((b) => (b.type = 'backdrop'));
  data.logos.forEach((b) => (b.type = 'logo'));
  data.posters.forEach((b) => (b.type = 'poster'));

  return [...data.backdrops, ...data.logos, ...data.posters];
};

const getSeriesImages = async (id: number): Promise<TmdbImage[]> => {
  const { data, error } = await client.get<{
    backdrops: TmdbImage[];
    logos: TmdbImage[];
    posters: TmdbImage[];
  }>(`tv/${id}/images?api_key=${env.TMDB_AP_KEY}`);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  data.backdrops.forEach((b) => (b.type = 'backdrop'));
  data.logos.forEach((b) => (b.type = 'logo'));
  data.posters.forEach((b) => (b.type = 'poster'));

  return [...data.backdrops, ...data.logos, ...data.posters];
};

const fetchEpisodeImages = async (id: number, season: number, episode: number): Promise<TmdbImage[]> => {
  const { data, error } = await client.get<TmdbImage[]>(
    `tv/${id}/season/${season}/episode/${episode}/images?api_key=${env.TMDB_AP_KEY}`,
    {
      jsonPath: 'stills'
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const fetchMovieTranslations = async (id: number): Promise<TmdbTranslation[]> => {
  const { data, error } = await client.get<TmdbTranslation[]>(
    `movie/${id}/translations?api_key=${env.TMDB_AP_KEY}`,
    {
      jsonPath: 'translations'
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const fetchSeriesTranslations = async (id: number): Promise<TmdbTranslation[]> => {
  const { data, error } = await client.get<TmdbTranslation[]>(`tv/${id}/translations?api_key=${env.TMDB_AP_KEY}`, {
    jsonPath: 'translations'
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const fetchSeasonTranslations = async (id: number, season: number): Promise<TmdbTranslation[]> => {
  const { data, error } = await client.get<TmdbTranslation[]>(
    `tv/${id}/season/${season}/translations?api_key=${env.TMDB_AP_KEY}`,
    {
      jsonPath: 'translations'
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const fetchEpisodeTranslations = async (
  id: number,
  season: number,
  episode: number
): Promise<TmdbTranslation[]> => {
  const { data, error } = await client.get<TmdbTranslation[]>(
    `tv/${id}/season/${season}/episode/${episode}/translations?api_key=${env.TMDB_AP_KEY}`,
    {
      jsonPath: 'translations'
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data');
  }

  return data;
};

const TmdbFetch = {
  fetchMovie,
  fetchSeries,
  fetchSeason,
  searchMovie,
  searchSeries,
  getMovieImages,
  getSeriesImages,
  fetchEpisodeImages,
  fetchMovieTranslations,
  fetchSeriesTranslations,
  fetchSeasonTranslations,
  fetchEpisodeTranslations
};

export { TmdbFetch };
