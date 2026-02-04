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

  private async index(options: { delay?: number; status?: string; threshold?: number } = {}): Promise<void> {
    if (!lock.acquire('indexer')) {
      logger.log('Indexer already running, skipping new run.');
      return;
    }

    const { delay = Config.anime_indexer_default_delay, status } = options;

    try {
      let page = await this.getLastFetchedPage(status);
      let hasNextPage = true;
      const perPage = 50;

      logger.log(`Starting index from page ${page}...`);

      while (hasNextPage) {
        logger.log(`Fetching IDs from page ${page}...`);

        const response = await AnilistFetch.fetchIds(page, perPage, options);

        const ids = response.media.map((m) => m.id);
        hasNextPage = response.pageInfo.hasNextPage;

        for (const id of ids) {
          if (!lock.isLocked('indexer')) {
            logger.log('Indexing stopped.');
            return;
          }

          logger.log(`Indexing release ID: ${id}...`);

          try {
            await Promise.race([
              Anime.updateOrCreate(id),
              sleep(60000).then(() => {
                throw new Error('Timed out');
              })
            ]);
          } catch (err) {
            logger.error(`Failed to index release ${id}:`, err);
            return;
          }

          await sleep(delay * 1000);
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

  public async start(options: { delay?: number; status?: string; threshold?: number }): Promise<string> {
    if (lock.isLocked('indexer')) {
      logger.log('Indexer already running, skipping new run.');
      return 'Indexer already running';
    }

    logger.log('Starting indexing...');
    this.index(options).catch((err) => {
      logger.error('Error during indexing:', err);
    });

    return `Indexing started, estimated time: ${await this.calculateEstimatedTime(options)}`;
  }

  public stop(): string {
    if (lock.isLocked('indexer')) {
      logger.log('Indexing stopped by request.');
      lock.release('indexer');
      return 'Indexing stopped';
    }

    return 'Nothing to stop';
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

  public async calculateEstimatedTime(options: {
    delay?: number;
    status?: string;
    threshold?: number;
  }): Promise<string> {
    const { delay = Config.anime_indexer_default_delay, status } = options;

    const fetched = (await this.getLastFetchedPage(status)) * 50;

    // Estimating count because anilist fixed the way i used to get count in anilist api
    const total = this.estimateCount(options);

    const remaining = Math.max(total - fetched, 0);

    const timeS = remaining * (delay + 10);
    const timeM = Math.floor(timeS / 60);
    const timeH = Math.floor(timeM / 60);
    const timeD = Math.floor(timeH / 24);

    return `${timeD} days, ${timeH % 24} hours, ${timeM % 60} minutes, ${timeS % 60} seconds`;
  }

  private estimateCount(options: { status?: string; threshold?: number } = {}): number {
    const { status, threshold = Config.anime_indexer_default_popularity_threshold } = options;

    const buckets: [number, number][] = [
      [50_000, 300],
      [30_000, 700],
      [20_000, 1_400],
      [10_000, 2_800],
      [7_500, 4_000],
      [5_000, 5_800],
      [2_500, 9_500],
      [1_000, 14_500],
      [500, 18_500],
      [100, 24_000]
    ];

    const statusRatio: Record<string, number> = {
      FINISHED: 0.63,
      RELEASING: 0.13,
      NOT_YET_RELEASED: 0.09,
      CANCELLED: 0.07,
      HIATUS: 0.01
    };

    if (threshold >= buckets[0]![0]) {
      return Math.round(buckets[0]![1] * (status ? (statusRatio[status] ?? 1) : 1));
    }

    if (threshold <= buckets[buckets.length - 1]![0]) {
      return Math.round(buckets[buckets.length - 1]![1] * (status ? (statusRatio[status] ?? 1) : 1));
    }

    for (let i = 0; i < buckets.length - 1; i++) {
      const [p1, c1] = buckets[i] ?? [0, 0];
      const [p2, c2] = buckets[i + 1] ?? [0, 0];

      if (threshold <= p1 && threshold >= p2) {
        const t = (threshold - p1) / (p1 - p2);
        const value = c1 + t * (c1 - c2);

        return Math.round(value * (status ? (statusRatio[status] ?? 1) : 1));
      }
    }

    return 0;
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
