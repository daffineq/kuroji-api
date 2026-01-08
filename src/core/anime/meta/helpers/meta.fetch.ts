import { Config } from 'src/config/config';
import { AniZipData } from '../types';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';

class MetaFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.ani_zip);

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

const MetaFetch = new MetaFetchModule();

export { MetaFetch, MetaFetchModule };
