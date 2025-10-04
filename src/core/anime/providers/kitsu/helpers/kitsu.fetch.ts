import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { KitsuAnime } from '../types';

class KitsuFetch extends Client {
  constructor() {
    super(env.KITSU);
  }

  async fetchInfo(id: string): Promise<KitsuAnime> {
    const { data, error } = await this.client.get<KitsuAnime>(`anime/${id}`, {
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
  }

  async search(q: string): Promise<Array<KitsuAnime>> {
    const { data, error } = await this.client.get<Array<KitsuAnime>>(`anime?filter[text]=${q}`, {
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
  }
}

export default new KitsuFetch();
