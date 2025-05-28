import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { LastUpdated } from '@prisma/client'
import { AnimekaiService } from '../anime/providers/animekai/service/animekai.service'
import { AnilistService } from '../anime/providers/anilist/service/anilist.service'
import { MediaStatus } from '../anime/providers/anilist/filter/Filter'
import { AnimepaheService } from '../anime/providers/animepahe/service/animepahe.service'
import { KitsuService } from '../anime/providers/kitsu/service/kitsu.service'
import { ShikimoriService } from '../anime/providers/shikimori/service/shikimori.service'
import { TmdbService, TmdbStatus } from '../anime/providers/tmdb/service/tmdb.service'
import { TvdbService, TvdbStatus } from '../anime/providers/tvdb/service/tvdb.service'
import { ZoroService } from '../anime/providers/zoro/service/zoro.service'
import Config from '../configs/Config'
import { PrismaService } from '../prisma.service'
import { UpdateType } from '../shared/UpdateType'
import { sleep } from '../shared/utils'

interface IProvider {
  update: (id: string | number) => Promise<any>
  type: UpdateType
}

export interface LastUpdateResponse {
  id: number
  entityId: string
  externalId: number | null
  type: string
  createdAt: string
  temperature: string
}

export enum Temperature {
  AIRING_NOW,
  AIRING_TODAY,
  HOT,
  WARM,
  COLD,
  UNKNOWN,
}

const ONE_HOUR_MS = 60 * 60 * 1000
const SLEEP_BETWEEN_UPDATES = 30

enum UpdateInterval {
  MINUTE_5 = 5 * 60 * 1000,
  MINUTE_30 = 30 * 60 * 1000,
  HOUR_1 = 1 * ONE_HOUR_MS,
  HOUR_3 = 3 * ONE_HOUR_MS,
  HOUR_6 = 6 * ONE_HOUR_MS,
  HOUR_9 = 9 * ONE_HOUR_MS,
  HOUR_12 = 12 * ONE_HOUR_MS,
  DAY_1 = 24 * ONE_HOUR_MS,
  DAY_2 = 2 * 24 * ONE_HOUR_MS,
  DAY_3 = 3 * 24 * ONE_HOUR_MS,
  DAY_5 = 5 * 24 * ONE_HOUR_MS,
  DAY_7 = 7 * 24 * ONE_HOUR_MS,
  DAY_14 = 14 * 24 * ONE_HOUR_MS,
  DAY_28 = 28 * 24 * ONE_HOUR_MS,
}

@Injectable()
export class UpdateService {
  private isRunning = false
  private readonly providers: IProvider[]

  constructor(
    private readonly anilistService: AnilistService,
    private readonly animekaiService: AnimekaiService,
    private readonly zoroService: ZoroService,
    private readonly animepaheService: AnimepaheService,
    private readonly shikimoriService: ShikimoriService,
    private readonly tmdbService: TmdbService,
    private readonly tvdbService: TvdbService,
    private readonly kitsuService: KitsuService,
    private readonly prisma: PrismaService,
  ) {
    this.providers = [
      { update: (id: any) => this.anilistService.update(Number(id)), type: UpdateType.ANILIST },
      { update: (id: any) => this.animekaiService.update(String(id)), type: UpdateType.ANIMEKAI },
      { update: (id: any) => this.animepaheService.update(String(id)), type: UpdateType.ANIMEPAHE },
      { update: (id: any) => this.zoroService.update(String(id)), type: UpdateType.ANIWATCH }, // Assuming ANIWATCH is Zoro
      { update: (id: any) => this.shikimoriService.update(String(id)), type: UpdateType.SHIKIMORI },
      { update: (id: any) => this.tmdbService.update(Number(id)), type: UpdateType.TMDB },
      { update: (id: any) => this.tvdbService.update(Number(id)), type: UpdateType.TVDB },
      { update: (id: any) => this.kitsuService.updateKitsu(id), type: UpdateType.KITSU },
    ]
  }

