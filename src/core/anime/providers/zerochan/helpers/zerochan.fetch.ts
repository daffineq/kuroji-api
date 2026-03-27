import { Config } from 'src/config/config';
import { ClientModule } from 'src/helpers/client';
import { KurojiClient } from 'src/lib/http';
import { ZerochanArtwork, ZerochanSuggestion } from '../types';
import { ZerochanLogin } from './zerochan.login';

class ZerochanFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.zerochan);

  async searchImages(q: string) {
    const login = await ZerochanLogin.getLogin();

    const { data, error } = await this.client.get<ZerochanArtwork[]>(
      `/${encodeURIComponent(q)}?s=fav&json&l=250`,
      {
        headers: {
          Cookie: `xbotcheck=${login.xbotcheck}; z_id=${login.z_id}; z_hash=${login.z_hash}`,
          'User-Agent': `Kuroji - ${Config.zerochan_user}`
        },
        jsonPath: 'items'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`ZerochanFetch.searchImages: No data found`);
    }

    return data;
  }

  async fetchSuggestions(q: string) {
    const login = await ZerochanLogin.getLogin();

    const { data, error } = await this.client.get<ZerochanSuggestion[]>(`/suggest?q=${q}&json`, {
      headers: {
        Cookie: `xbotcheck=${login.xbotcheck}; z_id=${login.z_id}; z_hash=${login.z_hash}`,
        'User-Agent': `Kuroji - ${Config.zerochan_user}`
      },
      jsonPath: 'suggestions'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`ZerochanFetch.fetchSuggestions: No data found`);
    }

    return data;
  }
}

const ZerochanFetch = new ZerochanFetchModule();

export { ZerochanFetch, ZerochanFetchModule };
