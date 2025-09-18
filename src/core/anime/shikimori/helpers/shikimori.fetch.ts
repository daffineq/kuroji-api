import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { ShikimoriAnime } from '../types';
import { SHIKIMORI_INFO } from '../graphql';

class ShikimoriFetch extends Client {
  constructor() {
    super(`${env.SHIKIMORI}/api/graphql`);
  }

  async fetchInfo(id: string): Promise<ShikimoriAnime> {
    const { data, error } = await this.client.post<ShikimoriAnime[]>(``, {
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
  }
}

export default new ShikimoriFetch();
