import {
  ISource,
  IAnimeInfo,
  ISearch,
  IAnimeResult,
} from '@consumet/extensions';
import {
  convertZoroSource,
  ZoroServer,
  ZoroStreamResults,
} from '../types/types.js';
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

    const type = dub ? 'dub' : 'sub';

    const { data: serversData, error: serversError } = await this.client.get<{
      success: boolean;
      results: ZoroServer[];
    }>(`${UrlConfig.HIANIME}servers/${convertId(episodeId)}`);

    if (serversError) throw serversError;
    if (!serversData?.results?.length) throw new Error('No servers found');

    const server = serversData.results.find((s) => s.type === type);
    if (!server) throw new Error(`No server found for type: ${type}`);

    const { data: streamData, error: streamError } = await this.client.get<{
      success: boolean;
      results: ZoroStreamResults;
    }>(
      `${UrlConfig.HIANIME}stream?id=${convertId(episodeId)}&server=${server.serverName}&type=${type}`,
    );
    if (streamError) throw streamError;
    if (!streamData?.results?.streamingLink) {
      throw new Error('No streaming link found');
    }

    const streamingLink = streamData.results.streamingLink;
    return convertZoroSource({
      headers: {},
      tracks: streamingLink.tracks
        ?.filter((t) => !!t.label)
        .map((t) => ({
          url: t.file,
          lang: t.label || '',
        })),
      intro: streamingLink.intro,
      outro: streamingLink.outro,
      sources: [
        {
          url: streamingLink.link.file,
          isM3U8: streamingLink.link.type === 'hls',
          type: streamingLink.link.type,
        },
      ],
    });
  }

  async fetchInfo(id: string): Promise<IAnimeInfo> {
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

  async search(q: string): Promise<ISearch<IAnimeResult>> {
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
