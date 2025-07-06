import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../../../prisma.service.js';
import { AnilistService } from '../anilist.service.js';
import Config from '../../../../../configs/config.js';
import { getRandomNumber, sleep } from '../../../../../utils/utils.js';
import AnilistQueryBuilder from '../../graphql/query/AnilistQueryBuilder.js';
import { UrlConfig } from '../../../../../configs/url.config.js';
import { MediaType } from '../../filter/Filter.js';
import AnilistQL from '../../graphql/AnilistQL.js';
import { AnilistPageResponse } from './types/types.js';
import { Client } from '../../../../model/client.js';
import { AppLockService } from '../../../../../shared/app.lock.service.js';

@Injectable()
export class AnilistIndexerService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: AnilistService,
    private readonly lock: AppLockService,
  ) {
    super(UrlConfig.ANILIST_GRAPHQL);
  }

  public async index(delay: number = 10, range: number = 25): Promise<void> {
    if (this.lock.isLocked(Config.UPDATE_RUNNING_KEY)) {
      console.log('Updating is running, skip this round.');
      return;
    }

    if (!this.lock.acquire(Config.INDEXER_RUNNING_KEY)) {
      console.log('Already running, skip this round.');
      return;
    }

    try {
      let page = await this.getLastFetchedPage();
      let hasNextPage: boolean = true;
      const perPage = 50;

      while (hasNextPage) {
        console.log(`Fetching ids page ${page}`);

        const response = await this.getIdsGraphql(page, perPage);
        const ids = response.Page.media.map((m) => m.id);
        hasNextPage = response.Page.pageInfo.hasNextPage;

        const existingIdsRaw = await this.prisma.releaseIndex.findMany({
          where: {
            id: { in: ids.map((id) => id.toString()) },
          },
          select: { id: true },
        });

        const existingIdsSet = new Set(existingIdsRaw.map((e) => e.id));
        const newIds = ids.filter((id) => !existingIdsSet.has(id.toString()));

        for (const id of newIds) {
          if (!this.lock.isLocked(Config.INDEXER_RUNNING_KEY)) {
            console.log('Indexing manually stopped');
            return;
          }

          console.log(`Indexing new release: ${id}`);

          await this.service.getAnilist(id);

          await this.prisma.releaseIndex.upsert({
            where: { id: id.toString() },
            update: {},
            create: { id: id.toString() },
          });

          await sleep(getRandomNumber(delay, delay + range));
        }

        await this.setLastFetchedPage(page);

        if (!hasNextPage) break;
        page++;
      }

      console.log('Indexing complete, shutting it down');
    } finally {
      this.lock.release(Config.INDEXER_RUNNING_KEY);
    }
  }

  public stop(): void {
    this.lock.release(Config.INDEXER_RUNNING_KEY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Europe/London' })
  public async updateIndex(): Promise<void> {
    if (!Config.ANILIST_INDEXER_UPDATE_ENABLED) {
      console.log('Scheduled updates are disabled. Skipping update.');
      return;
    }

    console.log('Scheduled index update started...');

    await this.index();
  }

  private async getIdsGraphql(
    page: number,
    perPage: number = 50,
  ): Promise<AnilistPageResponse> {
    const builder = new AnilistQueryBuilder()
      .setPage(page)
      .setPerPage(perPage)
      .setType(MediaType.ANIME);

    const query = AnilistQL.getSimplePageQuery(builder);
    const variables = builder.build();

    const { data, error } = await this.client.post<AnilistPageResponse>(
      `${this.baseUrl}`,
      {
        json: {
          query,
          variables,
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

  private async getLastFetchedPage(): Promise<number> {
    const state = await this.prisma.anilistIndexerState.findUnique({
      where: { id: 'anime' },
    });
    return state?.lastFetchedPage ?? 1;
  }

  private async setLastFetchedPage(page: number): Promise<void> {
    await this.prisma.anilistIndexerState.upsert({
      where: { id: 'anime' },
      update: { lastFetchedPage: page },
      create: { id: 'anime', lastFetchedPage: page },
    });
  }
}
