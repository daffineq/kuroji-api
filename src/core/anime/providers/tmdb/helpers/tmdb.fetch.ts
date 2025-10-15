import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { SeasonTmdb, TmdbInfoResult, TmdbSearchResult } from '../types';
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
}

const tmdbFetch = new TmdbFetch();

export default tmdbFetch;
