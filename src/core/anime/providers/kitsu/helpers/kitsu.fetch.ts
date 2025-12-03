import env from 'src/config/env';
import { KitsuAnime } from '../types';
import { KurojiClient } from 'src/lib/http';
import logger from 'src/helpers/logger';

const client = new KurojiClient(env.KITSU);

const fetchInfo = async (id: string): Promise<KitsuAnime> => {
  const { data, error } = await client.get<KitsuAnime>(`anime/${id}`, {
    jsonPath: 'data',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    }
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data found');
  }

  return data;
};

const search = async (q: string): Promise<Array<KitsuAnime>> => {
  const { data, error } = await client.get<Array<KitsuAnime>>(`anime?filter[text]=${q}`, {
    jsonPath: 'data',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    }
  });

  if (error) {
    logger.error(error);
    throw error;
  }

  if (!data) {
    throw new Error('No data found');
  }

  return data;
};

const KitsuFetch = {
  fetchInfo,
  search
};

export { KitsuFetch };
