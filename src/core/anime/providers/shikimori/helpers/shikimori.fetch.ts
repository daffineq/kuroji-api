import { Config } from 'src/config/config';
import { ShikimoriAnime } from '../types';
import { SHIKIMORI_INFO } from '../graphql';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';

class ShikimoriFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(`${Config.shikimori}/api/graphql`);

  async fetchInfo(id: string): Promise<ShikimoriAnime> {
    const { data, error } = await this.client.post<ShikimoriAnime[]>(``, {
      json: {
        query: SHIKIMORI_INFO,
        variables: { ids: id }
      },
      jsonPath: 'data.animes'
    });

    if (error) {
      throw error;
    }

    if (!data?.[0]) {
      throw new Error(`Anime not found`);
    }

    return data[0];
  }
}

const ShikimoriFetch = new ShikimoriFetchModule();

export { ShikimoriFetch, ShikimoriFetchModule };
