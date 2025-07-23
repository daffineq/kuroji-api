import { TMDB } from '../../../../configs/tmdb.config.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Client } from '../../../model/client.js';
import {
  BasicTmdb,
  TmdbDetailsMerged,
  TmdbSeasonEpisodeImagesWithRelations,
  TmdbSeasonWithRelations,
} from '../types/types.js';
import { filterSeasonEpisodes } from '../utils/tmdb-helper.js';

export class TmdbFetchService extends Client {
  constructor() {
    super(UrlConfig.TMDB);
  }

  async fetchInfo(id: number, type: string): Promise<TmdbDetailsMerged> {
    const url =
      type === 'tv' ? TMDB.getTvDetails(id) : TMDB.getMovieDetails(id);
    const { data, error } = await this.client.get<TmdbDetailsMerged>(url);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchSeasonInfo(
    id: number,
    seasonNumber: number,
  ): Promise<TmdbSeasonWithRelations> {
    const { data, error } = await this.client.get<TmdbSeasonWithRelations>(
      TMDB.getSeasonDetails(id, seasonNumber),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return filterSeasonEpisodes(data);
  }

  async search(query: string): Promise<BasicTmdb[]> {
    const { data, error } = await this.client.get<BasicTmdb[]>(
      TMDB.multiSearch(query),
      {
        jsonPath: 'results',
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

  async fetchEpisodeImages(
    tvId: number,
    seasonNumber: number,
    episode: number,
  ): Promise<TmdbSeasonEpisodeImagesWithRelations> {
    const { data, error } =
      await this.client.get<TmdbSeasonEpisodeImagesWithRelations>(
        TMDB.getEpisodeImages(tvId, seasonNumber, episode),
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

export const tmdbFetch = new TmdbFetchService();
