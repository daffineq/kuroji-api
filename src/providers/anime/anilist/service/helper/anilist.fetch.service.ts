import { Injectable } from '@nestjs/common';
import { UrlConfig } from '../../../../../configs/url.config';
import AnilistQL from '../../graphql/AnilistQL';
import AnilistQueryBuilder from '../../graphql/query/AnilistQueryBuilder';
import { MediaType } from '../../filter/Filter';
import {
  Jikan,
  MoreInfoResponse,
  VideosResponse,
} from '../../../../../configs/jikan.config';
import { AnilistResponse } from '../../types/types';
import { Client } from '../../../../model/client';

@Injectable()
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

    const { data } = await this.client.post<AnilistResponse>(
      `${this.baseUrl}`,
      {
        json: {
          query,
          variables,
        },
        jsonPath: 'data',
      },
    );

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchMoreInfo(id: number): Promise<MoreInfoResponse> {
    const { data } = await this.client.get<MoreInfoResponse>(
      Jikan.getMoreInfo(id),
    );

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchVideos(id: number): Promise<VideosResponse> {
    const { data } = await this.client.get<VideosResponse>(Jikan.getVideos(id));

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }
}
