import { Config } from 'src/config/config';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';
import { AniZipData } from 'src/core/types';

class AnimeFetchModule extends ClientModule {
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

const AnimeFetch = new AnimeFetchModule();

export { AnimeFetch, AnimeFetchModule };
