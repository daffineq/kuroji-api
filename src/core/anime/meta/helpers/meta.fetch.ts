import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { AniZipData } from '../types';
import { KurojiClient } from 'src/lib/http';

const client = new KurojiClient(env.ANI_ZIP);

const fetchMappings = async (id: number): Promise<AniZipData> => {
  const { data, error } = await client.get<AniZipData>(`mappings?anilist_id=${id}`);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('MetaFetch.fetchMappings: No data found');
  }

  return data;
};

const MetaFetch = {
  fetchMappings
};

export { MetaFetch };
