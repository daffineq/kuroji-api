import { Injectable } from '@nestjs/common'
import { getTvdbInclude, TvdbHelper } from '../utils/tvdb-helper'
import { CustomHttpService } from '../../../../http/http.service'
import { PrismaService } from '../../../../prisma.service'
import { TmdbService } from '../../tmdb/service/tmdb.service'
import { TvdbTokenService } from './token/tvdb.token.service'
import { TVDB } from '../../../../configs/tvdb.config'
import {
  TvdbLanguage,
  TvdbLanguageTranslation,
} from '@prisma/client'
import { UpdateType } from '../../../../update/UpdateType'
import { getUpdateData } from '../../../../update/update.util'
import { TvdbWithRelations, BasicTvdb, SearchResponse, TvdbInput } from '../types/types'

@Injectable()
export class TvdbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
    private readonly tokenService: TvdbTokenService,
    private readonly customHttpService: CustomHttpService,
    private readonly helper: TvdbHelper,
  ) { }

  async getTvdb(id: number): Promise<TvdbWithRelations> {
    const existingTvdb = await this.prisma.tvdb.findUnique({
      where: { id },
      include: getTvdbInclude(),
    }) as TvdbWithRelations | null

    if (existingTvdb) return existingTvdb

    const type = await this.detectType(id)
    const tvdb = await this.fetchTvdb(id, type)
    return await this.saveTvdb(tvdb)
  }

  async getTvdbByAnilist(id: number): Promise<TvdbWithRelations> {
    const tmdb = await this.tmdbService.getTmdbByAnilist(id)
    const existingTvdb = await this.prisma.tvdb.findFirst({
      where: { tmdbId: tmdb.id },
      include: getTvdbInclude(),
    }) as TvdbWithRelations | null

    if (existingTvdb) return existingTvdb

    const basicTvdb = await this.fetchByRemoteId(String(tmdb.id), tmdb.media_type || 'series')
    const tvdb = await this.fetchTvdb(basicTvdb.id, tmdb.media_type || 'series')

    tvdb.tmdbId = tmdb.id
    tvdb.type = tmdb.media_type ?? undefined

    return await this.saveTvdb(tvdb)
  }

  async getTranslations(id: number, translation: string): Promise<TvdbLanguageTranslation> {
    const tvdb = await this.getTvdbByAnilist(id)
    const existing = await this.prisma.tvdbLanguageTranslation.findFirst({
      where: { tvdbId: tvdb.id, language: translation },
      omit: { id: true, tvdbId: true }
    }) as TvdbLanguageTranslation;
    if (existing) return existing

    const tmdb = await this.tmdbService.getTmdbByAnilist(id)
    const translations = await this.fetchTranslations(tvdb.id, tmdb.media_type || 'series', translation)
    translations.tvdbId = tvdb.id
    return await this.saveTranslation(translations)
  }

  async getLanguages(): Promise<TvdbLanguage[]> {
    const existing = await this.prisma.tvdbLanguage.findMany()
    if (existing.length > 0) return existing
    const langs = await this.fetchLanguages()
    return await this.saveLanguages(langs)
  }

  async saveTvdb(tvdb: TvdbInput): Promise<TvdbWithRelations> {
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(tvdb.id) },
      create: getUpdateData(String(tvdb.id), tvdb.id ?? 0, UpdateType.TVDB),
      update: getUpdateData(String(tvdb.id), tvdb.id ?? 0, UpdateType.TVDB),
    });

    await this.prisma.tvdb.upsert({
      where: { id: tvdb.id },
      update: this.helper.getTvdbData(tvdb),
      create: this.helper.getTvdbData(tvdb),
    })

    return await this.prisma.tvdb.findUnique({
      where: { id: tvdb.id },
      include: getTvdbInclude(),
    }) as unknown as TvdbWithRelations;
  }

  async saveTranslation(translation: TvdbLanguageTranslation): Promise<TvdbLanguageTranslation> {
    await this.prisma.tvdbLanguageTranslation.create({
      data: this.helper.getTvdbLanguageTranslationData(translation),
    });
    return await this.prisma.tvdbLanguageTranslation.findFirst({
      where: { tvdbId: translation.tvdbId, language: translation.language },
      omit: { id: true, tvdbId: true }
    }) as TvdbLanguageTranslation;
  }

  async update(id: number): Promise<void> {
    const existing = await this.prisma.tvdb.findFirst({
      where: { id },
      include: getTvdbInclude(),
    }) as TvdbWithRelations | null

    if (!existing) return

    const tvdb = await this.fetchTvdb(id, existing.type || 'series')

    if (JSON.stringify(tvdb.artworks) !== JSON.stringify(existing.artworks)) {
      await this.saveTvdb(tvdb)
    }
  }

  async updateLanguages(): Promise<TvdbLanguage[]> {
    const langs = await this.fetchLanguages()
    return await this.saveLanguages(langs)
  }

  async saveLanguages(langs: TvdbLanguage[]): Promise<TvdbLanguage[]> {
    await this.prisma.tvdbLanguage.createMany({
      data: langs.map(l => this.helper.getTvdbLanguageData(l)),
      skipDuplicates: true,
    })
    return await this.prisma.tvdbLanguage.findMany({
      where: { id: { in: langs.map(l => l.id) } },
    })
  }

  async fetchByRemoteId(id: string, type: string): Promise<BasicTvdb> {
    const res = await this.customHttpService.getResponse(
      TVDB.getRemoteId(id),
      {
        headers: {
          Authorization: `Bearer ${await this.tokenService.getToken()}`,
        },
      },
    ) as SearchResponse

    const match = res.data.find(item => type === 'movie' ? item.movie : item.series)
    if (!match) throw new Error('Not found')

    return type === 'movie' ? match.movie : match.series
  }

  async fetchTvdb(id: number, type: string): Promise<TvdbInput> {
    const url = type === 'movie' ? TVDB.getMovie(id) : TVDB.getSeries(id)
    return await this.customHttpService.getResponse(url, {
      headers: {
        Authorization: `Bearer ${await this.tokenService.getToken()}`,
      },
    }, 'data')
  }

  async fetchTranslations(id: number, type: string, lang: string): Promise<TvdbLanguageTranslation> {
    const url = type === 'movie' ? TVDB.getMovieTranslations(id, lang) : TVDB.getSeriesTranslations(id, lang)
    return await this.customHttpService.getResponse(url, {
      headers: {
        Authorization: `Bearer ${await this.tokenService.getToken()}`,
      },
    }, 'data')
  }

  async fetchLanguages(): Promise<TvdbLanguage[]> {
    return await this.customHttpService.getResponse(TVDB.getLanguages(), {
      headers: {
        Authorization: `Bearer ${await this.tokenService.getToken()}`,
      },
    }, 'data')
  }

  async detectType(id: number): Promise<string> {
    try {
      await this.customHttpService.getResponse(TVDB.getSeries(id))
      return 'series'
    } catch (_) {
      try {
        await this.customHttpService.getResponse(TVDB.getMovie(id))
        return 'movie'
      } catch (_) {
        throw new Error('ID not found in TVDB as Movie or Series.')
      }
    }
  }
}