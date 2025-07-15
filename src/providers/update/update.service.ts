import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Config from '../../configs/config.js';
import { PrismaService } from '../../prisma.service.js';
import { UpdateType } from './UpdateType.js';
import { sleep } from '../../utils/utils.js';
import { AnilistService } from '../anime/anilist/service/anilist.service.js';
import { AnimekaiService } from '../anime/animekai/service/animekai.service.js';
import { AnimepaheService } from '../anime/animepahe/service/animepahe.service.js';
import { KitsuService } from '../anime/kitsu/service/kitsu.service.js';
import { ShikimoriService } from '../anime/shikimori/service/shikimori.service.js';
import { TmdbService } from '../anime/tmdb/service/tmdb.service.js';
import { TvdbService } from '../anime/tvdb/service/tvdb.service.js';
import { ZoroService } from '../anime/zoro/service/zoro.service.js';
import { AppLockService } from '../../shared/app.lock.service.js';
import { UpdateRequestsService } from './update.requests.service.js';
import { MappingsService } from '../anime/mappings/service/mappings.service.js';

export interface IProvider {
  update: (id: string | number) => Promise<any>;
  type: UpdateType;
}

export interface QueueItem {
  animeId: number;
  malId: number | null | undefined;
  priority: 'high' | 'medium' | 'low';
  addedAt: number;
  reason:
    | 'recent'
    | 'today'
    | 'week_ago'
    | 'missed'
    | 'finished_monthly'
    | 'upcoming_weekly'
    | 'status_change'
    | 'retry';
}

const SLEEP_BETWEEN_UPDATES = 30;
const MAX_QUEUE_SIZE = 1000;
const MAX_RETRIES = 3;

const streaming = [
  UpdateType.ANIMEKAI,
  UpdateType.ANIMEPAHE,
  UpdateType.ANIWATCH,
];

@Injectable()
export class UpdateService {
  private readonly providers: IProvider[];
  private updateQueue: Map<number, QueueItem> = new Map();

  constructor(
    private readonly anilistService: AnilistService,
    private readonly animekaiService: AnimekaiService,
    private readonly zoroService: ZoroService,
    private readonly animepaheService: AnimepaheService,
    private readonly shikimoriService: ShikimoriService,
    private readonly tmdbService: TmdbService,
    private readonly tvdbService: TvdbService,
    private readonly kitsuService: KitsuService,
    private readonly anizip: MappingsService,
    private readonly lock: AppLockService,
    private readonly requests: UpdateRequestsService,
    private readonly prisma: PrismaService,
  ) {
    this.providers = [
      {
        update: (id: any) => this.anilistService.update(Number(id)),
        type: UpdateType.ANILIST,
      },
      {
        update: (id: any) => this.animekaiService.update(Number(id)),
        type: UpdateType.ANIMEKAI,
      },
      {
        update: (id: any) => this.animepaheService.update(Number(id)),
        type: UpdateType.ANIMEPAHE,
      },
      {
        update: (id: any) => this.zoroService.update(Number(id)),
        type: UpdateType.ANIWATCH,
      },
      {
        update: (id: any) => this.shikimoriService.update(String(id)),
        type: UpdateType.SHIKIMORI,
      },
      {
        update: (id: any) => this.tmdbService.updateByAnilist(Number(id)),
        type: UpdateType.TMDB,
      },
      {
        update: (id: any) => this.tvdbService.update(Number(id)),
        type: UpdateType.TVDB,
      },
      {
        update: (id: any) => this.kitsuService.updateByAnilist(Number(id)),
        type: UpdateType.KITSU,
      },
      {
        update: (id: any) => this.anizip.update(Number(id)),
        type: UpdateType.ANIZIP,
      },
    ];

    void this.loadQueueFromDB();
  }

  private async loadQueueFromDB() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await this.prisma.updateQueue.deleteMany({
        where: {
          addedAt: {
            lt: oneDayAgo,
          },
        },
      });

