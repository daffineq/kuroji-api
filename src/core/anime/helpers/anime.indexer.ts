import lock from 'src/helpers/lock';
import prisma from 'src/lib/prisma';
import { sleep } from 'bun';
import logger from 'src/helpers/logger';
import { EnableSchedule, Scheduled, ScheduleStrategies } from 'src/helpers/schedule';
import env from 'src/config/env';
import { AnilistFetch } from '../providers';
import { Anime } from '../anime';

@EnableSchedule
class AnimeIndexer {
  private delay: number = 5;

  private async index(): Promise<void> {
    try {
      let page = await this.getLastFetchedPage();
      let hasNextPage = true;
      const perPage = 50;

      logger.log(`Starting index from page ${page}...`);

      while (hasNextPage) {
        logger.log(`Fetching IDs from page ${page}...`);

        const response = await AnilistFetch.fetchIds(page, perPage);
        const ids = response.media.map((m) => m.id);
        hasNextPage = response.pageInfo.hasNextPage;

        logger.log(`Fetched ${ids.length} IDs, checking for new releases...`);

        const existingIdsRaw = await prisma.anime.findMany({
          where: {
            id: { in: ids }
          },
          select: { id: true }
        });

        const existingIdsSet = new Set(existingIdsRaw.map((e) => e.id));
        const newIds = ids.filter((id) => !existingIdsSet.has(id));

        logger.log(`Found ${newIds.length} new releases on page ${page}.`);

        for (const id of newIds) {
          if (!lock.isLocked('indexer')) {
            logger.log('Indexing stopped manually. Exiting...');
            return;
          }

          logger.log(`Indexing release ID: ${id}...`);

          try {
            await Anime.updateOrCreate(id);
          } catch (err) {
            logger.error(`Failed to index release ${id}:`, err);
            return;
          }

          await sleep(this.delay * 1000);
        }

        await this.setLastFetchedPage(page);
        page++;
      }

      if (!hasNextPage) {
        await this.setLastFetchedPage(1);
      }

      logger.log('Indexing complete. All done');
    } catch (err) {
      logger.error('Unexpected error during indexing:', err);
    } finally {
      lock.release('indexer');
    }
  }

  public async start(delay: number = 5): Promise<string> {
    if (!lock.acquire('indexer')) {
      logger.log('Indexer already running, skipping new run.');
      return 'Indexer already running, skipping new run.';
    }

    this.delay = delay;

    logger.log('Starting indexing...');
    this.index().catch((err) => {
      logger.error('Error during indexing:', err);
    });
    return `Indexing started, estimated time: ${await this.calculateEstimatedTime()}`;
  }

  public stop(): string {
    logger.log('Indexing stopped by request.');
    lock.release('indexer');
    return 'Indexing stopped';
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_MONTH_START]
  })
  async scheduleIndex() {
    if (!env.ANIME_INDEXER_UPDATE_ENABLED) {
      logger.log('Anime indexer updates disabled. Skipping scheduled indexing.');
      return;
    }

    await this.index();
  }

  public async calculateEstimatedTime(): Promise<string> {
    const totalFetched = await prisma.anime.count();
    const total = await AnilistFetch.getTotal();

    const remaining = Math.max(total - totalFetched, 0);

    const timeS = remaining * (this.delay + 10);
    const timeM = Math.floor(timeS / 60);
    const timeH = Math.floor(timeM / 60);
    const timeD = Math.floor(timeH / 24);

    return `${timeD} days, ${timeH % 24} hours, ${timeM % 60} minutes, ${timeS % 60} seconds`;
  }

  private async getLastFetchedPage(): Promise<number> {
    const state = await prisma.indexerState.findUnique({
      where: { id: 'anime' }
    });
    return state?.lastFetchedPage ?? 1;
  }

  private async setLastFetchedPage(page: number): Promise<void> {
    await prisma.indexerState.upsert({
      where: { id: 'anime' },
      update: { lastFetchedPage: page },
      create: { id: 'anime', lastFetchedPage: page }
    });
  }
}

const animeIndexer = new AnimeIndexer();

export default animeIndexer;
