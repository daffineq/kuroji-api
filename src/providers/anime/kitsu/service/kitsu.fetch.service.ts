import { KITSU } from '../../../../configs/kitsu.config.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';
import { KitsuAnime } from '../types/types.js';

export class KitsuFetchService extends Client {
  constructor() {
    super(UrlConfig.KITSU);
  }

  async searchKitsu(query: string): Promise<KitsuAnime[]> {
    const { data, error } = await this.client.get<KitsuAnime[]>(
      KITSU.searchKitsu(query),
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

  async fetchKitsu(id: string): Promise<KitsuAnime> {
    const { data, error } = await this.client.get<KitsuAnime>(
      KITSU.getKitsu(id),
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

export const kitsuFetch = new KitsuFetchService();
