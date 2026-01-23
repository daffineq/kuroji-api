import { Config } from 'src/config/config';
import { TvdbInfoResult, TvdbSearchResult } from '../types';
import { KurojiClient } from 'src/lib/http';
import { TvdbToken } from './tvdb.token';
import { ClientModule } from 'src/helpers/client';

class TvdbFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.tvdb);

  async fetchSeries(id: string): Promise<TvdbInfoResult> {
    const token = await TvdbToken.getToken();

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
    const token = await TvdbToken.getToken();

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
    const token = await TvdbToken.getToken();

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

const TvdbFetch = new TvdbFetchModule();

export { TvdbFetch, TvdbFetchModule };
