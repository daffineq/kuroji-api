import { TvdbLanguageTranslation, TvdbLanguage } from '@prisma/client';
import { BasicTvdb, TvdbInput } from '../types/types.js';
import { Injectable } from '@nestjs/common';
import { TvdbTokenService } from './token/tvdb.token.service.js';
import { Client } from '../../../model/client.js';
import { TVDB } from '../../../../configs/tvdb.config.js';
import { UrlConfig } from '../../../../configs/url.config.js';

@Injectable()
export class TvdbFetchService extends Client {
  constructor(private readonly tokenService: TvdbTokenService) {
    super(UrlConfig.TVDB);
  }

  async searchByRemoteId(
    id: number,
    type: string,
    title: string,
  ): Promise<BasicTvdb> {
    const { data, error } = await this.client.get<BasicTvdb[]>(
      TVDB.search(title, id),
      {
        headers: {
          Authorization: `Bearer ${await this.tokenService.getToken()}`,
        },
        jsonPath: 'data',
      },
    );

    console.log(TVDB.search(title, id));

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data found');
    }

    const match = data[0];
    if (!match) throw new Error('Not found');

    return match;
  }

  async fetchInfo(id: number, type: string): Promise<TvdbInput> {
    const url = type === 'movie' ? TVDB.getMovie(id) : TVDB.getSeries(id);
    const { data, error } = await this.client.get<TvdbInput>(url, {
      headers: {
        Authorization: `Bearer ${await this.tokenService.getToken()}`,
      },
      jsonPath: 'data',
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchTranslations(
    id: number,
    type: string,
    lang: string,
  ): Promise<TvdbLanguageTranslation> {
    const url =
      type === 'movie'
        ? TVDB.getMovieTranslations(id, lang)
        : TVDB.getSeriesTranslations(id, lang);

    const { data, error } = await this.client.get<TvdbLanguageTranslation>(
      url,
      {
        headers: {
          Authorization: `Bearer ${await this.tokenService.getToken()}`,
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

  async fetchLanguages(): Promise<TvdbLanguage[]> {
    const { data, error } = await this.client.get<TvdbLanguage[]>(
      TVDB.getLanguages(),
      {
        headers: {
          Authorization: `Bearer ${await this.tokenService.getToken()}`,
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
}
