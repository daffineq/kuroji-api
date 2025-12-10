import env from 'src/config/env';
import { CrysolineWrapper, MALInfo } from 'src/core/types';
import { ClientModule } from 'src/helpers/client';
import { KurojiClient } from 'src/lib/http';

class MyAnimeListFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(`${env.CRYSOLINE}/api/anime/mal`);

  async fetchInfo(id: number): Promise<MALInfo> {
    const { data, error } = await this.client.get<CrysolineWrapper<MALInfo>>(`info/${id}`, {
      headers: {
        'x-api-key': env.CRYSOLINE_API_KEY
      }
    });

    if (error) {
      throw new Error(`Failed to fetch anime info: ${error.message}`);
    }

    if (!data?.data) {
      throw new Error(`Failed to fetch anime info: No data received`);
    }

    return data.data;
  }
}

const MyAnimeListFetch = new MyAnimeListFetchModule();

export { MyAnimeListFetch, MyAnimeListFetchModule };
