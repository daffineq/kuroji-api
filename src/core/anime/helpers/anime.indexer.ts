import lock from 'src/core/helpers/lock';
import prisma from 'src/lib/prisma';
import anilistFetch from '../anilist/helpers/anilist.fetch';
import anime from '../anime';
import { sleep } from 'bun';
import logger from 'src/helpers/logger';

class AnimeIndexer {
  private delay: number = 20;

  private async index(): Promise<void> {
    try {
      let page = await this.getLastFetchedPage();
      let hasNextPage = true;
      const perPage = 50;

      logger.log(`Starting index from page ${page}...`);

      while (hasNextPage) {
        logger.log(`Fetching IDs from page ${page}...`);

        const response = await anilistFetch.fetchIds(page, perPage);
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
            await anime.initOrGet(id);
          } catch (err) {
            logger.error(`Failed to index release ${id}:`, err);
          }

          await sleep(this.delay * 1000);
        }

        await this.setLastFetchedPage(page);
        page++;
      }

      logger.log('Indexing complete. All done');
    } catch (err) {
      logger.error('Unexpected error during indexing:', err);
    } finally {
      lock.release('indexer');
    }
  }

  public async start(delay: number = 20): Promise<string> {
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

  public async calculateEstimatedTime(): Promise<string> {
    const totalFetched = await prisma.anime.count();
    const total = await anilistFetch.getTotal();

    const remaining = Math.max(total - totalFetched, 0);

    const timeS = remaining * this.delay;
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

export default new AnimeIndexer();
