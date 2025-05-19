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
import { PageInfo } from '../../graphql/types/PageInfo'
import AnilistQueryBuilder from '../../graphql/query/AnilistQueryBuilder'
import { UrlConfig } from '../../../../../configs/url.config'
import { MediaType } from '../../filter/Filter'
import AnilistQL from '../../graphql/AnilistQL'
import { AnilistResponse } from '../../model/AnilistModels'

export interface Ids {
  sfw: number[]
  nsfw: number[]
}

export interface AnilistPageResponse {
  Page: {
    pageInfo: PageInfo
    media: MediaItem[]
  }  
}

export interface MediaItem {
  id: number
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

  public async index(delay: number = 10, range: number = 25): Promise<void> {
    if (this.isRunning) {
      console.log('Already running, skip this round.')
      return
    }

    this.isRunning = true
    let page = await this.getLastFetchedPage()
    const perPage = 50

    while (this.isRunning) {
      console.log(`Fetching ids page ${page}`)

      const response = await this.getIdsGraphql(page, perPage)
      const ids = response.Page.media.map(m => m.id)
      const hasNextPage = response.Page.pageInfo.hasNextPage

      const existingIdsRaw = await this.prisma.releaseIndex.findMany({
        where: {
          id: { in: ids.map(id => id.toString()) },
        },
        select: { id: true },
      })

      const existingIdsSet = new Set(existingIdsRaw.map(e => e.id))
      const newIds = ids.filter(id => !existingIdsSet.has(id.toString()))

      for (const id of newIds) {
        if (!this.isRunning) {
          console.log('Indexing manually stopped')
          this.isRunning = false
          return
        }

        try {
          console.log(`Indexing new release: ${id}`)

          await this.safeGetAnilist(id)
          await this.prisma.releaseIndex.upsert({
            where: { id: id.toString() },
            update: {},
            create: { id: id.toString() },
          })
        } catch (e) {
          console.error(`Release throwed error: ${e}`)
          await sleep(60)
        }

        await sleep(this.getRandomInt(delay, delay + range))
      }

      await this.setLastFetchedPage(page)

      if (!hasNextPage) break
      page++
    }

    this.isRunning = false
    console.log('Indexing complete, shutting it down')
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

  private async getIdsGraphql(page: number, perPage: number = 50): Promise<AnilistPageResponse> {
    const builder = new AnilistQueryBuilder().setPage(page).setPerPage(perPage);
    builder.setType(MediaType.ANIME);

    const query = AnilistQL.getSimplePageQuery()

    return await this.httpService.getGraphQL<AnilistPageResponse>(
      UrlConfig.ANILIST_GRAPHQL,
      query,
      builder.build(),
    )
  }

  private async getLastFetchedPage(): Promise<number> {
    const state = await this.prisma.anilistIndexerState.findUnique({
      where: { id: 'anime' },
    })
    return state?.lastFetchedPage ?? 1
  }

  private async setLastFetchedPage(page: number): Promise<void> {
    await this.prisma.anilistIndexerState.upsert({
      where: { id: 'anime' },
      update: { lastFetchedPage: page },
      create: { id: 'anime', lastFetchedPage: page },
    })
  }

  private async safeGetAnilist(id: number, retries = 3): Promise<void> {
    let lastError: any = null

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const data = await this.service.getAnilist(id)
        if (!data) {
          console.warn(`Anilist returned no data for ID ${id}`)
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
            console.warn(`${provider.name} failed for ID ${id}:`, e.message ?? e)
          }
        }

        return
      } catch (e: any) {
        lastError = e

        if (e.response?.status === 429) {
          const retryAfter = e.response.headers['retry-after']
            ? parseInt(e.response.headers['retry-after'], 10)
            : this.getRandomInt(30, 60)

          console.warn(`429 hit - Attempt ${attempt}/${retries}. Sleeping ${retryAfter}s`)
          await sleep(retryAfter + 1)
        } else {
          console.warn(`Attempt ${attempt} failed:`, e.message ?? e)
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