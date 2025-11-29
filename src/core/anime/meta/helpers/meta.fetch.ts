import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { AniZipData } from '../types';

class MetaFetch extends Client {
  constructor() {
    super(env.ANI_ZIP);
  }

  async fetchMappings(id: number): Promise<AniZipData> {
    const { data, error } = await this.client.get<AniZipData>(`mappings?anilist_id=${id}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('MetaFetch.fetchMappings: No data found');
    }

    return data;
  }
}

const metaFetch = new MetaFetch();

export default metaFetch;
