import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CustomHttpService } from '../../../../../http/http.service'
import { PrismaService } from '../../../../../prisma.service'
import { AnilistService } from '../anilist.service'
import { ZoroService } from '../../../zoro/service/zoro.service'
import { AnimekaiService } from '../../../animekai/service/animekai.service'
import { AnimepaheService } from '../../../animepahe/service/animepahe.service'
import Config from '../../../../../configs/Config'
import { sleep } from '../../../../../shared/utils'

export interface Ids {
  sfw: number[]
  nsfw: number[]
}

@Injectable()
export class AnilistIndexerService {
  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly service: AnilistService,
    private readonly zoro: ZoroService,
    private readonly animekai: AnimekaiService,
    private readonly animepahe: AnimepaheService,
    private readonly httpService: CustomHttpService,
  ) { }

  public async index(delay: number = 10): Promise<void> {
    if (this.isRunning) {
      console.log('Already running, skip this round.')
      return
    }

    this.isRunning = true
    const ids = await this.getIds()

    for (const id of ids) {
      if (!this.isRunning) {
        console.log('Indexing manually stopped 🚫')
        this.isRunning = false
        return
      }

      const existing = await this.prisma.releaseIndex.findUnique({
        where: { id: id.toString() },
      })

      if (existing) continue

      try {
        console.log(`Indexing new release: ${id}`)
        await this.safeGetAnilist(id)

        await this.prisma.releaseIndex.create({
          data: { id: id.toString() },
        })

        await sleep(this.getRandomInt(delay, delay + 25))
      } catch (e: any) {
        console.error('Failed index update:', e)
      }
    }

    this.isRunning = false
    console.log('Indexing complete, shutting it down 🛑')
  }

  public stop(): void {
    this.isRunning = false
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  public async updateIndex(): Promise<void> {
    if (!Config.ANILIST_INDEXER_UPDATE_ENABLED || this.isRunning) {
      console.log('Scheduled updates are disabled. Skipping update.')
      return
    }

    console.log('Scheduled index update started...')

    await this.index()
  }

  private async getIds(): Promise<number[]> {
    const ids = await this.httpService.getResponse('https://raw.githubusercontent.com/purarue/mal-id-cache/master/cache/anime_cache.json') as Ids
    return [...ids.sfw, ...ids.nsfw]
  }

  private async safeGetAnilist(id: number, retries = 3): Promise<void> {
    let lastError: any = null

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const data = await this.service.getAnilist(id, true)
        if (!data) {
          console.warn(`⚠️ Anilist returned no data for ID ${id}`)
          return
        }

        const providers = [
          { name: 'Zoro', fn: () => this.zoro.getZoroByAnilist(id) },
          { name: 'Animekai', fn: () => this.animekai.getAnimekaiByAnilist(id) },
          { name: 'Animepahe', fn: () => this.animepahe.getAnimepaheByAnilist(id) },
        ]

        for (const provider of providers) {
          try {
            await provider.fn()
          } catch (e) {
            console.warn(`⚠️ ${provider.name} failed for ID ${id}:`, e.message ?? e)
          }
        }

        return
      } catch (e: any) {
        lastError = e

        if (e.response?.status === 429) {
          const retryAfter = e.response.headers['retry-after']
            ? parseInt(e.response.headers['retry-after'], 10)
            : this.getRandomInt(30, 60)

          console.warn(`⚠️ 429 hit - Attempt ${attempt}/${retries}. Sleeping ${retryAfter}s`)
          await sleep(retryAfter)
        } else {
          console.warn(`❌ Attempt ${attempt} failed:`, e.message ?? e)
          break
        }
      }
    }

    throw lastError ?? new Error(`Unknown error fetching Anilist for ID: ${id}`)
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}