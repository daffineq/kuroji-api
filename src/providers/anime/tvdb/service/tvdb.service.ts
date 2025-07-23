import { Injectable, NotFoundException } from '@nestjs/common';
import { TvdbHelper } from '../utils/tvdb-helper.js';
import { PrismaService } from '../../../../prisma.service.js';
import { TmdbService } from '../../tmdb/service/tmdb.service.js';
import { Prisma, TvdbLanguage, TvdbLanguageTranslation } from '@prisma/client';
import { TvdbInput, tvdbSelect } from '../types/types.js';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import Config from '../../../../configs/config.js';
import { undefinedToNull } from '../../../../shared/interceptor.js';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';
import { TvdbFetchService } from './tvdb.fetch.service.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { fullSelect } from '../../anilist/types/types.js';
import { AniZipPayload } from '../../mappings/types/types.js';
import { tmdbSelect } from '../../tmdb/types/types.js';
import { hashSelect } from '../../../../utils/utils.js';

@Injectable()
export class TvdbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly tmdbService: TmdbService,
    private readonly anilist: AnilistService,
    private readonly fetch: TvdbFetchService,
    private readonly helper: TvdbHelper,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getInfo<T extends Prisma.TvdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TvdbGetPayload<{ select: T }>> {
    const existingTvdb = await this.prisma.tvdb.findUnique({
      where: { id },
      select,
    });

    if (existingTvdb) {
      return existingTvdb as Prisma.TvdbGetPayload<{ select: T }>;
    }

    const type = await this.detectType(id);
    const tvdb = await this.fetch.fetchInfo(id, type);
    return await this.save(tvdb, select);
  }

  async getInfoByAnilist<T extends Prisma.TvdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TvdbGetPayload<{ select: T }>> {
    const anilist = await this.anilist.getAnilist(id, fullSelect);
    if (!anilist) throw new NotFoundException('No Anilist data found');

    const mapping = anilist.anizip as AniZipPayload;
    if (!mapping) throw new NotFoundException('No mappings found');

    const tvdbId = mapping.mappings?.thetvdbId;
    const type =
      mapping.mappings?.type?.toLowerCase() === 'movie' ? 'movie' : 'series';
    if (!type) throw new NotFoundException('No type found');

    if (!tvdbId) {
      const tmdb = await this.tmdbService.getInfoByAnilist(id, tmdbSelect);
      if (!tmdb.name && !tmdb.original_name)
        throw new NotFoundException('No titles');

      const basicTvdb = await this.fetch.searchByRemoteId(
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

      if (basicTvdb.tvdb_id === undefined)
        throw new Error('tvdb_id is undefined in basicTvdb');

      const tvdb = await this.fetch.fetchInfo(+basicTvdb.tvdb_id, type);
      tvdb.type = type;

      await this.mappings.updateAniZipMappings(mapping.id, {
        thetvdbId: tvdb.id,
      });

      return await this.save(tvdb, select);
    }

    const existing = await this.prisma.tvdb.findUnique({
      where: { id: tvdbId },
      select,
    });

    if (existing) {
      return existing as Prisma.TvdbGetPayload<{ select: T }>;
    }

    const tvdb = await this.fetch.fetchInfo(+tvdbId, type);

    tvdb.type = type;

    return await this.save(tvdb, select);
  }

  async getArtworksWithRedis<T extends Prisma.TvdbArtworkSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TvdbArtworkGetPayload<{ select: T }>[]> {
    const key = `tvdb:artworks:${id}:${hashSelect(select)}`;
    if (Config.REDIS) {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached) as Prisma.TvdbArtworkGetPayload<{
          select: T;
        }>[];
      }
    }

    const tvdb = await this.getInfoByAnilist(id, tvdbSelect);

    const artworks = await this.prisma.tvdbArtwork.findMany({
      where: {
        tvdb: {
          some: {
            id: tvdb.id,
          },
        },
      },
      select,
    });

    if (Config.REDIS) {
      await this.redis.set(
        key,
        JSON.stringify(undefinedToNull(artworks)),
        'EX',
        Config.REDIS_TIME,
      );
    }

    return artworks as Prisma.TvdbArtworkGetPayload<{ select: T }>[];
  }

  async getTranslations<T extends Prisma.TvdbLanguageTranslationSelect>(
    id: number,
    translation: string,
    select?: T,
  ): Promise<Prisma.TvdbLanguageTranslationGetPayload<{ select: T }>> {
    const tvdb = await this.getInfoByAnilist(id, tvdbSelect);
    const existing = await this.prisma.tvdbLanguageTranslation.findFirst({
      where: { tvdbId: tvdb.id, language: translation },
      select,
    });

    if (existing) {
      return existing as Prisma.TvdbLanguageTranslationGetPayload<{
        select: T;
      }>;
    }

    const tmdb = await this.tmdbService.getInfoByAnilist(id, tmdbSelect);
    const translations = await this.fetch.fetchTranslations(
      tvdb.id,
      tmdb.media_type || 'series',
      translation,
    );
    translations.tvdbId = tvdb.id;
    return await this.saveTranslation(translations, select);
  }

  async getLanguages<T extends Prisma.TvdbLanguageSelect>(
    select?: T,
  ): Promise<Prisma.TvdbLanguageGetPayload<{ select: T }>[]> {
    const existing = await this.prisma.tvdbLanguage.findMany({
      select,
    });

    if (existing.length > 0) {
      return existing as Prisma.TvdbLanguageGetPayload<{ select: T }>[];
    }

    const langs = await this.fetch.fetchLanguages();
    return await this.saveLanguages(langs, select);
  }

  async save<T extends Prisma.TvdbSelect>(
    tvdb: TvdbInput,
    select?: T,
  ): Promise<Prisma.TvdbGetPayload<{ select: T }>> {
    return (await this.prisma.tvdb.upsert({
      where: { id: tvdb.id },
      update: this.helper.getTvdbData(tvdb),
      create: this.helper.getTvdbData(tvdb),
      select,
    })) as Prisma.TvdbGetPayload<{ select: T }>;
  }

  async saveTranslation<T extends Prisma.TvdbLanguageTranslationSelect>(
    translation: TvdbLanguageTranslation,
    select?: T,
  ): Promise<Prisma.TvdbLanguageTranslationGetPayload<{ select: T }>> {
    await this.prisma.tvdbLanguageTranslation.create({
      data: this.helper.getTvdbLanguageTranslationData(translation),
    });

    return (await this.prisma.tvdbLanguageTranslation.findFirst({
      where: { tvdbId: translation.tvdbId, language: translation.language },
      select,
    })) as Prisma.TvdbLanguageTranslationGetPayload<{ select: T }>;
  }

  async saveLanguages<T extends Prisma.TvdbLanguageSelect>(
    langs: TvdbLanguage[],
    select?: T,
  ): Promise<Prisma.TvdbLanguageGetPayload<{ select: T }>[]> {
    await this.prisma.tvdbLanguage.createMany({
      data: langs.map((l) => this.helper.getTvdbLanguageData(l)),
      skipDuplicates: true,
    });

    return (await this.prisma.tvdbLanguage.findMany({
      where: { id: { in: langs.map((l) => l.id) } },
      select,
    })) as Prisma.TvdbLanguageGetPayload<{ select: T }>[];
  }

  async update<T extends Prisma.TvdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TvdbGetPayload<{ select: T }>> {
    const existing = await this.getInfoByAnilist(id, tvdbSelect);
    if (!existing) throw new Error('Tvdb not found');

    const tvdb = await this.fetch.fetchInfo(
      existing.id,
      existing.type || 'series',
    );

    return await this.save(tvdb, select);
  }

  async updateLanguages<T extends Prisma.TvdbLanguageSelect>(
    select?: T,
  ): Promise<Prisma.TvdbLanguageGetPayload<{ select: T }>[]> {
    const langs = await this.fetch.fetchLanguages();
    return await this.saveLanguages(langs, select);
  }

  async detectType(id: number): Promise<string> {
    try {
      await this.fetch.fetchInfo(id, 'series');
      return 'series';
    } catch (_) {
      try {
        await this.fetch.fetchInfo(id, 'movie');
        return 'movie';
      } catch (_) {
        throw new Error('ID not found in TVDB as Movie or Series.');
      }
    }
  }
}
