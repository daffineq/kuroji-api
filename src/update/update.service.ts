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
import { AnilistWithRelations } from '../anime/providers/anilist/model/AnilistModels'

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
const SLEEP_BETWEEN_UPDATES = 10

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

  private static getRandomInterval(base: number, variation: number): number {
    const min = base - (base * variation)
    const max = base + (base * variation)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private static getUpdateInterval(temperature: Temperature, type: UpdateType): number {
    const variation = 0.2 // 20% variation

    switch (temperature) {
      case Temperature.AIRING_NOW:
        return this.getRandomInterval(UpdateInterval.MINUTE_5, variation)
      case Temperature.AIRING_TODAY:
        return this.getRandomInterval(UpdateInterval.MINUTE_30, variation)
      case Temperature.HOT:
        return [UpdateType.ANILIST, UpdateType.SHIKIMORI, UpdateType.TVDB, UpdateType.KITSU].includes(type)
          ? this.getRandomInterval(UpdateInterval.DAY_1, variation)
          : this.getRandomInterval(UpdateInterval.HOUR_12, variation)
      case Temperature.WARM:
        return [UpdateType.ANILIST, UpdateType.SHIKIMORI, UpdateType.TVDB, UpdateType.KITSU].includes(type)
          ? this.getRandomInterval(UpdateInterval.DAY_7, variation)
          : this.getRandomInterval(UpdateInterval.DAY_3, variation)
      case Temperature.COLD:
      case Temperature.UNKNOWN:
      default:
        return [UpdateType.ANILIST, UpdateType.SHIKIMORI, UpdateType.TVDB, UpdateType.KITSU].includes(type)
          ? this.getRandomInterval(UpdateInterval.DAY_28, variation)
          : this.getRandomInterval(UpdateInterval.DAY_14, variation)
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

    // Check for immediate airing episodes
    if (anilistData.nextAiringEpisode) {
      const airingTime = new Date((anilistData?.nextAiringEpisode?.airingAt || 0) * 1000)
      const timeDiff = Math.abs(airingTime.getTime() - now.getTime())
      
      // If airing within the next hour
      if (timeDiff <= ONE_HOUR_MS) {
        return Temperature.AIRING_NOW
      }
      
      // If airing today
      // if (airingTime.toDateString() === now.toDateString()) {
      //   return Temperature.AIRING_TODAY
      // }
    }

    const status = anilistData.status as MediaStatus
    
    // Calculate anime's current relevance score
    const relevanceScore = this._calculateRelevanceScore(anilistData, now)

    switch (status) {
      case MediaStatus.RELEASING:
        // // For releasing shows, consider popularity and trending metrics
        // if (relevanceScore >= 6) return Temperature.HOT
        return Temperature.HOT

      case MediaStatus.NOT_YET_RELEASED:
        // For upcoming shows, check proximity to release date
        if (anilistData.startDate) {
          const startDate = new Date(
            anilistData.startDate.year!, 
            (anilistData.startDate.month || 1) - 1,
            anilistData.startDate.day || 1
          )
          const daysUntilStart = (startDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
          
          if (daysUntilStart <= 7) return Temperature.HOT
          if (daysUntilStart <= 30) return Temperature.WARM
        }
        return Temperature.COLD

      case MediaStatus.FINISHED:
        // For finished shows, consider recent popularity and classic status
        if (relevanceScore >= 7) return Temperature.HOT
        if (relevanceScore >= 5) return Temperature.WARM
        return Temperature.COLD

      case MediaStatus.CANCELLED:
        return Temperature.COLD

      case MediaStatus.HIATUS:
        // For shows on hiatus, check if they're still popular
        return relevanceScore >= 6 ? Temperature.WARM : Temperature.COLD

      default:
        return Temperature.UNKNOWN
    }
  }

  private _calculateRelevanceScore(anilist: AnilistWithRelations, now: Date): number {
    let score = 0

    // Popularity and trending factors (0-3 points)
    if (anilist.popularity) {
      if (anilist.popularity > 100000) score += 3
      else if (anilist.popularity > 50000) score += 2
      else if (anilist.popularity > 10000) score += 1
    }

    if (anilist.trending) {
      if (anilist.trending > 1000) score += 3
      else if (anilist.trending > 500) score += 2
      else if (anilist.trending > 100) score += 1
    }

    // Recent activity (0-2 points)
    if (anilist.updatedAt) {
      const daysSinceUpdate = (now.getTime() - anilist.updatedAt * 1000) / (24 * 60 * 60 * 1000)
      if (daysSinceUpdate < 1) score += 2
      else if (daysSinceUpdate < 7) score += 1
    }

    // Rankings consideration (0-2 points)
    const topRanking = anilist.rankings?.find(r => r.allTime && r.rank || 0 <= 100)
    if (topRanking) {
      if (topRanking.rank || 0 <= 50) score += 2
      else score += 1
    }

    // Score and favorites (0-2 points)
    if (anilist.averageScore && anilist.averageScore > 80) score += 1
    if (anilist.favourites && anilist.favourites > 10000) score += 1

    // Season relevance (0-1 point)
    if (anilist.season && anilist.seasonYear) {
      const currentYear = now.getFullYear()
      const currentSeason = this._getCurrentSeason(now)
      
      if (anilist.seasonYear === currentYear && anilist.season === currentSeason) {
        score += 1
      }
    }

    return score
  }

  private _getCurrentSeason(date: Date): string {
    const month = date.getMonth()
    if (month >= 0 && month <= 2) return 'WINTER'
    if (month >= 3 && month <= 5) return 'SPRING'
    if (month >= 6 && month <= 8) return 'SUMMER'
    return 'FALL'
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
  async update(annotateAtId: string | null = null): Promise<void> {
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
          orderBy: { createdAt: 'desc' },
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

          const shouldUpdate = lastTime + updateInterval <= now.getTime()

          if (annotateAtId == lastUpdated.entityId) {
            console.log(`Info for id ${lastUpdated.entityId} (Type: ${provider.type}) - Temperature: ${Temperature[temperature]}, Last Updated: ${lastUpdated.createdAt.toISOString()}, Interval: ${updateInterval / ONE_HOUR_MS}h, Will Update: ${shouldUpdate}`)
          }

          if (shouldUpdate) {
            console.log(
              `Updating ${provider.type} ID:${lastUpdated.entityId} (Temp: ${Temperature[temperature]}, Interval: ${updateInterval / ONE_HOUR_MS}h), Items Left: ${lastUpdates.length - lastUpdates.indexOf(lastUpdated) - 1}`,
            )
            await provider.update(lastUpdated.entityId)
            await sleep(SLEEP_BETWEEN_UPDATES, false)
          } else {
            await sleep(0.01, false);
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