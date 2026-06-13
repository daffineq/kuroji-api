import { Config } from 'src/config';
import { ANILIST_MEDIA_DETAILS } from '../graphql';
import { AnilistMedia, AnilistMediaResponse } from '../types';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';
import { graphql } from 'src/helpers/graphql';

class AnilistFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.anilist);

  async fetchInfo(id: number): Promise<AnilistMedia> {
    const { data, error } = await this.client.post<AnilistMediaResponse>(``, {
      body: JSON.stringify({
        query: graphql`
          query ($id: Int) {
            Media(id: $id) {
              ...mediaDetails
            }
          }
          ${ANILIST_MEDIA_DETAILS}
        `,
        variables: {
          id
        }
      })
    });

    if (error) {
      throw error;
    }

    if (!data?.data.Media) {
      throw new Error(`AnilistFetch.fetchInfo: No data found`);
    }

    return data?.data.Media;
  }

  async fetchInfoBulk(
    page: number,
    perPage: number,
    options: { status?: string; threshold?: number; threshold_lesser?: number; type?: string } = {}
  ): Promise<{
    media: AnilistMedia[];
    pageInfo: { hasNextPage: boolean };
  }> {
    const {
      status,
      threshold = Config.anime_popularity_threshold,
      threshold_lesser = undefined,
      type = Config.fetch_type
    } = options;

    const { data, error } = await this.client.post<{
      media: AnilistMedia[];
      pageInfo: { hasNextPage: boolean };
    }>(``, {
      body: JSON.stringify({
        query: graphql`
          query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(sort: [POPULARITY_DESC] ${type ? `, type: ${type}` : ''} popularity_greater: ${threshold} ${threshold_lesser ? `, popularity_lesser: ${threshold_lesser}` : ''} ${status ? `, status: ${status}` : ''}) {
                ...mediaDetails
              }
            }
          }
          ${ANILIST_MEDIA_DETAILS}
        `,
        variables: {
          page,
          perPage
        }
      }),
      jsonPath: 'data.Page'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`AnilistFetch.fetchInfoBulk: No data found`);
    }

    return data;
  }

  async fetchInfoBulkIds(ids: number[]): Promise<{
    media: AnilistMedia[];
    pageInfo: { hasNextPage: boolean };
  }> {
    const { data, error } = await this.client.post<{
      media: AnilistMedia[];
      pageInfo: { hasNextPage: boolean };
    }>(``, {
      body: JSON.stringify({
        query: graphql`
          query ($page: Int, $perPage: Int, $idIn: [Int]) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(id_in: $idIn) {
                ...mediaDetails
              }
            }
          }
          ${ANILIST_MEDIA_DETAILS}
        `,
        variables: {
          page: 1,
          perPage: 50,
          idIn: ids
        }
      }),
      jsonPath: 'data.Page'
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`AnilistFetch.fetchInfoBulkIds: No data found`);
    }

    return data;
  }

  async fetchIds(
    page: number,
    perPage: number,
    options: { type?: string; status?: string; threshold?: number } = {}
  ): Promise<{
    media: { id: number }[];
    pageInfo: { hasNextPage: boolean };
  }> {
    const { type = Config.fetch_type, status, threshold = Config.anime_popularity_threshold } = options;

    const { data, error } = await this.client.post<{
      media: { id: number }[];
      pageInfo: { hasNextPage: boolean };
    }>(``, {
      body: JSON.stringify({
        query: graphql`
          query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(sort: [POPULARITY_DESC], popularity_greater: ${threshold} ${type ? `, type: ${type}` : ''} ${status ? `, status: ${status}` : ''}) {
                id
                type
              }
            }
          }
        `,
        variables: {
          page,
          perPage
        }
      }),
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
}

const AnilistFetch = new AnilistFetchModule();

export { AnilistFetch, AnilistFetchModule };
