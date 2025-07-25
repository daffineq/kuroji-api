import {
  ISource,
  IAnimeInfo,
  ISearch,
  IAnimeResult,
} from '@consumet/extensions';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';

export class AnimepaheFetchService extends Client {
  constructor() {
    super(UrlConfig.ANIMEPAHE);
  }

  async getSources(episodeId: string): Promise<ISource> {
    // return await animepahe.fetchEpisodeSources(episodeId);
    const { data, error } = await this.client.get<ISource>(
      `watch?episodeId=${episodeId}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    data.sources = data.sources.map((s) => ({
      ...s,
      url: s.isM3U8 ? `${UrlConfig.PROXY_URL}${s.url}` : s.url,
    }));

    return data;
  }

  async fetchInfo(id: string): Promise<IAnimeInfo> {
    // return await animepahe.fetchAnimeInfo(id);
    const { data, error } = await this.client.get<IAnimeInfo>(`info/${id}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async search(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await animepahe.search(q)).results;
    const { data, error } = await this.client.get<ISearch<IAnimeResult>>(q);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}

export const animepaheFetch = new AnimepaheFetchService();
