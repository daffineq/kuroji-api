import { Anilibria } from '@prisma/client';
import { ANILIBRIA } from '../../../../configs/anilibria.config.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';
import { BasicAnilibria } from '../types/types.js';

export class AnilibriaFetchService extends Client {
  constructor() {
    super(UrlConfig.ANILIBRIA);
  }

  async searchAnilibria(query: string, year: number, season: string) {
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

  async fetchAnilibria(id: number) {
    const { data, error } = await this.client.get<Anilibria[]>(
      ANILIBRIA.getAnime(id),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    const anilibria = data[0];

    if (!anilibria) {
      throw new Error('Data is null');
    }

    return anilibria;
  }
}

export const anilibriaFetch = new AnilibriaFetchService();
