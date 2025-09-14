import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { ShikimoriAnime, ShikimoriAnimeResponse } from '../types';
import { SHIKIMORI_INFO } from '../graphql';

class ShikimoriFetch extends Client {
  constructor() {
    super(`${env.SHIKIMORI}/graphql`);
  }

  async getInfo(id: string): Promise<ShikimoriAnime> {
    const { data, error } = await this.client.post<ShikimoriAnimeResponse>(``, {
      json: {
        query: SHIKIMORI_INFO,
        variables: { id }
      },
      jsonPath: 'data'
    });

    if (error) {
      throw error;
    }

    if (!data?.animes[0]) {
      throw new Error(`Anime not found`);
    }

    return data.animes[0];
  }
}

export default new ShikimoriFetch();
