import { UrlConfig } from '../../../../../configs/url.config.js';
import AnilistQL from '../../graphql/AnilistQL.js';
import AnilistQueryBuilder from '../../graphql/query/AnilistQueryBuilder.js';
import { MediaType } from '../../filter/Filter.js';
import {
  Jikan,
  MoreInfoResponse,
  VideosResponse,
} from '../../../../../configs/jikan.config.js';
import { AnilistResponse } from '../../types/types.js';
import { Client } from '../../../../model/client.js';

export class AnilistFetchService extends Client {
  constructor() {
    super(UrlConfig.ANILIST_GRAPHQL);
  }

  async fetchAnilistFromGraphQL(
    id: number,
    isMal: boolean = false,
  ): Promise<AnilistResponse> {
    const queryBuilder = new AnilistQueryBuilder();

    if (isMal) {
      queryBuilder.setIdMal(id).setPerPage(1);
    } else {
      queryBuilder.setId(id).setPerPage(1);
    }

    queryBuilder.setType(MediaType.ANIME);

    const query = AnilistQL.getQuery(queryBuilder);
    const variables = queryBuilder.build();

    const { data, error } = await this.client.post<AnilistResponse>(
      `${this.baseUrl}`,
      {
        json: {
          query,
          variables,
        },
        jsonPath: 'data',
      },
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchMoreInfo(id: number): Promise<MoreInfoResponse> {
    const { data, error } = await this.client.get<MoreInfoResponse>(
      Jikan.getMoreInfo(id),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchVideos(id: number): Promise<VideosResponse> {
    const { data, error } = await this.client.get<VideosResponse>(
      Jikan.getVideos(id),
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

export const anilistFetch = new AnilistFetchService();
