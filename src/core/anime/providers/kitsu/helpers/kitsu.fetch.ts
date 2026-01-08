import { Config } from 'src/config/config';
import { KitsuAnime } from '../types';
import { KurojiClient } from 'src/lib/http';
import logger from 'src/helpers/logger';
import { ClientModule } from 'src/helpers/client';

class KitsuFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.kitsu);

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
      logger.error(error);
      throw error;
    }

    if (!data) {
      throw new Error('No data found');
    }

    return data;
  }
}

const KitsuFetch = new KitsuFetchModule();

export { KitsuFetch, KitsuFetchModule };
