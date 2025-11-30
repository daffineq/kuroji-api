import env from 'src/config/env';
import { AnimepaheInfo, CrysolineWrapper, Search, Source } from 'src/core/types';
import { Client } from 'src/helpers/client';
import { AnimepaheSearchMetadata } from '../types';
import { KurojiClient } from 'src/lib/http';

const client = new KurojiClient(`${env.CRYSOLINE}/api/anime/animepahe`);

const getSources = async (id: string, epId: string): Promise<Source> => {
  const { data, error } = await client.get<CrysolineWrapper<Source>>(`sources/${id}/${epId}`, {
    headers: {
      'x-api-key': env.CRYSOLINE_API_KEY
    }
  });

  if (error) {
    throw error;
  }

  if (!data?.data) {
    throw new Error(`AnimepaheFetch.getSources: No data found`);
  }

  return data.data;
};

const fetchInfo = async (id: string): Promise<AnimepaheInfo> => {
  const { data, error } = await client.get<CrysolineWrapper<AnimepaheInfo>>(`info/${id}`, {
    headers: {
      'x-api-key': env.CRYSOLINE_API_KEY
    }
  });

  if (error) {
    throw error;
  }

  if (!data?.data) {
    throw new Error(`AnimepaheFetch.fetchInfo: No data found`);
  }

  return data.data;
};

const search = async (q: string): Promise<Array<Search<AnimepaheSearchMetadata>>> => {
  const { data, error } = await client.get<CrysolineWrapper<Array<Search<AnimepaheSearchMetadata>>>>(
    `search?q=${q}`,
    {
      headers: {
        'x-api-key': env.CRYSOLINE_API_KEY
      }
    }
  );

  if (error) {
    throw error;
  }

  if (!data?.data) {
    throw new Error(`AnimepaheFetch.search: No data found`);
  }

  return data.data;
};

const AnimepaheFetch = {
  getSources,
  fetchInfo,
  search
};

export { AnimepaheFetch };
