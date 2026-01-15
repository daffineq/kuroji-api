import logger from 'src/helpers/logger';
import { sleep } from 'bun';
import { Config } from 'src/config/config';
import lock from 'src/helpers/lock';
import { EnableSchedule, Scheduled, ScheduleStrategies } from 'src/helpers/schedule';
import { AnimeUpdateFetch } from './anime.update.fetch';
import { Anime } from '../anime';
import { Module } from 'src/helpers/module';
import { db, updateQueue } from 'src/db';
import { count, eq, lt, sql } from 'drizzle-orm';

export interface QueueItem {
  animeId: number;
  malId: number | null | undefined;
  addedAt: number;
}

const SLEEP_BETWEEN_UPDATES = 10;

@EnableSchedule
class AnimeUpdateModule extends Module {
  override readonly name = 'AnimeUpdate';

  private async cleanupOldQueueItems() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await db.delete(updateQueue).where(lt(updateQueue.added_at, oneDayAgo));
    } catch (e) {
      logger.error('Failed to cleanup old queue items:', e);
    }
  }

  private async addToQueue(anime: { id: number; id_mal: number | null | undefined }) {
    try {
      const existing = await db.query.updateQueue.findFirst({
        where: {
          anime_id: anime.id
        }
      });

      await db
        .insert(updateQueue)
        .values({
          anime_id: anime.id,
          mal_id: anime.id_mal,
          added_at: new Date(),
          updated_at: new Date()
        })
        .onConflictDoUpdate({
          target: updateQueue.anime_id,
          set: {
            updated_at: sql`excluded.updated_at`
          }
        });
    } catch (e) {
      logger.error(`Failed to add anime ${anime.id} to queue:`, e);
    }
  }

  private async updateQueueItem(animeId: number) {
    try {
      await db
        .update(updateQueue)
        .set({
          updated_at: new Date()
        })
        .where(eq(updateQueue.anime_id, animeId));
    } catch (error) {
      logger.error(`Failed to update queue item ${animeId} in database:`, error);
    }
  }

  private async removeFromQueue(animeId: number) {
    try {
      await db.delete(updateQueue).where(eq(updateQueue.anime_id, animeId));
    } catch (error) {
      logger.error(`Failed to remove queue item ${animeId} from database:`, error);
    }
  }

  async clearQueue() {
    try {
      await db.delete(updateQueue);
      logger.log('Queue cleared manually');
    } catch (e) {
      logger.error('Failed to clear queue:', e);
    }
  }

  private async getNextFromQueue(): Promise<QueueItem | null> {
    try {
      const next = await db.query.updateQueue.findFirst({
        orderBy: {
          updated_at: 'desc'
        }
      });

      if (!next) {
        return null;
      }

      return {
        animeId: next.anime_id,
        malId: next.mal_id ?? undefined,
        addedAt: next.added_at.getTime()
      };
    } catch (e) {
      logger.error('Failed to get next queue item:', e);
      return null;
    }
  }

  async queueRecentAnime() {
    const recentAnime = await AnimeUpdateFetch.getRecentAiredAnime();
    logger.log(`Adding ${recentAnime.length} recent aired anime to queue with HIGH priority`);

    if (recentAnime.length > 0) {
      const animeWithEpisodes = recentAnime.filter((anime) => anime.airing_schedule.length > 0);
      logger.log(`Recent anime with episodes: ${animeWithEpisodes.length}/${recentAnime.length}`);
    }

    for (const anime of recentAnime) {
      await this.addToQueue(anime);
    }
  }

  async queueTodayAnime() {
    const todayAnime = await AnimeUpdateFetch.getTodayAiredAnime();
    logger.log(`Adding ${todayAnime.length} today aired anime to queue`);

    for (const anime of todayAnime) {
      await this.addToQueue(anime);
    }
  }

  async queueWeekAgoAnime() {
    const weekAgoAnime = await AnimeUpdateFetch.getLastWeekAiredAnime();
    logger.log(`Adding ${weekAgoAnime.length} last week aired anime to queue`);

    for (const anime of weekAgoAnime) {
      await this.addToQueue(anime);
    }
  }

  async queueTwoDaysAgoAnime() {
    const twoDaysAgoAnime = await AnimeUpdateFetch.getDaysAgoAiredAnime(2);
    logger.log(`Adding ${twoDaysAgoAnime.length} two days ago aired anime to queue`);

    for (const anime of twoDaysAgoAnime) {
      await this.addToQueue(anime);
    }
  }

  async queueThreeDaysAgoAnime() {
    const threeDaysAgoAnime = await AnimeUpdateFetch.getDaysAgoAiredAnime(3);
    logger.log(`Adding ${threeDaysAgoAnime.length} three days ago aired anime to queue`);

    for (const anime of threeDaysAgoAnime) {
      await this.addToQueue(anime);
    }
  }

  async processQueue() {
    if (!Config.anime_update_enabled) {
      logger.log('Updates disabled. Skipping queue processing.');
      return;
    }

    if (!lock.acquire('update')) {
      logger.log('Update already in progress. Skipping queue processing.');
      return;
    }

    await this.cleanupOldQueueItems();

    const queueCount = (await db.select({ count: count() }).from(updateQueue))[0]?.count ?? 0;
    logger.log(`Processing queue with ${queueCount} items...`);

    try {
      let processed = 0;
      const maxProcessPerRun = 50;

      while (processed < maxProcessPerRun) {
        const queueItem = await this.getNextFromQueue();
        if (!queueItem) break;

        logger.log(`Processing anime ID ${queueItem.animeId})`);

        const success = await this.processQueueItem(queueItem);
        if (success) {
          processed++;
          await this.removeFromQueue(queueItem.animeId);
        }

        await sleep(SLEEP_BETWEEN_UPDATES);
      }

      const remainingCount = (await db.select({ count: count() }).from(updateQueue))[0]?.count ?? 0;
      logger.log(`Processed ${processed} anime from queue. ${remainingCount} remaining.`);
    } catch (e) {
      logger.error('Failed during queue processing:', e);
    } finally {
      lock.release('update');
    }
  }

  private async processQueueItem(queueItem: QueueItem): Promise<boolean> {
    let success = false;

    try {
      await Anime.update(queueItem.animeId);
      success = true;
      logger.log(`Successfully updated anime ${queueItem.animeId}`);
    } catch (error) {
      logger.error(`Failed to update anime ${queueItem.animeId}`, error);
    }

    await this.updateQueueItem(queueItem.animeId);

    return success;
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_30_MINUTES]
  })
  async scheduleProcessQueue() {
    await this.processQueue();
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_HOUR]
  })
  async scheduleRecentAnime() {
    await this.queueRecentAnime();
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_6_HOURS]
  })
  async scheduleTodayAnime() {
    await this.queueTodayAnime();
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_12_HOURS]
  })
  async scheduleTwoDaysAgoAnime() {
    await this.queueTwoDaysAgoAnime();
  }
}

const AnimeUpdate = new AnimeUpdateModule();

export { AnimeUpdate, AnimeUpdateModule };
