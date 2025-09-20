import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import tvdbToken from './tvdb.token';
import { TvdbInfoResult, TvdbSearchResult } from '../types';

class TvdbFetch extends Client {
  constructor() {
    super(env.TVDB);
  }

  async fetchSeries(id: string): Promise<TvdbInfoResult> {
    const token = await tvdbToken.getToken();

    const { data, error } = await this.client.get<TvdbInfoResult>(`series/${id}/extended`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      jsonPath: 'data'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data found');
    }

    return data;
  }

  async fetchMovie(id: string): Promise<TvdbInfoResult> {
    const token = await tvdbToken.getToken();

    const { data, error } = await this.client.get<TvdbInfoResult>(`movies/${id}/extended`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      jsonPath: 'data'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data found');
    }

    return data;
  }

  async searchByRemote(id: string, type: 'movie' | 'series', title: string): Promise<TvdbSearchResult> {
    const token = await tvdbToken.getToken();

    const { data, error } = await this.client.get<TvdbSearchResult[]>(
      `search?query=${encodeURIComponent(title)}&type=${type}&remote_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        jsonPath: 'data'
      }
    );

    if (error) {
      throw error;
    }

    if (!data?.[0]) {
      throw new Error('No data found');
    }

    return data[0];
  }
}

export default new TvdbFetch();
