import env from 'src/config/env';
import { ShikimoriAnime } from '../types';
import { SHIKIMORI_INFO } from '../graphql';
import { KurojiClient } from 'src/lib/http';

const client = new KurojiClient(`${env.SHIKIMORI}/api/graphql`);

const fetchInfo = async (id: string): Promise<ShikimoriAnime> => {
  const { data, error } = await client.post<ShikimoriAnime[]>(``, {
    json: {
      query: SHIKIMORI_INFO,
      variables: { ids: id }
    },
    jsonPath: 'data.animes'
  });

  if (error) {
    throw error;
  }

  if (!data?.[0]) {
    throw new Error(`Anime not found`);
  }

  return data[0];
};

const ShikimoriFetch = {
  fetchInfo
};

export { ShikimoriFetch };
