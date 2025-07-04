import { Injectable } from '@nestjs/common';
import {
  findBestTvdbMatchFromSearch,
  getTvdbInclude,
  TvdbHelper,
} from '../utils/tvdb-helper.js';
import { PrismaService } from '../../../../prisma.service.js';
import { TmdbService } from '../../tmdb/service/tmdb.service.js';
import { TvdbTokenService } from './token/tvdb.token.service.js';
import { TVDB } from '../../../../configs/tvdb.config.js';
import {
  TvdbArtwork,
  TvdbLanguage,
  TvdbLanguageTranslation,
} from '@prisma/client';
import {
  TvdbWithRelations,
  BasicTvdb,
  SearchResponse,
  TvdbInput,
} from '../types/types.js';
import { Client } from '../../../model/client.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import Config from '../../../../configs/config.js';
import { undefinedToNull } from '../../../../shared/interceptor.js';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import { deepCleanTitle } from '../../../mapper/mapper.helper.js';

@Injectable()
export class TvdbService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistService,
    private readonly tmdbService: TmdbService,
    private readonly tokenService: TvdbTokenService,
    private readonly helper: TvdbHelper,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super(UrlConfig.TVDB);
  }

  async getTvdbByAnilist(id: number): Promise<TvdbWithRelations> {
    const tmdb = await this.tmdbService.getTmdbByAnilist(id);

    if (!tmdb) {
      throw new Error('No tmdb found');
    }

    const existingTvdb = (await this.prisma.tvdb.findFirst({
      where: { tmdbId: tmdb.id },
      include: getTvdbInclude(),
    })) as TvdbWithRelations;

    if (existingTvdb) return existingTvdb;

    const tvdb = await this.fetchTvdbByAnilist(id);

    tvdb.tmdbId = tmdb.id;
    tvdb.type = tmdb.media_type ?? undefined;

    return await this.saveTvdb(tvdb);
  }

  async getArtworksWithRedis(id: number): Promise<TvdbArtwork[]> {
    const key = `tvdb:artworks:${id}`;
    if (Config.REDIS) {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached) as TvdbArtwork[];
      }
    }

    const tvdb = await this.getTvdbByAnilist(id);
    const artworks = tvdb.artworks;

    if (Config.REDIS) {
      await this.redis.set(
        key,
        JSON.stringify(undefinedToNull(artworks)),
        'EX',
        Config.REDIS_TIME,
      );
    }

    return artworks;
  }

  async getTranslations(
    id: number,
    translation: string,
  ): Promise<TvdbLanguageTranslation> {
    const tvdb = await this.getTvdbByAnilist(id);
    const existing = (await this.prisma.tvdbLanguageTranslation.findFirst({
      where: { tvdbId: tvdb.id, language: translation },
      omit: { id: true, tvdbId: true },
    })) as TvdbLanguageTranslation;
    if (existing) return existing;

    const tmdb = await this.tmdbService.getTmdbByAnilist(id);
    const translations = await this.fetchTranslations(
      tvdb.id,
      tmdb.media_type || 'series',
      translation,
    );
    translations.tvdbId = tvdb.id;
    return await this.saveTranslation(translations);
  }

  async getLanguages(): Promise<TvdbLanguage[]> {
    const existing = await this.prisma.tvdbLanguage.findMany();
    if (existing.length > 0) return existing;
    const langs = await this.fetchLanguages();
    return await this.saveLanguages(langs);
  }

  async saveTvdb(tvdb: TvdbInput): Promise<TvdbWithRelations> {
    return (await this.prisma.tvdb.upsert({
      where: { id: tvdb.id },
      update: this.helper.getTvdbData(tvdb),
      create: this.helper.getTvdbData(tvdb),
      include: getTvdbInclude(),
    })) as TvdbWithRelations;
  }

  async saveTranslation(
    translation: TvdbLanguageTranslation,
  ): Promise<TvdbLanguageTranslation> {
    await this.prisma.tvdbLanguageTranslation.create({
      data: this.helper.getTvdbLanguageTranslationData(translation),
    });
    return (await this.prisma.tvdbLanguageTranslation.findFirst({
      where: { tvdbId: translation.tvdbId, language: translation.language },
      omit: { id: true, tvdbId: true },
    })) as TvdbLanguageTranslation;
  }

  async update(id: number): Promise<void> {
    const existing = await this.getTvdbByAnilist(id);

    if (!existing) return;

    const tvdb = await this.fetchTvdb(id, existing.type || 'series');

    if (JSON.stringify(tvdb.artworks) !== JSON.stringify(existing.artworks)) {
      await this.saveTvdb(tvdb);
    }
  }

  async updateLanguages(): Promise<TvdbLanguage[]> {
    const langs = await this.fetchLanguages();
    return await this.saveLanguages(langs);
  }

  async saveLanguages(langs: TvdbLanguage[]): Promise<TvdbLanguage[]> {
    await this.prisma.tvdbLanguage.createMany({
      data: langs.map((l) => this.helper.getTvdbLanguageData(l)),
      skipDuplicates: true,
    });
    return await this.prisma.tvdbLanguage.findMany({
      where: { id: { in: langs.map((l) => l.id) } },
    });
  }

  async fetchTvdbByAnilist(id: number): Promise<TvdbInput> {
    const anilist = await this.anilist.getAnilist(id);
    const possibleTitles = [
      anilist.title?.native,
      anilist.title?.romaji,
      anilist.title?.english,
    ].filter(Boolean) as string[];

    if (possibleTitles.length === 0) {
      throw new Error('No title found in AniList');
    }

    let bestMatch: BasicTvdb | null = null;

    for (const title of possibleTitles) {
      const searchResults = await this.searchTvdb(deepCleanTitle(title));
      bestMatch = findBestTvdbMatchFromSearch(anilist, searchResults);
      if (bestMatch) break;
    }

    if (!bestMatch || !bestMatch.tvdb_id) {
      throw new Error('No matching TMDb entry found');
    }

    const fetchedTvdb = await this.fetchTvdb(
      +bestMatch.tvdb_id,
      bestMatch.id.startsWith('series') ? 'series' : 'movie',
    );

    return fetchedTvdb;
  }

  async fetchTvdb(id: number, type: string): Promise<TvdbInput> {
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

  async searchTvdb(q: string): Promise<BasicTvdb[]> {
    const { data, error } = await this.client.get<BasicTvdb[]>(TVDB.search(q), {
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

  async detectType(id: number): Promise<string> {
    try {
      await this.fetchTvdb(id, 'series');
      return 'series';
    } catch (_) {
      try {
        await this.fetchTvdb(id, 'movie');
        return 'movie';
      } catch (_) {
        throw new Error('ID not found in TVDB as Movie or Series.');
      }
    }
  }
}
