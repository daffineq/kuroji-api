import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Config from '../../configs/config';
import { PrismaService } from '../../prisma.service';
import { UpdateType } from './UpdateType';
import { sleep } from '../../utils/utils';
import { AnilistService } from '../anime/anilist/service/anilist.service';
import { AnimekaiService } from '../anime/animekai/service/animekai.service';
import { AnimepaheService } from '../anime/animepahe/service/animepahe.service';
import { KitsuService } from '../anime/kitsu/service/kitsu.service';
import { ShikimoriService } from '../anime/shikimori/service/shikimori.service';
import { TmdbService } from '../anime/tmdb/service/tmdb.service';
import { TvdbService } from '../anime/tvdb/service/tvdb.service';
import { ZoroService } from '../anime/zoro/service/zoro.service';
import { AppLockService } from '../../shared/app.lock.service';

interface IProvider {
  update: (id: string | number) => Promise<any>;
  type: UpdateType;
}

interface QueueItem {
  animeId: number;
  malId: number | null | undefined;
  priority: 'high' | 'medium' | 'low';
  addedAt: number;
  reason: 'recent' | 'today' | 'week_ago' | 'missed';
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
    private readonly lock: AppLockService,
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
        update: (id: any) => this.tvdbService.updateByAnilist(Number(id)),
        type: UpdateType.TVDB,
      },
      {
        update: (id: any) => this.kitsuService.updateByAnilist(Number(id)),
        type: UpdateType.KITSU,
      },
    ];

    void this.loadQueueFromDB();
  }

  private async loadQueueFromDB() {
    try {
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
    }
  }

  private async saveQueueToDB() {
    try {
      await this.prisma.updateQueue.deleteMany({});

      const queueArray = Array.from(this.updateQueue.values());
      if (queueArray.length > 0) {
        await this.prisma.updateQueue.createMany({
          data: queueArray.map((item) => ({
            animeId: item.animeId,
            malId: item.malId ?? null,
            priority: item.priority,
            reason: item.reason,
            addedAt: new Date(item.addedAt),
          })),
        });
      }
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
        return 4; // Highest priority - just aired within hours
      case 'today':
        return 3; // High priority - aired today
      case 'week_ago':
        return 2; // Medium priority - aired a week ago
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

  async getRecentAiredAnime(hoursBack: number = 2) {
    const londonNow = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/London',
    });
    const today = new Date(londonNow);
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const now = Math.floor(startOfDay.getTime() / 1000);
    const startTime = now - hoursBack * 60 * 60;

    const todayAired = await this.prisma.anilist.findMany({
      where: {
        airingSchedule: {
          some: {
            airingAt: {
              gte: startTime,
              lte: now,
            },
          },
        },
      },
      select: {
        id: true,
        idMal: true,
      },
      orderBy: {
        trending: 'desc',
      },
    });

    return todayAired;
  }

  async getTodayAiredAnime() {
    const londonNow = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/London',
    });
    const today = new Date(londonNow);
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

    const todayAired = await this.prisma.anilist.findMany({
      where: {
        airingSchedule: {
          some: {
            airingAt: {
              gte: startTimestamp,
              lte: endTimestamp,
            },
          },
        },
      },
      select: {
        id: true,
        idMal: true,
      },
      orderBy: {
        trending: 'desc',
      },
    });

    return todayAired;
  }

  async getWeekAgoAiredAnime() {
    const londonNow = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/London',
    });
    const weekAgo = new Date(londonNow);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const startOfDay = new Date(
      weekAgo.getFullYear(),
      weekAgo.getMonth(),
      weekAgo.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

    const weekAgoAired = await this.prisma.anilist.findMany({
      where: {
        airingSchedule: {
          some: {
            airingAt: {
              gte: startTimestamp,
              lte: endTimestamp,
            },
          },
        },
      },
      select: {
        id: true,
        idMal: true,
      },
      orderBy: {
        trending: 'desc',
      },
    });

    return weekAgoAired;
  }

  async queueRecentAnime() {
    const recentAnime = await this.getRecentAiredAnime();
    console.log(
      `[UpdateService] Adding ${recentAnime.length} recent aired anime to queue with PRIORITY status`,
    );

    for (const anime of recentAnime) {
      this.addToQueue(anime, 'high', 'recent');
    }

    await this.saveQueueToDB();
  }

  async queueTodayAnime() {
    const todayAnime = await this.getTodayAiredAnime();
    console.log(
      `[UpdateService] Adding ${todayAnime.length} today aired anime to queue`,
    );

    for (const anime of todayAnime) {
      this.addToQueue(anime, 'high', 'today');
    }

    await this.saveQueueToDB();
  }

  async queueWeekAgoAnime() {
    const weekAgoAnime = await this.getWeekAgoAiredAnime();
    console.log(
      `[UpdateService] Adding ${weekAgoAnime.length} week-ago aired anime to queue`,
    );

    for (const anime of weekAgoAnime) {
      this.addToQueue(anime, 'medium', 'week_ago');
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

    if (this.lock.isLocked(Config.INDEXER_RUNNING_KEY)) {
      console.log(
        '[UpdateService] Indexer is running. Skipping queue processing.',
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

        let success = false;
        let retries = 0;

        while (!success && retries < MAX_RETRIES) {
          try {
            await this.updateAnimeWithAllProviders(
              queueItem.animeId,
              queueItem.malId,
              queueItem.reason,
            );
            success = true;
            processed++;
          } catch (error) {
            retries++;
            console.error(
              `[UpdateService] Failed to update anime ${queueItem.animeId} (attempt ${retries}/${MAX_RETRIES}):`,
              error,
            );

            if (retries < MAX_RETRIES) {
              await sleep(10);
            }
          }
        }

        if (!success && queueItem.priority !== 'low') {
          console.log(
            `[UpdateService] Re-queueing failed anime ${queueItem.animeId} with lower priority`,
          );
          this.addToQueue(
            { id: queueItem.animeId, idMal: queueItem.malId },
            'low',
            'missed',
          );
        }

        await sleep(5);
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

  private async updateAnimeWithAllProviders(
    animeId: number,
    malId: number | null | undefined,
    triggeredBy: string = 'queue',
  ) {
    const startTime = Date.now();
    const completedProviders: string[] = [];
    const errors: string[] = [];

    for (const provider of this.providers) {
      try {
        const providerName = UpdateType[provider.type];

        if (provider.type === UpdateType.SHIKIMORI) {
          if (malId) {
            console.log(`[${providerName}] Updating with MAL ID ${malId}...`);
            await provider.update(malId);
            console.log(`[${providerName}] Success`);
            completedProviders.push(providerName);
          } else {
            console.log(`[${providerName}] Skipped (no MAL ID)`);
          }
        } else {
          console.log(
            `[${providerName}] Updating with AniList ID ${animeId}...`,
          );
          await provider.update(animeId);
          console.log(`[${providerName}] Success`);
          completedProviders.push(providerName);
        }
      } catch (providerErr) {
        const errorMsg = `${UpdateType[provider.type]} failed: ${providerErr.message}`;
        console.error(
          `[${UpdateType[provider.type]}] Failed to update:`,
          providerErr,
        );
        errors.push(errorMsg);
      }

      const sleep_time = streaming.includes(provider.type)
        ? SLEEP_BETWEEN_UPDATES / 3
        : SLEEP_BETWEEN_UPDATES;

      console.log(`Sleeping ${sleep_time}s before next provider...`);
      await sleep(sleep_time);
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const success = completedProviders.length > 0; // Success if at least one provider worked

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
