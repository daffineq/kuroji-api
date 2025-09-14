import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { ANILIST_INFO } from '../graphql';
import { AnilistMedia, AnilistMediaResponse } from '../types';

class AnilistFetch extends Client {
  constructor() {
    super(env.ANILIST);
  }

  async fetchInfo(id: number): Promise<AnilistMedia> {
    const { data, error } = await this.client.post<AnilistMediaResponse>(``, {
      json: {
        query: ANILIST_INFO,
        variables: {
          id
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data?.data.Media) {
      throw new Error(`AnilistFetch.fetchInfo: No data found`);
    }

    return data?.data.Media;
  }
}

export default new AnilistFetch();