      const queueItems = await this.prisma.updateQueue.findMany({
        orderBy: [{ priority: 'desc' }, { addedAt: 'asc' }],
      });

      this.updateQueue = new Map(
        queueItems.map((item) => [
          item.animeId,
          {
            animeId: item.animeId,
            malId: item.malId ?? undefined,
            priority: item.priority as QueueItem['priority'],
            addedAt: item.addedAt.getTime(),
            reason: item.reason as QueueItem['reason'],
          },
        ]),
      );

      console.log(
        `[UpdateService] Loaded ${this.updateQueue.size} items from queue`,
      );
    } catch (e) {
      console.error('[UpdateService] Failed to load queue from DB:', e);
      this.updateQueue = new Map();
    }
  }

  private async saveQueueToDB() {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const currentAnimeIds = Array.from(this.updateQueue.keys());
        if (currentAnimeIds.length > 0) {
          await prisma.updateQueue.deleteMany({
            where: {
              animeId: {
                notIn: currentAnimeIds,
              },
            },
          });
        } else {
          await prisma.updateQueue.deleteMany({});
        }

        const queueArray = Array.from(this.updateQueue.values());
        for (const item of queueArray) {
          await prisma.updateQueue.upsert({
            where: { animeId: item.animeId },
            update: {
              priority: item.priority,
              reason: item.reason,
              updatedAt: new Date(),
            },
            create: {
              animeId: item.animeId,
              malId: item.malId ?? null,
              priority: item.priority,
              reason: item.reason,
              addedAt: new Date(item.addedAt),
            },
          });
        }
      });
    } catch (e) {
      console.error('[UpdateService] Failed to save queue to DB:', e);
    }
  }

  private addToQueue(
    anime: { id: number; idMal: number | null | undefined },
    priority: QueueItem['priority'],
    reason: QueueItem['reason'],
  ) {
    const existing = this.updateQueue.get(anime.id);

    if (
      existing &&
      this.getReasonWeight(reason) > this.getReasonWeight(existing.reason)
    ) {
      existing.priority = priority;
      existing.reason = reason;
      existing.addedAt = Date.now();
    } else if (
      existing &&
      this.getReasonWeight(reason) === this.getReasonWeight(existing.reason) &&
      this.getPriorityWeight(priority) >
        this.getPriorityWeight(existing.priority)
    ) {
      existing.priority = priority;
      existing.addedAt = Date.now();
    } else if (!existing) {
      if (this.updateQueue.size < MAX_QUEUE_SIZE) {
        this.updateQueue.set(anime.id, {
          animeId: anime.id,
          malId: anime.idMal ?? undefined,
          priority,
          addedAt: Date.now(),
          reason,
        });
      } else {
        console.warn(
          `[UpdateService] Queue is full (${MAX_QUEUE_SIZE}), dropping anime ${anime.id}`,
        );
      }
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

  private getNextFromQueue(): QueueItem | null {
    if (this.updateQueue.size === 0) return null;

    const sorted = Array.from(this.updateQueue.values()).sort((a, b) => {
      const reasonDiff =
        this.getReasonWeight(b.reason) - this.getReasonWeight(a.reason);
      if (reasonDiff !== 0) return reasonDiff;

      const priorityDiff =
        this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
      if (priorityDiff !== 0) return priorityDiff;

      return a.addedAt - b.addedAt;
    });

    const next = sorted[0];
    this.updateQueue.delete(next.animeId);
    return next;
  }

  async queueRecentAnime() {
    const recentAnime = await this.requests.getRecentAiredAnime();
    console.log(
      `[UpdateService] Adding ${recentAnime.length} recent aired anime to queue with HIGH priority`,
    );

    for (const anime of recentAnime) {
      this.addToQueue(anime, 'high', 'recent');
    }

    await this.saveQueueToDB();
  }

  async queueTodayAnime() {
    const todayAnime = await this.requests.getTodayAiredAnime();
    console.log(
      `[UpdateService] Adding ${todayAnime.length} today aired anime to queue`,
    );

    for (const anime of todayAnime) {
      this.addToQueue(anime, 'high', 'today');
    }

    await this.saveQueueToDB();
  }

  async queueWeekAgoAnime() {
    const weekAgoAnime = await this.requests.getWeekAgoAiredAnime();
    console.log(
      `[UpdateService] Adding ${weekAgoAnime.length} week-ago aired anime to queue`,
    );

    for (const anime of weekAgoAnime) {
      this.addToQueue(anime, 'medium', 'week_ago');
    }

    await this.saveQueueToDB();
  }

  async queueFinishedAnime() {
    const finishedAnime = await this.requests.getFinishedAnime();
    console.log(
      `[UpdateService] Adding ${finishedAnime.length} finished anime to queue for monthly update`,
    );

    for (const anime of finishedAnime) {
      if (this.requests.shouldUpdateBasedOnPopularity(anime.popularity)) {
        const priority = this.requests.getPopularityPriority(anime.popularity);
        this.addToQueue(anime, priority, 'finished_monthly');
      }
    }

    await this.saveQueueToDB();
  }

  async queueUpcomingAnime() {
    const upcomingAnime = await this.requests.getUpcomingAnime();
    console.log(
      `[UpdateService] Adding ${upcomingAnime.length} upcoming anime to queue for weekly update`,
    );

    for (const anime of upcomingAnime) {
      if (this.requests.shouldUpdateBasedOnPopularity(anime.popularity)) {
        const priority = this.requests.getPopularityPriority(anime.popularity);
        this.addToQueue(anime, priority, 'upcoming_weekly');
      }
    }

    await this.saveQueueToDB();
  }

  async processQueue() {
    if (!Config.UPDATE_ENABLED) {
      console.log(
        '[UpdateService] Updates disabled. Skipping queue processing.',
      );
      return;
    }

    if (!this.lock.acquire(Config.UPDATE_RUNNING_KEY)) {
      console.log(
        '[UpdateService] Update already in progress. Skipping queue processing.',
      );
      return;
    }

    console.log(
      `[UpdateService] Processing queue with ${this.updateQueue.size} items...`,
    );

    try {
      let processed = 0;
      const maxProcessPerRun = 50;

      while (this.updateQueue.size > 0 && processed < maxProcessPerRun) {
        const queueItem = this.getNextFromQueue();
        if (!queueItem) break;

        console.log(
          `[UpdateService] Processing anime ID ${queueItem.animeId} (${queueItem.reason}, ${queueItem.priority} priority)`,
        );

        const success = await this.processQueueItem(queueItem);
        if (success) {
          processed++;
          await this.removeFromDBQueue(queueItem.animeId);
        }

        await sleep(SLEEP_BETWEEN_UPDATES);
      }

      console.log(
        `[UpdateService] Processed ${processed} anime from queue. ${this.updateQueue.size} remaining.`,
      );
      await this.saveQueueToDB();
    } catch (e) {
      console.error('[UpdateService] Failed during queue processing:', e);
    } finally {
      this.lock.release(Config.UPDATE_RUNNING_KEY);
    }
  }

  private async processQueueItem(queueItem: QueueItem): Promise<boolean> {
    let success = false;
    let retries = 0;
    let lastError: string | null = null;

    while (!success && retries < MAX_RETRIES) {
      try {
        await this.updateAnime(
          queueItem.animeId,
          queueItem.malId,
          queueItem.reason,
        );
        success = true;
        console.log(
          `[UpdateService] Successfully updated anime ${queueItem.animeId} after ${retries + 1} attempts`,
        );
      } catch (error) {
        retries++;
        lastError = error instanceof Error ? error.message : String(error);
        console.error(
          `[UpdateService] Failed to update anime ${queueItem.animeId} (attempt ${retries}/${MAX_RETRIES}):`,
          error,
        );

        if (retries < MAX_RETRIES) {
          const baseDelay = Math.min(1000 * Math.pow(2, retries), 30000);
          const jitter = Math.random() * 1000;
          await sleep(Math.floor((baseDelay + jitter) / 1000));
        }
      }
    }

    await this.updateDBQueueItem(queueItem.animeId, retries, lastError);

    if (!success && queueItem.priority !== 'low') {
      console.log(
        `[UpdateService] Re-queueing failed anime ${queueItem.animeId} with lower priority`,
      );
      this.addToQueue(
        { id: queueItem.animeId, idMal: queueItem.malId },
        'low',
        'retry',
      );
    }

    return success;
  }

  private async updateDBQueueItem(
    animeId: number,
    retries: number,
    lastError: string | null,
  ) {
    try {
      await this.prisma.updateQueue.update({
        where: { animeId },
        data: {
          retries,
          lastError,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(
        `[UpdateService] Failed to update queue item ${animeId} in database:`,
        error,
      );
    }
  }

  private async removeFromDBQueue(animeId: number) {
    try {
      await this.prisma.updateQueue.delete({
        where: { animeId },
      });
    } catch (error) {
      console.error(
        `[UpdateService] Failed to remove queue item ${animeId} from database:`,
        error,
      );
    }
  }

  private async addUpdateHistory(
    animeId: number,
    malId: number | null | undefined,
    success: boolean,
    providers: string[],
    errors: string[],
    duration: number,
    triggeredBy: string,
  ) {
    try {
      await this.prisma.updateHistory.create({
        data: {
          animeId,
          malId: malId ?? null,
          providers,
          success,
          duration,
          errorCount: errors.length,
          errors,
          triggeredBy,
        },
      });
    } catch (e) {
      console.error('[UpdateService] Failed to save update history:', e);
    }
  }

  private async updateAnime(
    animeId: number,
    malId: number | null | undefined,
    triggeredBy: string = 'queue',
  ) {
    const startTime = Date.now();
    const completedProviders: string[] = [];
    const errors: string[] = [];
    const PROVIDER_TIMEOUT = 60000; // 60 seconds timeout per provider

    for (const provider of this.providers) {
      try {
        const providerName = UpdateType[provider.type];

        if (streaming.includes(provider.type)) {
          if (
            (provider.type === UpdateType.ANIMEKAI &&
              !Config.ANIMEKAI_ENABLED) ||
            (provider.type === UpdateType.ANIMEPAHE &&
              !Config.ANIMEPAHE_ENABLED) ||
            (provider.type === UpdateType.ANIWATCH && !Config.ZORO_ENABLED)
          ) {
            console.log(
              `[${providerName}] Skipped (provider disabled in config)`,
            );
            continue;
          }
        }

        const updateWithTimeout = async () => {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Provider timeout after ${PROVIDER_TIMEOUT}ms`));
            }, PROVIDER_TIMEOUT);
          });

          if (provider.type === UpdateType.SHIKIMORI) {
            if (malId) {
              console.log(`[${providerName}] Updating with MAL ID ${malId}...`);
              return Promise.race([provider.update(malId), timeoutPromise]);
            } else {
              console.log(`[${providerName}] Skipped (no MAL ID)`);
              return Promise.resolve();
            }
          } else {
            console.log(
              `[${providerName}] Updating with AniList ID ${animeId}...`,
            );
            return Promise.race([provider.update(animeId), timeoutPromise]);
          }
        };

        await updateWithTimeout();

        if (provider.type === UpdateType.SHIKIMORI && !malId) {
          // Skip adding to completed providers if no MAL ID
        } else {
          console.log(`[${providerName}] Success`);
          completedProviders.push(providerName);
        }
      } catch (providerErr) {
        const isTimeout = providerErr.message.includes('timeout');
        const errorMsg = `${UpdateType[provider.type]} failed: ${providerErr.message}`;

        console.error(
          `[${UpdateType[provider.type]}] Failed to update${isTimeout ? ' (timeout)' : ''}:`,
          providerErr,
        );
        errors.push(errorMsg);

        if (isTimeout) {
          console.log('Shorter delay due to timeout...');
          await sleep(1, false);
        }
      }

      if (provider !== this.providers[this.providers.length - 1]) {
        const sleep_time = streaming.includes(provider.type)
          ? SLEEP_BETWEEN_UPDATES / 3
          : SLEEP_BETWEEN_UPDATES;

        console.log(`Sleeping ${sleep_time}s before next provider...`);
        await sleep(sleep_time, false);
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const success = completedProviders.length > 0;

    await this.addUpdateHistory(
      animeId,
      malId,
      success,
      completedProviders,
      errors,
      duration,
      triggeredBy,
    );

    if (!success) {
      throw new Error(
        `All providers failed for anime ${animeId}: ${errors.join(', ')}`,
      );
    }
  }

  // Every 30 minutes
  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduleRecentAnime() {
    console.log(
      '[UpdateService] Every 30 minutes - queueing recent aired anime with HIGHEST priority',
    );
    await this.queueRecentAnime();
  }

  // Every day at midnight London time
  @Cron('0 0 * * *', { timeZone: 'Europe/London' })
  async scheduleTodayAnime() {
    console.log(
      "[UpdateService] Midnight in London - queueing today's aired anime",
    );
    await this.queueTodayAnime();
  }

  // Every 3 days at 1 AM London time
  @Cron('0 1 */3 * *', { timeZone: 'Europe/London' })
  async scheduleWeekAgoAnime() {
    console.log('[UpdateService] Every 3 days - queueing week-ago aired anime');
    await this.queueWeekAgoAnime();
  }

  // Monthly finished anime update - 1st of every month at 2 AM London time
  @Cron('0 2 1 * *', { timeZone: 'Europe/London' })
  async scheduleFinishedAnime() {
    console.log(
      '[UpdateService] Monthly - queueing finished anime for updates',
    );
    await this.queueFinishedAnime();
  }

  // Weekly upcoming anime update - Every Sunday at 3 AM London time
  @Cron('0 3 * * 0', { timeZone: 'Europe/London' })
  async scheduleUpcomingAnime() {
    console.log('[UpdateService] Weekly - queueing upcoming anime for updates');
    await this.queueUpcomingAnime();
  }

  // Every 30 minutes - proccessing all entries in queue
  @Cron(CronExpression.EVERY_30_MINUTES)
  async processUpdateQueue() {
    await this.processQueue();
  }

  getQueueStatus() {
    const queueItems = Array.from(this.updateQueue.values());
    const priorityCounts = {
      high: queueItems.filter((item) => item.priority === 'high').length,
      medium: queueItems.filter((item) => item.priority === 'medium').length,
      low: queueItems.filter((item) => item.priority === 'low').length,
    };

    const reasonCounts = {
      recent: queueItems.filter((item) => item.reason === 'recent').length,
      today: queueItems.filter((item) => item.reason === 'today').length,
      week_ago: queueItems.filter((item) => item.reason === 'week_ago').length,
      missed: queueItems.filter((item) => item.reason === 'missed').length,
      finished_monthly: queueItems.filter(
        (item) => item.reason === 'finished_monthly',
      ).length,
      upcoming_weekly: queueItems.filter(
        (item) => item.reason === 'upcoming_weekly',
      ).length,
      status_change: queueItems.filter(
        (item) => item.reason === 'status_change',
      ).length,
    };

    return {
      totalItems: this.updateQueue.size,
      priorityCounts,
      reasonCounts,
      oldestItem:
        queueItems.length > 0
          ? Math.min(...queueItems.map((item) => item.addedAt))
          : null,
    };
  }

  async clearQueue() {
    this.updateQueue.clear();
    await this.saveQueueToDB();
    console.log('[UpdateService] Queue cleared manually');
  }

  async addAnimeToQueue(
    animeId: number,
    malId: number | null | undefined = undefined,
    priority: QueueItem['priority'] = 'medium',
  ) {
    this.addToQueue({ id: animeId, idMal: malId }, priority, 'missed');
    await this.saveQueueToDB();
    console.log(
      `[UpdateService] Manually added anime ${animeId} to queue with ${priority} priority`,
    );
  }
}