  private static getUpdateInterval(temperature: Temperature, type: UpdateType): number {
    switch (temperature) {
      case Temperature.AIRING_NOW:
        return UpdateInterval.MINUTE_5
      case Temperature.AIRING_TODAY:
        return UpdateInterval.MINUTE_30
      case Temperature.HOT:
        return [UpdateType.ANILIST, UpdateType.SHIKIMORI, UpdateType.TVDB].includes(type)
          ? UpdateInterval.HOUR_12
          : UpdateInterval.HOUR_3
      case Temperature.WARM:
        return [UpdateType.ANILIST, UpdateType.SHIKIMORI, UpdateType.TVDB].includes(type)
          ? UpdateInterval.DAY_7
          : UpdateInterval.DAY_3
      case Temperature.COLD:
      case Temperature.UNKNOWN:
      default:
        return [UpdateType.ANILIST, UpdateType.SHIKIMORI, UpdateType.TVDB].includes(type)
          ? UpdateInterval.DAY_28
          : UpdateInterval.DAY_14
    }
  }

  private async _getAnilistData(lastUpdated: LastUpdated, type: UpdateType) {
    const entityId = lastUpdated.entityId
    const externalId = lastUpdated.externalId

    switch (type) {
      case UpdateType.ANILIST:
        return this.anilistService.getAnilist(Number(entityId) || 0)
      case UpdateType.SHIKIMORI:
        return this.anilistService.getAnilist(Number(entityId) || 0, true)
      default:
        return this.anilistService.getAnilist(Number(externalId) || 0)
    }
  }

  private async _getAnilistBasedTemperature(lastUpdated: LastUpdated, type: UpdateType): Promise<Temperature> {
    const anilistData = await this._getAnilistData(lastUpdated, type)
    if (!anilistData) return Temperature.UNKNOWN

    const now = new Date()
    const airingTime = new Date((anilistData.nextAiringEpisode?.airingAt || 0) * 1000)

    if (Math.abs(airingTime.getTime() - now.getTime()) <= ONE_HOUR_MS) {
      return Temperature.AIRING_NOW
    }

    const status = anilistData.status as MediaStatus
    switch (status) {
      case MediaStatus.RELEASING:
        return Temperature.HOT
      case MediaStatus.NOT_YET_RELEASED:
      case MediaStatus.HIATUS:
        return Temperature.WARM
      case MediaStatus.FINISHED:
      case MediaStatus.CANCELLED:
        return Temperature.COLD
      default:
        return Temperature.UNKNOWN
    }
  }

  private async _getTmdbTemperature(lastUpdated: LastUpdated): Promise<Temperature> {
    const tmdbData = await this.tmdbService.getTmdb(Number(lastUpdated.externalId) || 0)
    if (!tmdbData) return Temperature.UNKNOWN

    const now = new Date()
    const airingDateStr = tmdbData.next_episode_to_air?.air_date

    if (airingDateStr) {
      const airingDate = new Date(airingDateStr)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      if (
        airingDate.getFullYear() === today.getFullYear() &&
        airingDate.getMonth() === today.getMonth() &&
        airingDate.getDate() === today.getDate()
      ) {
        return Temperature.AIRING_TODAY
      }
    }

    const status = tmdbData.status as TmdbStatus
    switch (status) {
      case TmdbStatus.InProduction:
      case TmdbStatus.PostProduction:
        return Temperature.HOT
      case TmdbStatus.Planned:
      case TmdbStatus.Rumored:
      case TmdbStatus.ReturningSeries:
        return Temperature.WARM
      case TmdbStatus.Released:
      case TmdbStatus.Ended:
      case TmdbStatus.Canceled:
        return Temperature.COLD
      default:
        return Temperature.UNKNOWN
    }
  }

