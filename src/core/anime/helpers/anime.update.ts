import logger from 'src/helpers/logger';
import { sleep } from 'bun';
import { Config } from 'src/config/config';
import lock from 'src/helpers/lock';
import { EnableSchedule, Scheduled, ScheduleStrategies } from 'src/helpers/schedule';
import { AnimeUpdateFetch } from './anime.update.fetch';
import { Anime } from '../anime';
import { Module } from 'src/helpers/module';
import { db, updateQueue } from 'src/db';
import { count, eq, lt } from 'drizzle-orm';

export interface QueueItem {
  animeId: number;
  malId: number | null | undefined;
  priority: 'high' | 'medium' | 'low';
  addedAt: number;
  reason:
    | 'recent'
    | 'today'
    | 'two_days_ago'
    | 'three_days_ago'
    | 'week_ago'
    | 'missed'
    | 'finished_monthly'
    | 'upcoming_weekly'
    | 'status_change'
    | 'retry';
}

const SLEEP_BETWEEN_UPDATES = 10;
const MAX_QUEUE_SIZE = 1000;

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

  private async addToQueue(
    anime: { id: number; id_mal: number | null | undefined },
    priority: QueueItem['priority'],
    reason: QueueItem['reason']
  ) {
    try {
      const existing = await db.query.updateQueue.findFirst({
        where: {
          anime_id: anime.id
        }
      });

      if (
        existing &&
        this.getReasonWeight(reason) > this.getReasonWeight(existing.reason as QueueItem['reason'])
      ) {
        await db
          .update(updateQueue)
          .set({
            priority,
            reason,
            added_at: new Date(),
            updated_at: new Date()
          })
          .where(eq(updateQueue.anime_id, anime.id));
      } else if (
        existing &&
        this.getReasonWeight(reason) === this.getReasonWeight(existing.reason as QueueItem['reason']) &&
        this.getPriorityWeight(priority) > this.getPriorityWeight(existing.priority as QueueItem['priority'])
      ) {
        await db
          .update(updateQueue)
          .set({
            priority,
            added_at: new Date(),
            updated_at: new Date()
          })
          .where(eq(updateQueue.anime_id, anime.id));
      } else if (!existing) {
        const queueCount = (await db.select({ count: count() }).from(updateQueue))[0]?.count ?? 0;
        if (queueCount < MAX_QUEUE_SIZE) {
          await db
            .insert(updateQueue)
            .values({
              anime_id: anime.id,
              mal_id: anime.id_mal ?? null,
              priority,
              reason,
              added_at: new Date()
            })
            .onConflictDoNothing({ target: updateQueue.anime_id });
        } else {
          logger.warn(`Queue is full (${MAX_QUEUE_SIZE}), dropping anime ${anime.id}`);
        }
      }
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

  private getPriorityWeight(priority: QueueItem['priority']): number {
    switch (priority) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  }

  private getReasonWeight(reason: QueueItem['reason']): number {
    switch (reason) {
      case 'recent':
        return 7; // Highest priority - just aired within hours
      case 'today':
        return 6; // High priority - aired today
      case 'upcoming_weekly':
        return 5; // Weekly upcoming anime updates
      case 'status_change':
        return 4; // Status changes (released, finished, etc.)
      case 'week_ago':
        return 3; // Medium priority - aired a week ago
      case 'finished_monthly':
        return 2; // Monthly finished anime updates
      case 'missed':
        return 1; // Low priority - failed updates or manual additions
      default:
        return 0;
    }
  }

  private async getNextFromQueue(): Promise<QueueItem | null> {
    try {
      const queueItems = await db.query.updateQueue.findMany({
        orderBy: (updateQueue, { desc, asc }) => [desc(updateQueue.priority), asc(updateQueue.added_at)]
      });

      if (queueItems.length === 0) return null;

      const sorted = queueItems.sort((a, b) => {
        const reasonDiff =
          this.getReasonWeight(b.reason as QueueItem['reason']) -
          this.getReasonWeight(a.reason as QueueItem['reason']);
        if (reasonDiff !== 0) return reasonDiff;

        const priorityDiff =
          this.getPriorityWeight(b.priority as QueueItem['priority']) -
          this.getPriorityWeight(a.priority as QueueItem['priority']);
        if (priorityDiff !== 0) return priorityDiff;

        return a.added_at.getTime() - b.added_at.getTime();
      });

      const next = sorted[0];

      if (!next) return null;

      return {
        animeId: next.anime_id,
        malId: next.mal_id ?? undefined,
        priority: next.priority as QueueItem['priority'],
        addedAt: next.added_at.getTime(),
        reason: next.reason as QueueItem['reason']
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
      await this.addToQueue(anime, 'high', 'recent');
    }
  }

  async queueTodayAnime() {
    const todayAnime = await AnimeUpdateFetch.getTodayAiredAnime();
    logger.log(`Adding ${todayAnime.length} today aired anime to queue`);

    for (const anime of todayAnime) {
      await this.addToQueue(anime, 'high', 'today');
    }
  }

  async queueWeekAgoAnime() {
    const weekAgoAnime = await AnimeUpdateFetch.getLastWeekAiredAnime();
    logger.log(`Adding ${weekAgoAnime.length} last week aired anime to queue`);

    for (const anime of weekAgoAnime) {
      await this.addToQueue(anime, 'medium', 'week_ago');
    }
  }

  async queueTwoDaysAgoAnime() {
    const twoDaysAgoAnime = await AnimeUpdateFetch.getDaysAgoAiredAnime(2);
    logger.log(`Adding ${twoDaysAgoAnime.length} two days ago aired anime to queue`);

    for (const anime of twoDaysAgoAnime) {
      await this.addToQueue(anime, 'medium', 'two_days_ago');
    }
  }

  async queueThreeDaysAgoAnime() {
    const threeDaysAgoAnime = await AnimeUpdateFetch.getDaysAgoAiredAnime(3);
    logger.log(`Adding ${threeDaysAgoAnime.length} three days ago aired anime to queue`);

    for (const anime of threeDaysAgoAnime) {
      await this.addToQueue(anime, 'medium', 'three_days_ago');
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

        logger.log(
          `Processing anime ID ${queueItem.animeId} (${queueItem.reason}, ${queueItem.priority} priority)`
        );

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
