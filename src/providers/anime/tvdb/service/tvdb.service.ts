import { Injectable } from '@nestjs/common';
import { getTvdbInclude, TvdbHelper } from '../utils/tvdb-helper.js';
import { PrismaService } from '../../../../prisma.service.js';
import { TmdbService } from '../../tmdb/service/tmdb.service.js';
import {
  TvdbArtwork,
  TvdbLanguage,
  TvdbLanguageTranslation,
} from '@prisma/client';
import { TvdbWithRelations, TvdbInput } from '../types/types.js';
import { Client } from '../../../model/client.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import Config from '../../../../configs/config.js';
import { undefinedToNull } from '../../../../shared/interceptor.js';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';
import { deepCleanTitle } from '../../../mapper/mapper.helper.js';
import { TvdbFetchService } from './tvdb.fetch.service.js';

@Injectable()
export class TvdbService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly tmdbService: TmdbService,
    private readonly anilist: AnilistService,
    private readonly fetch: TvdbFetchService,
    private readonly helper: TvdbHelper,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super(UrlConfig.TVDB);
  }

  async getTvdb(id: number): Promise<TvdbWithRelations> {
    const existingTvdb = (await this.prisma.tvdb.findUnique({
      where: { id },
      include: getTvdbInclude(),
    })) as TvdbWithRelations;

    if (existingTvdb) return existingTvdb;

    const type = await this.detectType(id);
    const tvdb = await this.fetch.fetchTvdb(id, type);
    return await this.saveTvdb(tvdb);
  }

  async getTvdbByAnilist(id: number): Promise<TvdbWithRelations> {
    const anilist = await this.anilist.getAnilist(id);
    const mapping = anilist.anizip;

    if (!mapping) {
      throw new Error('No mappings found');
    }

    const tvdbId = mapping.mappings?.thetvdbId;
    const type =
      mapping.mappings?.type?.toLowerCase() === 'movie' ? 'movie' : 'series';

    if (!type) {
      throw new Error('No type found');
    }

    if (!tvdbId) {
      const tmdb = await this.tmdbService.getTmdbByAnilist(id);

      if (!tmdb.name && !tmdb.original_name) {
        throw new Error('No titles');
      }

      const basicTvdb = await this.fetch.fetchByRemoteId(
        tmdb.id,
        type,
        deepCleanTitle(
          anilist.title?.native ??
            anilist.title?.romaji ??
            anilist.title?.english ??
            tmdb.original_name ??
            tmdb.name ??
            '',
        ),
      );

      if (basicTvdb.tvdb_id === undefined) {
        throw new Error('tvdb_id is undefined in basicTvdb');
      }

      const tvdb = await this.fetch.fetchTvdb(+basicTvdb.tvdb_id, type);
      tvdb.type = type;

      await this.mappings.updateAniZipMappings(mapping.id, {
        thetvdbId: tvdb.id,
      });

      return await this.saveTvdb(tvdb);
    }

    const existing = (await this.prisma.tvdb.findUnique({
      where: { id: tvdbId },
      include: getTvdbInclude(),
    })) as TvdbWithRelations;

    if (existing) return existing;

    const tvdb = await this.fetch.fetchTvdb(+tvdbId, type);

    tvdb.type = type;

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
    const translations = await this.fetch.fetchTranslations(
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
    const langs = await this.fetch.fetchLanguages();
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
    const existing = await this.getTvdb(id);

    if (!existing) return;

    const tvdb = await this.fetch.fetchTvdb(id, existing.type || 'series');

    if (JSON.stringify(tvdb.artworks) !== JSON.stringify(existing.artworks)) {
      await this.saveTvdb(tvdb);
    }
  }

  async updateByAnilist(id: number) {
    const tvdb = await this.getTvdbByAnilist(id);
    return await this.update(tvdb.id);
  }

  async updateLanguages(): Promise<TvdbLanguage[]> {
    const langs = await this.fetch.fetchLanguages();
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

  async detectType(id: number): Promise<string> {
    try {
      await this.fetch.fetchTvdb(id, 'series');
      return 'series';
    } catch (_) {
      try {
        await this.fetch.fetchTvdb(id, 'movie');
        return 'movie';
      } catch (_) {
        throw new Error('ID not found in TVDB as Movie or Series.');
      }
    }
  }
}
