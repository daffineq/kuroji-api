import {
  ISource,
  IAnimeInfo,
  ISearch,
  IAnimeResult,
} from '@consumet/extensions';
import { ZoroSource, convertZoroSource } from '../types/types.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';

function convertId(slug: string): string {
  return slug.replace(/\$episode\$/, '?ep=');
}

export class ZoroFetchService extends Client {
  constructor() {
    super();
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    // return await zoro.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
    // const { data, error } = await this.client.get<ISource>(
    //   `watch/${episodeId}?dub=${dub}`,
    // );

    const category = dub ? 'dub' : 'sub';

    const { data, error } = await this.client.get<ZoroSource>(
      `${UrlConfig.HIANIME}episode/sources?animeEpisodeId=${convertId(episodeId)}&category=${category}`,
      {
        jsonPath: 'data',
      },
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return convertZoroSource(data);
  }

  async fetchZoro(id: string): Promise<IAnimeInfo> {
    // return await zoro.fetchAnimeInfo(id);
    const { data, error } = await this.client.get<IAnimeInfo>(
      `${UrlConfig.ZORO}info?id=${id}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async searchZoro(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await zoro.search(q)).results;
    const { data, error } = await this.client.get<ISearch<IAnimeResult>>(
      `${UrlConfig.ZORO}${q}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}

export const zoroFetch = new ZoroFetchService();
