import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';
import { ShikimoriGraphQL } from '../graphql/shikimori.graphql.js';
import { ShikimoriResponse } from '../types/types.js';

export class ShikimoriFetchService extends Client {
  constructor() {
    super(UrlConfig.SHIKIMORI_GRAPHQL);
  }

  async fetchFromGraphQL(
    id: string,
    page = 1,
    perPage = 1,
  ): Promise<ShikimoriResponse> {
    const query = ShikimoriGraphQL.getShikimoriAnime(id, page, perPage);
    const { data, error } = await this.client.post<ShikimoriResponse>(``, {
      json: {
        query,
      },
      jsonPath: 'data',
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}

export const shikimoriFetch = new ShikimoriFetchService();
