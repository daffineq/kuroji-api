import lock from 'src/helpers/lock';
import { sleep } from 'bun';
import logger from 'src/helpers/logger';
import { EnableSchedule, Scheduled, Schedule } from 'src/helpers/schedule';
import { Config } from 'src/config/config';
import { AnilistFetch } from '../providers';
import { Anime } from '../anime';
import { Module } from 'src/helpers/module';
import { db, indexerState } from 'src/db';

@EnableSchedule
class AnimeIndexerModule extends Module {
  override readonly name = 'AnimeIndexer';

  private delay: number = 5;

  private async index(options: { status?: string } = {}): Promise<void> {
    const { status } = options;

    try {
      let page = await this.getLastFetchedPage(status);
      let hasNextPage = true;
      const perPage = 50;

      logger.log(`Starting index from page ${page}...`);

      while (hasNextPage) {
        logger.log(`Fetching IDs from page ${page}...`);

        const response = status
          ? await AnilistFetch.fetchIdsStatus(page, perPage, status)
          : await AnilistFetch.fetchIds(page, perPage);

        const ids = response.media.map((m) => m.id);
        hasNextPage = response.pageInfo.hasNextPage;

        logger.log(`Fetched ${ids.length} IDs`);

        for (const id of ids) {
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

        await this.setLastFetchedPage(page, status);

        page++;
      }

      if (!hasNextPage) {
        await this.setLastFetchedPage(1, status);
      }

      logger.log('Indexing complete. All done');
    } catch (err) {
      logger.error('Unexpected error during indexing:', err);
    } finally {
      lock.release('indexer');
    }
  }

  public async start(delay: number = 5, status?: string): Promise<string> {
    if (!lock.acquire('indexer')) {
      logger.log('Indexer already running, skipping new run.');
      return 'Indexer already running, skipping new run.';
    }

    this.delay = delay;

    logger.log('Starting indexing...');
    this.index({ status }).catch((err) => {
      logger.error('Error during indexing:', err);
    });
    return `Indexing started, estimated time: ${await this.calculateEstimatedTime()}`;
  }

  public stop(): string {
    logger.log('Indexing stopped by request.');
    lock.release('indexer');
    return 'Indexing stopped';
  }

  public reset(status?: string): string {
    logger.log('Indexer had been reseted');
    lock.release('indexer');
    this.setLastFetchedPage(1, status);
    return 'Reseted indexer';
  }

  @Scheduled(Schedule.everyOtherWeek())
  async scheduleIndex() {
    if (!Config.anime_indexer_update_enabled) {
      logger.log('Anime indexer updates disabled. Skipping scheduled indexing.');
      return;
    }

    await this.index();
  }

  @Scheduled(Schedule.everyOtherDay())
  async scheduleIndexReleasing() {
    if (!Config.anime_indexer_update_enabled) {
      logger.log('Anime indexer updates disabled. Skipping scheduled releasing indexing.');
      return;
    }

    await this.index({ status: 'RELEASING' });
  }

  @Scheduled(Schedule.weeklyOn(0))
  async scheduleIndexUpcoming() {
    if (!Config.anime_indexer_update_enabled) {
      logger.log('Anime indexer updates disabled. Skipping scheduled upcoming indexing.');
      return;
    }

    await this.index({ status: 'NOT_YET_RELEASED' });
  }

  public async calculateEstimatedTime(): Promise<string> {
    const fetched = (await this.getLastFetchedPage()) * 50;

    // No longer working
    // const total = await AnilistFetch.getTotal();

    const total = 22000;

    const remaining = Math.max(total - fetched, 0);

    const timeS = remaining * (this.delay + 10);
    const timeM = Math.floor(timeS / 60);
    const timeH = Math.floor(timeM / 60);
    const timeD = Math.floor(timeH / 24);

    return `${timeD} days, ${timeH % 24} hours, ${timeM % 60} minutes, ${timeS % 60} seconds`;
  }

  async getLastFetchedPage(status?: string): Promise<number> {
    const state = await db.query.indexerState.findFirst({
      where: {
        id: `anime-${status ? status.toLowerCase() : 'all'}`
      }
    });
    return state?.last_page ?? 1;
  }

  async setLastFetchedPage(page: number, status?: string): Promise<void> {
    await db
      .insert(indexerState)
      .values({
        id: `anime-${status ? status.toLowerCase() : 'all'}`,
        last_page: page
      })
      .onConflictDoUpdate({
        target: indexerState.id,
        set: {
          last_page: page
        }
      });
  }
}

const AnimeIndexer = new AnimeIndexerModule();

export { AnimeIndexer, AnimeIndexerModule };
