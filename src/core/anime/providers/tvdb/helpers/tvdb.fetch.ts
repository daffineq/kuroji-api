import env from 'src/config/env';
import { TvdbInfoResult, TvdbSearchResult } from '../types';
import { KurojiClient } from 'src/lib/http';
import { TvdbToken } from './tvdb.token';

const client = new KurojiClient(env.TVDB);

const fetchSeries = async (id: string): Promise<TvdbInfoResult> => {
  const token = await TvdbToken.getToken();

  const { data, error } = await client.get<TvdbInfoResult>(`series/${id}/extended`, {
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
};

const fetchMovie = async (id: string): Promise<TvdbInfoResult> => {
  const token = await TvdbToken.getToken();

  const { data, error } = await client.get<TvdbInfoResult>(`movies/${id}/extended`, {
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
};

const searchByRemote = async (id: string, type: 'movie' | 'series', title: string): Promise<TvdbSearchResult> => {
  const token = await TvdbToken.getToken();

  const { data, error } = await client.get<TvdbSearchResult[]>(
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
};

const TvdbFetch = {
  fetchMovie,
  fetchSeries,
  searchByRemote
};

export { TvdbFetch };
