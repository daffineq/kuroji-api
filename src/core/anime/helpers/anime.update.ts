import logger from 'src/helpers/logger';
import prisma from 'src/lib/prisma';
import animeUpdateFetch from './anime.update.fetch';
import { sleep } from 'bun';
import env from 'src/config/env';
import lock from 'src/helpers/lock';
import anime from '../anime';
import { EnableSchedule, Scheduled, ScheduleStrategies } from 'src/helpers/schedule';

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
const MAX_RETRIES = 3;

@EnableSchedule
class AnimeUpdate {
  private async cleanupOldQueueItems() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await prisma.updateQueue.deleteMany({
        where: {
          addedAt: {
            lt: oneDayAgo
          }
        }
      });
    } catch (e) {
      logger.error('Failed to cleanup old queue items:', e);
    }
  }

  private async addToQueue(
    anime: { id: number; idMal: number | null | undefined },
    priority: QueueItem['priority'],
    reason: QueueItem['reason']
  ) {
    try {
      const existing = await prisma.updateQueue.findUnique({
        where: { animeId: anime.id }
      });

      if (
        existing &&
        this.getReasonWeight(reason) > this.getReasonWeight(existing.reason as QueueItem['reason'])
      ) {
        await prisma.updateQueue.update({
          where: { animeId: anime.id },
          data: {
            priority,
            reason,
            addedAt: new Date(),
            updatedAt: new Date()
          }
        });
      } else if (
        existing &&
        this.getReasonWeight(reason) === this.getReasonWeight(existing.reason as QueueItem['reason']) &&
        this.getPriorityWeight(priority) > this.getPriorityWeight(existing.priority as QueueItem['priority'])
      ) {
        await prisma.updateQueue.update({
          where: { animeId: anime.id },
          data: {
            priority,
            addedAt: new Date(),
            updatedAt: new Date()
          }
        });
      } else if (!existing) {
        const queueCount = await prisma.updateQueue.count();
        if (queueCount < MAX_QUEUE_SIZE) {
          await prisma.updateQueue.create({
            data: {
              animeId: anime.id,
              malId: anime.idMal ?? null,
              priority,
              reason,
              addedAt: new Date()
            }
          });
        } else {
          logger.warn(`Queue is full (${MAX_QUEUE_SIZE}), dropping anime ${anime.id}`);
        }
      }
    } catch (e) {
      logger.error(`Failed to add anime ${anime.id} to queue:`, e);
    }
  }

  private async updateQueueItem(animeId: number, retries: number, lastError: string | null) {
    try {
      await prisma.updateQueue.update({
        where: { animeId },
        data: {
          retries,
          lastError,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error(`Failed to update queue item ${animeId} in database:`, error);
    }
  }

  private async removeFromQueue(animeId: number) {
    try {
      await prisma.updateQueue.delete({
        where: { animeId }
      });
    } catch (error) {
      logger.error(`Failed to remove queue item ${animeId} from database:`, error);
    }
  }

  async clearQueue() {
    try {
      await prisma.updateQueue.deleteMany({});
      logger.log('Queue cleared manually');
    } catch (e) {
      logger.error('Failed to clear queue:', e);
    }
  }

  async addAnimeToQueue(
    animeId: number,
    malId: number | null | undefined = undefined,
    priority: QueueItem['priority'] = 'medium'
  ) {
    await this.addToQueue({ id: animeId, idMal: malId }, priority, 'missed');
    logger.log(`Manually added anime ${animeId} to queue with ${priority} priority`);
  }

  private async addUpdateHistory(
    animeId: number,
    malId: number | null | undefined,
    success: boolean,
    errors: string[],
    duration: number,
    triggeredBy: string
  ) {
    try {
      await prisma.updateHistory.create({
        data: {
          animeId,
          malId: malId ?? null,
          success,
          duration,
          errorCount: errors.length,
          errors,
          triggeredBy
        }
      });
    } catch (e) {
      logger.error('Failed to save update history:', e);
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
      const queueItems = await prisma.updateQueue.findMany({
        orderBy: [{ priority: 'desc' }, { addedAt: 'asc' }]
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

        return a.addedAt.getTime() - b.addedAt.getTime();
      });

      const next = sorted[0];

      if (!next) return null;

      return {
        animeId: next.animeId,
        malId: next.malId ?? undefined,
        priority: next.priority as QueueItem['priority'],
        addedAt: next.addedAt.getTime(),
        reason: next.reason as QueueItem['reason']
      };
    } catch (e) {
      logger.error('Failed to get next queue item:', e);
      return null;
    }
  }

  async queueRecentAnime() {
    const recentAnime = await animeUpdateFetch.getRecentAiredAnime();
    logger.log(`Adding ${recentAnime.length} recent aired anime to queue with HIGH priority`);

    if (recentAnime.length > 0) {
      const animeWithEpisodes = recentAnime.filter((anime) => anime.airingSchedule.length > 0);
      logger.log(`Recent anime with episodes: ${animeWithEpisodes.length}/${recentAnime.length}`);
    }

    for (const anime of recentAnime) {
      await this.addToQueue(anime, 'high', 'recent');
    }
  }

  async queueTodayAnime() {
    const todayAnime = await animeUpdateFetch.getTodayAiredAnime();
    logger.log(`Adding ${todayAnime.length} today aired anime to queue`);

    for (const anime of todayAnime) {
      await this.addToQueue(anime, 'high', 'today');
    }
  }

  async queueWeekAgoAnime() {
    const weekAgoAnime = await animeUpdateFetch.getLastWeekAiredAnime();
    logger.log(`Adding ${weekAgoAnime.length} last week aired anime to queue`);

    for (const anime of weekAgoAnime) {
      await this.addToQueue(anime, 'medium', 'week_ago');
    }
  }

  async queueTwoDaysAgoAnime() {
    const twoDaysAgoAnime = await animeUpdateFetch.getDaysAgoAiredAnime(2);
    logger.log(`Adding ${twoDaysAgoAnime.length} two days ago aired anime to queue`);

    for (const anime of twoDaysAgoAnime) {
      await this.addToQueue(anime, 'medium', 'two_days_ago');
    }
  }

  async queueThreeDaysAgoAnime() {
    const threeDaysAgoAnime = await animeUpdateFetch.getDaysAgoAiredAnime(3);
    logger.log(`Adding ${threeDaysAgoAnime.length} three days ago aired anime to queue`);

    for (const anime of threeDaysAgoAnime) {
      await this.addToQueue(anime, 'medium', 'three_days_ago');
    }
  }

  async queueFinishedAnime() {
    const BATCH_SIZE = 100;
    const DELAY_BETWEEN_PAGES = 30;

    const totalCount = await animeUpdateFetch.getTotalFinishedAnimeCount();
    const totalPages = Math.ceil(totalCount / BATCH_SIZE);

    logger.log(`Processing ${totalCount} finished anime across ${totalPages} pages`);

    let currentOffset = 0;
    let pageNumber = 1;

    while (true) {
      logger.log(`Fetching page ${pageNumber}/${totalPages} (offset: ${currentOffset})`);

      const finishedAnime = await animeUpdateFetch.getFinishedAnime(BATCH_SIZE, currentOffset);

      if (finishedAnime.length === 0) {
        logger.log('No more finished anime found, done!');
        break;
      }

      logger.log(`Adding ${finishedAnime.length} finished anime to queue`);

      for (const anime of finishedAnime) {
        if (animeUpdateFetch.shouldUpdateBasedOnPopularity(anime.popularity)) {
          const priority = animeUpdateFetch.getPopularityPriority(anime.popularity);
          await this.addToQueue(anime, priority, 'finished_monthly');
        }
      }

      currentOffset += BATCH_SIZE;
      pageNumber++;

      if (finishedAnime.length < BATCH_SIZE) {
        logger.log('Reached end of finished anime');
        break;
      }

      logger.log(`Waiting ${DELAY_BETWEEN_PAGES} seconds before next page...`);
      await sleep(DELAY_BETWEEN_PAGES * 1000);
    }
  }

  async queueUpcomingAnime() {
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_PAGES = 30;

    const totalCount = await animeUpdateFetch.getTotalUpcomingAnimeCount();
    const totalPages = Math.ceil(totalCount / BATCH_SIZE);

    logger.log(`Processing ${totalCount} upcoming anime across ${totalPages} pages`);

    let currentOffset = 0;
    let pageNumber = 1;

    while (true) {
      logger.log(`Fetching page ${pageNumber}/${totalPages} (offset: ${currentOffset})`);

      const upcomingAnime = await animeUpdateFetch.getUpcomingAnime(BATCH_SIZE, currentOffset);

      if (upcomingAnime.length === 0) {
        logger.log('No more upcoming anime found, done!');
        break;
      }

      logger.log(`Adding ${upcomingAnime.length} upcoming anime to queue`);

      for (const anime of upcomingAnime) {
        if (animeUpdateFetch.shouldUpdateBasedOnPopularity(anime.popularity)) {
          const priority = animeUpdateFetch.getPopularityPriority(anime.popularity);
          await this.addToQueue(anime, priority, 'upcoming_weekly');
        }
      }

      currentOffset += BATCH_SIZE;
      pageNumber++;

      if (upcomingAnime.length < BATCH_SIZE) {
        logger.log('Reached end of upcoming anime');
        break;
      }

      logger.log(`Waiting ${DELAY_BETWEEN_PAGES} seconds before next page...`);
      await sleep(DELAY_BETWEEN_PAGES * 1000);
    }
  }

  async processQueue() {
    if (!env.ANIME_UPDATE_ENABLED) {
      logger.log('Updates disabled. Skipping queue processing.');
      return;
    }

    if (!lock.acquire('update')) {
      logger.log('Update already in progress. Skipping queue processing.');
      return;
    }

    await this.cleanupOldQueueItems();

    const queueCount = await prisma.updateQueue.count();
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

      const remainingCount = await prisma.updateQueue.count();
      logger.log(`Processed ${processed} anime from queue. ${remainingCount} remaining.`);
    } catch (e) {
      logger.error('Failed during queue processing:', e);
    } finally {
      lock.release('update');
    }
  }

  private async processQueueItem(queueItem: QueueItem): Promise<boolean> {
    let success = false;
    let retries = 0;
    let lastError: string | null = null;

    while (!success && retries < MAX_RETRIES) {
      try {
        await this.updateAnime(queueItem.animeId, queueItem.malId, queueItem.reason);
        success = true;
        logger.log(`Successfully updated anime ${queueItem.animeId} after ${retries + 1} attempts`);
      } catch (error) {
        retries++;
        lastError = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to update anime ${queueItem.animeId} (attempt ${retries}/${MAX_RETRIES}):`, error);

        if (retries < MAX_RETRIES) {
          const baseDelay = Math.min(1000 * Math.pow(2, retries), 30000);
          const jitter = Math.random() * 1000;
          await sleep(Math.floor((baseDelay + jitter) / 1000));
        }
      }
    }

    await this.updateQueueItem(queueItem.animeId, retries, lastError);

    if (!success && queueItem.priority !== 'low') {
      logger.log(`Re-queueing failed anime ${queueItem.animeId} with lower priority`);
      await this.addToQueue({ id: queueItem.animeId, idMal: queueItem.malId }, 'low', 'retry');
    }

    return success;
  }

  private async updateAnime(animeId: number, malId: number | null | undefined, triggeredBy: string = 'queue') {
    const startTime = Date.now();
    const errors: string[] = [];

    const TIMEOUT = 60000;

    try {
      async () => {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Anime timeout after ${TIMEOUT}ms`));
          }, TIMEOUT);
        });

        return Promise.race([anime.update(animeId), timeoutPromise]);
      };
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const success = errors.length === 0;

    await this.addUpdateHistory(animeId, malId, success, errors, duration, triggeredBy);

    if (!success) {
      throw new Error(`Failed for anime ${animeId}: ${errors.join(', ')}`);
    }
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
    strategies: [ScheduleStrategies.EVERY_OTHER_DAY, ScheduleStrategies.EVERY_DAY_23]
  })
  async scheduleWeeklyAnime() {
    await this.queueWeekAgoAnime();
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_OTHER_WEEK]
  })
  async scheduleUpcomingAnime() {
    await this.queueUpcomingAnime();
  }

  @Scheduled({
    strategies: [ScheduleStrategies.EVERY_MONTH_START]
  })
  async scheduleFinishedAnime() {
    await this.queueFinishedAnime();
  }
}

const animeUpdate = new AnimeUpdate();

export default animeUpdate;
