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
    if (!this.lock.acquire(Config.INDEXER_RUNNING_KEY)) {
      console.log(
        '[AnilistIndexer] Indexer already running, skipping new run.',
      );
      return;
    }

    try {
      let page = await this.getLastFetchedPage();
      let hasNextPage = true;
      const perPage = 50;

      console.log(`[AnilistIndexer] Starting index from page ${page}...`);

      while (hasNextPage) {
        console.log(`[AnilistIndexer] Fetching IDs from page ${page}...`);

        const response = await this.getIdsGraphql(page, perPage);
        const ids = response.Page.media.map((m) => m.id);
        hasNextPage = response.Page.pageInfo.hasNextPage;

        console.log(
          `[AnilistIndexer] Fetched ${ids.length} IDs, checking for new releases...`,
        );

        const existingIdsRaw = await this.prisma.releaseIndex.findMany({
          where: {
            id: { in: ids.map((id) => id.toString()) },
          },
          select: { id: true },
        });

        const existingIdsSet = new Set(existingIdsRaw.map((e) => e.id));
        const newIds = ids.filter((id) => !existingIdsSet.has(id.toString()));

        console.log(
          `[AnilistIndexer] Found ${newIds.length} new releases on page ${page}.`,
        );

        for (const id of newIds) {
          if (!this.lock.isLocked(Config.INDEXER_RUNNING_KEY)) {
            console.log(
              '[AnilistIndexer] Indexing stopped manually. Exiting...',
            );
            return;
          }

          console.log(`[AnilistIndexer] Indexing release ID: ${id}...`);

          try {
            await this.service.getAnilist(id);
            await this.prisma.releaseIndex.upsert({
              where: { id: id.toString() },
              update: {},
              create: { id: id.toString() },
            });
          } catch (err) {
            console.error(
              `[AnilistIndexer] Failed to index release ${id}:`,
              err,
            );
          }

          await sleep(getRandomNumber(delay, delay + range), false);
        }

        await this.setLastFetchedPage(page);
        page++;
      }

      console.log('[AnilistIndexer] Indexing complete. All done');
    } catch (err) {
      console.error('[AnilistIndexer] Unexpected error during indexing:', err);
    } finally {
      this.lock.release(Config.INDEXER_RUNNING_KEY);
    }
  }

  public stop(): void {
    console.log('[AnilistIndexer] Indexing stopped by request.');
    this.lock.release(Config.INDEXER_RUNNING_KEY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Europe/London' })
  public async updateIndex(): Promise<void> {
    if (!Config.ANILIST_INDEXER_UPDATE_ENABLED) {
      console.log(
        '[AnilistIndexer] Scheduled update skipped — disabled by config.',
      );
      return;
    }

    console.log('[AnilistIndexer] Scheduled Anilist index update started...');
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
