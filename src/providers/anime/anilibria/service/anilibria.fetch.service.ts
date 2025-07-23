import { ANILIBRIA } from '../../../../configs/anilibria.config.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';
import { AnilibriaEntry, BasicAnilibria } from '../types/types.js';

export class AnilibriaFetchService extends Client {
  constructor() {
    super(UrlConfig.ANILIBRIA);
  }

  async fetchInfo(id: number) {
    const { data, error } = await this.client.get<AnilibriaEntry>(
      ANILIBRIA.getAnime(id),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async search(query: string, year?: number | null, season?: string | null) {
    const { data, error } = await this.client.get<BasicAnilibria[]>(
      ANILIBRIA.search(query, year, season),
      {
        jsonPath: 'data',
      },
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}

export const anilibriaFetch = new AnilibriaFetchService();
