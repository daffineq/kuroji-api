import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { ANILIST_INFO } from '../graphql';
import { AnilistMedia, AnilistMediaResponse } from '../types';

class AnilistFetch extends Client {
  constructor() {
    super(env.ANILIST);
  }

  async fetchInfo(id: number): Promise<AnilistMedia> {
    const { data, error } = await this.client.post<AnilistMediaResponse>(``, {
      json: {
        query: ANILIST_INFO,
        variables: {
          id
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data?.data.Media) {
      throw new Error(`AnilistFetch.fetchInfo: No data found`);
    }

    return data?.data.Media;
  }

  async fetchIds(
    page: number,
    perPage: number
  ): Promise<{
    media: { id: number }[];
    pageInfo: { hasNextPage: boolean };
  }> {
    const { data, error } = await this.client.post<{
      media: { id: number }[];
      pageInfo: { hasNextPage: boolean };
    }>(``, {
      json: {
        query: `
          query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(type: ANIME) {
                id
              }
            }
          }
        `,
        variables: {
          page,
          perPage
        }
      },
      jsonPath: 'data.Page'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`AnilistFetch.fetchIds: No data found`);
    }

    return data;
  }

  async getTotal(): Promise<number> {
    const { data, error } = await this.client.post<{
      media: { id: number }[];
      pageInfo: { lastPage: number };
    }>(``, {
      json: {
        query: `
          query {
            Page(page: 1, perPage: 1) {
              pageInfo {
                lastPage
              },
              media(type: ANIME) {
                id
              }
            }
          }
        `
      },
      jsonPath: 'data.Page'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`AnilistFetch.getTotal: No data found`);
    }

    return data.pageInfo.lastPage;
  }
}

const anilistFetch = new AnilistFetch();

export default anilistFetch;
