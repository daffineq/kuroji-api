import { Config } from 'src/config/config';
import { SeasonTmdb, TmdbImage, TmdbInfoResult, TmdbSearchResult, TmdbTranslation } from '../types';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';

class TmdbFetchModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.tmdb);

  async fetchSeries(id: number): Promise<TmdbInfoResult> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbInfoResult>(`tv/${id}?api_key=${Config.tmdb_api_key}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchSeason(id: number, season: number): Promise<SeasonTmdb> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<SeasonTmdb>(
      `tv/${id}/season/${season}?api_key=${Config.tmdb_api_key}`
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchMovie(id: number): Promise<TmdbInfoResult> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbInfoResult>(`movie/${id}?api_key=${Config.tmdb_api_key}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async searchSeries(q: string): Promise<Array<TmdbSearchResult>> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<Array<TmdbSearchResult>>(
      `search/tv?api_key=${Config.tmdb_api_key}&query=${q}`,
      {
        jsonPath: 'results'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async searchMovie(q: string): Promise<Array<TmdbSearchResult>> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<Array<TmdbSearchResult>>(
      `search/movie?api_key=${Config.tmdb_api_key}&query=${q}`,
      {
        jsonPath: 'results'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async getMovieImages(id: number): Promise<TmdbImage[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<{
      backdrops: TmdbImage[];
      logos: TmdbImage[];
      posters: TmdbImage[];
    }>(`movie/${id}/images?api_key=${Config.tmdb_api_key}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    data.backdrops.forEach((b) => (b.type = 'backdrop'));
    data.logos.forEach((b) => (b.type = 'logo'));
    data.posters.forEach((b) => (b.type = 'poster'));

    return [...data.backdrops, ...data.logos, ...data.posters];
  }

  async getSeriesImages(id: number): Promise<TmdbImage[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<{
      backdrops: TmdbImage[];
      logos: TmdbImage[];
      posters: TmdbImage[];
    }>(`tv/${id}/images?api_key=${Config.tmdb_api_key}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    data.backdrops.forEach((b) => (b.type = 'backdrop'));
    data.logos.forEach((b) => (b.type = 'logo'));
    data.posters.forEach((b) => (b.type = 'poster'));

    return [...data.backdrops, ...data.logos, ...data.posters];
  }

  async fetchEpisodeImages(id: number, season: number, episode: number): Promise<TmdbImage[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbImage[]>(
      `tv/${id}/season/${season}/episode/${episode}/images?api_key=${Config.tmdb_api_key}`,
      {
        jsonPath: 'stills'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchMovieTranslations(id: number): Promise<TmdbTranslation[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbTranslation[]>(
      `movie/${id}/translations?api_key=${Config.tmdb_api_key}`,
      {
        jsonPath: 'translations'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchSeriesTranslations(id: number): Promise<TmdbTranslation[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbTranslation[]>(
      `tv/${id}/translations?api_key=${Config.tmdb_api_key}`,
      {
        jsonPath: 'translations'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchSeasonTranslations(id: number, season: number): Promise<TmdbTranslation[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbTranslation[]>(
      `tv/${id}/season/${season}/translations?api_key=${Config.tmdb_api_key}`,
      {
        jsonPath: 'translations'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }

  async fetchEpisodeTranslations(id: number, season: number, episode: number): Promise<TmdbTranslation[]> {
    if (!Config.has_tmdb_api_key) {
      throw new Error('No tmdb api key provided');
    }

    const { data, error } = await this.client.get<TmdbTranslation[]>(
      `tv/${id}/season/${season}/episode/${episode}/translations?api_key=${Config.tmdb_api_key}`,
      {
        jsonPath: 'translations'
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    return data;
  }
}

const TmdbFetch = new TmdbFetchModule();

export { TmdbFetch, TmdbFetchModule };
