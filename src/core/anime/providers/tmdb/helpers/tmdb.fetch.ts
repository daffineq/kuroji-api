import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { SeasonTmdb, TmdbImage, TmdbInfoResult, TmdbSearchResult } from '../types';
import { Prisma } from '@prisma/client';

class TmdbFetch extends Client {
  constructor() {
    super(env.TMDB);
  }

  async fetchSeries(id: number): Promise<TmdbInfoResult> {
    const { data, error } = await this.client.get<TmdbInfoResult>(`tv/${id}?api_key=${env.TMDB_AP_KEY}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchSeason(id: number, season: number): Promise<SeasonTmdb> {
    const { data, error } = await this.client.get<SeasonTmdb>(
      `tv/${id}/season/${season}?api_key=${env.TMDB_AP_KEY}`
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchMovie(id: number): Promise<TmdbInfoResult> {
    const { data, error } = await this.client.get<TmdbInfoResult>(`movie/${id}?api_key=${env.TMDB_AP_KEY}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async searchSeries(q: string): Promise<Array<TmdbSearchResult>> {
    const { data, error } = await this.client.get<Array<TmdbSearchResult>>(
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
  }

  async searchMovie(q: string): Promise<Array<TmdbSearchResult>> {
    const { data, error } = await this.client.get<Array<TmdbSearchResult>>(
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
  }

  async getMovieImages(id: number): Promise<TmdbImage[]> {
    const { data, error } = await this.client.get<{
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
  }

  async getSeriesImages(id: number): Promise<TmdbImage[]> {
    const { data, error } = await this.client.get<{
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
  }
}

const tmdbFetch = new TmdbFetch();

export default tmdbFetch;