  private async _getTvdbTemperature(lastUpdated: LastUpdated): Promise<Temperature> {
    const tvdbData = await this.tvdbService.getTvdb(Number(lastUpdated.externalId) || 0)
    if (!tvdbData || !tvdbData.status) return Temperature.UNKNOWN

    const status = (tvdbData.status as any)?.name as TvdbStatus

    switch (status) {
      case TvdbStatus.Continuing:
        return Temperature.HOT
      case TvdbStatus.Pilot:
        return Temperature.WARM
      case TvdbStatus.Ended:
      case TvdbStatus.Cancelled:
        return Temperature.COLD
      default:
        return Temperature.UNKNOWN
    }
  }

  private async _calculateTemperature(lastUpdated: LastUpdated, type: UpdateType): Promise<Temperature> {
    if (type === UpdateType.TMDB) {
      return this._getTmdbTemperature(lastUpdated)
    } else if (type === UpdateType.TVDB) {
      return this._getTvdbTemperature(lastUpdated)
    } else {
      // For ANILIST, SHIKIMORI, ANIMEKAI, ANIMEPAHE, ANIWATCH, KITSU
      return this._getAnilistBasedTemperature(lastUpdated, type)
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async update() {
    if (!Config.UPDATE_ENABLED) {
      console.log('Updates are disabled via configuration.')
      return
    }

    if (this.isRunning) {
      console.log('Update cycle is already running. Skipping this cycle.')
      return
    }

    this.isRunning = true

    console.log('Starting update cycle...')

    for (const provider of this.providers) {
      try {
        const lastUpdates = await this.prisma.lastUpdated.findMany({
          where: { type: provider.type },
          distinct: ['entityId'],
        })

        if (!lastUpdates.length) {
          // console.log(`No items to update for provider: ${provider.type}`);
          continue
        }

        console.log(`Processing ${lastUpdates.length} items for provider: ${provider.type}`)

        for (const lastUpdated of lastUpdates) {
          const now = new Date()
          const lastTime = lastUpdated.createdAt.getTime()
          const type = lastUpdated.type as UpdateType

          const temperature = await this._calculateTemperature(lastUpdated, type)
          const updateInterval = UpdateService.getUpdateInterval(temperature, type)

          if (lastTime + updateInterval < now.getTime()) {
            console.log(
              `Updating ${provider.type} ID:${lastUpdated.entityId} (Temp: ${Temperature[temperature]}, Interval: ${updateInterval / ONE_HOUR_MS}h)`,
            )
            await provider.update(lastUpdated.entityId)
            await sleep(SLEEP_BETWEEN_UPDATES)
          }

          const lastDatePlusMonth = new Date(
            lastUpdated.createdAt.getFullYear(),
            lastUpdated.createdAt.getMonth() + 1,
            lastUpdated.createdAt.getDate(),
          )

          if (lastDatePlusMonth.getTime() < now.getTime()) {
            console.log(`Deleting old LastUpdated entry for ${provider.type} ID:${lastUpdated.entityId}`)
            await this.prisma.lastUpdated.delete({
              where: { id: lastUpdated.id },
            })
          }

          await sleep(1);
        }
      } catch (e: any) {
        console.error(`Error processing provider ${provider.type} in UpdateService:`, e.message, e.stack)
      }
    }
    this.isRunning = false
    console.log('Update cycle finished.')
  }

  async getLastUpdates(
    entityId?: string,
    externalId?: number,
    type: UpdateType = UpdateType.ANILIST,
    page: number = 1,
    perPage: number = 20,
  ): Promise<LastUpdateResponse[]> {
    const where: any = { type }

    if (entityId) where.entityId = entityId
    if (externalId) where.externalId = externalId

    const skip = (page - 1) * perPage
    const take = perPage

    const data = await this.prisma.lastUpdated.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })

    const result = await Promise.all(
      data.map(async (item) => {
        const temperature = await this._calculateTemperature(item, item.type as UpdateType)
        return {
          ...item,
          createdAt: item.createdAt.toISOString(),
          temperature: Temperature[temperature],
        }
      }),
    )
    return result
  }
}