import {
  ISource,
  IAnimeInfo,
  ISearch,
  IAnimeResult,
} from '@consumet/extensions';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';

export class AnimekaiFetchService extends Client {
  constructor() {
    super(UrlConfig.ANIMEKAI);
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    // return await animekai.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
    const { data, error } = await this.client.get<ISource>(
      `watch/${episodeId}?dub=${dub}`,
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
    // return await animekai.fetchAnimeInfo(id);
    const { data, error } = await this.client.get<IAnimeInfo>(`info?id=${id}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async search(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await animekai.search(q)).results;
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

export const animekaiFetch = new AnimekaiFetchService();
