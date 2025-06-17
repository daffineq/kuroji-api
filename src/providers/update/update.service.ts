import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LastUpdated } from '@prisma/client';
import Config from '../../configs/config';
import { PrismaService } from '../../prisma.service';
import { UpdateType } from './UpdateType';
import { sleep } from '../../utils/utils';
import { AnilistService } from '../anime/anilist/service/anilist.service';
import { AnilistWithRelations } from '../anime/anilist/types/types';
import { AnimekaiService } from '../anime/animekai/service/animekai.service';
import { AnimepaheService } from '../anime/animepahe/service/animepahe.service';
import { KitsuService } from '../anime/kitsu/service/kitsu.service';
import { ShikimoriService } from '../anime/shikimori/service/shikimori.service';
import { TmdbService } from '../anime/tmdb/service/tmdb.service';
import { TmdbStatus } from '../anime/tmdb/types/types';
import { TvdbService } from '../anime/tvdb/service/tvdb.service';
import { ZoroService } from '../anime/zoro/service/zoro.service';
import { MediaStatus } from '../anime/anilist/filter/Filter';
import { ETvdbStatus } from '../anime/tvdb/types/types';
import { AppLockService } from '../../shared/app.lock.service';

interface IProvider {
  update: (id: string | number) => Promise<any>;
  type: UpdateType;
}

export interface LastUpdateResponse {
  entityId: string;
  externalId: number | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  temperature: string;
}

export enum Temperature {
  AIRING_NOW,
  AIRING_TODAY,
  HOT,
  WARM,
  COLD,
  UNKNOWN,
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const SLEEP_BETWEEN_UPDATES = 25;

const PRIORITY_LIMITS = {
  [Temperature.AIRING_NOW]: 200, // Check more frequently
  [Temperature.AIRING_TODAY]: 150,
  [Temperature.HOT]: 100,
  [Temperature.WARM]: 50,
  [Temperature.COLD]: 25, // Check less frequently
  [Temperature.UNKNOWN]: 10,
};

enum UpdateInterval {
  MINUTE_5 = 5 * 60 * 1000,
  MINUTE_10 = 10 * 60 * 1000,
  MINUTE_15 = 15 * 60 * 1000,
  MINUTE_30 = 30 * 60 * 1000,
  HOUR_1 = 1 * ONE_HOUR_MS,
  HOUR_3 = 3 * ONE_HOUR_MS,
  HOUR_6 = 6 * ONE_HOUR_MS,
  HOUR_9 = 9 * ONE_HOUR_MS,
  HOUR_12 = 12 * ONE_HOUR_MS,
  DAY_1 = 1 * 24 * ONE_HOUR_MS,
  DAY_2 = 2 * 24 * ONE_HOUR_MS,
  DAY_3 = 3 * 24 * ONE_HOUR_MS,
  DAY_5 = 5 * 24 * ONE_HOUR_MS,
  DAY_7 = 7 * 24 * ONE_HOUR_MS,
  DAY_14 = 14 * 24 * ONE_HOUR_MS,
  DAY_28 = 28 * 24 * ONE_HOUR_MS,
}

const meta = [
  UpdateType.ANILIST,
  UpdateType.SHIKIMORI,
  UpdateType.KITSU,
  UpdateType.TVDB,
];

const streaming = [
  UpdateType.ANIWATCH,
  UpdateType.ANIMEPAHE,
  UpdateType.ANIMEKAI,
];

@Injectable()
export class UpdateService {
  private readonly providers: IProvider[];

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
        update: (id: any) => this.animekaiService.update(String(id)),
        type: UpdateType.ANIMEKAI,
      },
      {
        update: (id: any) => this.animepaheService.update(String(id)),
        type: UpdateType.ANIMEPAHE,
      },
      {
        update: (id: any) => this.zoroService.update(String(id)),
        type: UpdateType.ANIWATCH,
      },
      {
        update: (id: any) => this.shikimoriService.update(String(id)),
        type: UpdateType.SHIKIMORI,
      },
      {
        update: (id: any) => this.tmdbService.update(Number(id)),
        type: UpdateType.TMDB,
      },
      {
        update: (id: any) => this.tvdbService.update(Number(id)),
        type: UpdateType.TVDB,
      },
      {
        update: (id: any) => this.kitsuService.updateKitsu(String(id)),
        type: UpdateType.KITSU,
      },
    ];
  }

  private static getRandomInterval(base: number, variation: number): number {
    const min = base - base * variation;
    const max = base + base * variation;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static getUpdateInterval(
    temperature: Temperature,
    type: UpdateType,
  ): number {
    const variation = 0.2;

    switch (temperature) {
      case Temperature.AIRING_NOW:
        return this.getRandomInterval(UpdateInterval.MINUTE_15, variation);
      case Temperature.AIRING_TODAY:
        return this.getRandomInterval(UpdateInterval.HOUR_1, variation);
      case Temperature.HOT:
        return meta.includes(type)
          ? this.getRandomInterval(UpdateInterval.DAY_1, variation)
          : this.getRandomInterval(UpdateInterval.HOUR_12, variation);
      case Temperature.WARM:
        return meta.includes(type)
          ? this.getRandomInterval(UpdateInterval.DAY_7, variation)
          : this.getRandomInterval(UpdateInterval.DAY_3, variation);
      case Temperature.COLD:
      case Temperature.UNKNOWN:
      default:
        return meta.includes(type)
          ? this.getRandomInterval(UpdateInterval.DAY_28, variation)
          : this.getRandomInterval(UpdateInterval.DAY_14, variation);
    }
  }

  private async getStoredTemperature(
    lastUpdated: LastUpdated,
  ): Promise<Temperature> {
    const temperature = await this.prisma.updateTemperature.findFirst({
      where: { id: lastUpdated.id },
    });

    if (temperature != null) {
      return Temperature[temperature.temperature as keyof typeof Temperature];
    }

    return Temperature.UNKNOWN;
  }

  private async getHighPriorityUpdates(
    type: UpdateType,
    maxItems: number = 500,
  ): Promise<LastUpdated[]> {
    const now = new Date();

    // Priority 1: AIRING_NOW items (updated more than 15 minutes ago)
    const airingNow = await this.prisma.lastUpdated.findMany({
      where: {
        type,
        updatedAt: {
          lt: new Date(now.getTime() - UpdateInterval.MINUTE_15),
        },
      },
      orderBy: { updatedAt: 'asc' },
      take: Math.min(PRIORITY_LIMITS[Temperature.AIRING_NOW], maxItems),
    });

    let remaining = maxItems - airingNow.length;
    if (remaining <= 0) return airingNow;

    // Priority 2: AIRING_TODAY items (updated more than 1 hour ago)
    const airingToday = await this.prisma.lastUpdated.findMany({
      where: {
        type,
        updatedAt: {
          lt: new Date(now.getTime() - UpdateInterval.HOUR_1),
          gte: new Date(now.getTime() - UpdateInterval.MINUTE_15),
        },
      },
      orderBy: { updatedAt: 'asc' },
      take: Math.min(PRIORITY_LIMITS[Temperature.AIRING_TODAY], remaining),
    });

    remaining -= airingToday.length;
    if (remaining <= 0) return [...airingNow, ...airingToday];

    // Priority 3: HOT items based on interval
    const hotInterval = meta.includes(type)
      ? UpdateInterval.DAY_1
      : UpdateInterval.HOUR_12;
    const hotItems = await this.prisma.lastUpdated.findMany({
      where: {
        type,
        updatedAt: {
          lt: new Date(now.getTime() - hotInterval),
        },
      },
      orderBy: { updatedAt: 'asc' },
      take: Math.min(PRIORITY_LIMITS[Temperature.HOT], remaining),
    });

    remaining -= hotItems.length;
    if (remaining <= 0) return [...airingNow, ...airingToday, ...hotItems];

    // Priority 4: WARM items
    const warmInterval = meta.includes(type)
      ? UpdateInterval.DAY_7
      : UpdateInterval.DAY_3;
    const warmItems = await this.prisma.lastUpdated.findMany({
      where: {
        type,
        updatedAt: {
          lt: new Date(now.getTime() - warmInterval),
        },
      },
      orderBy: { updatedAt: 'asc' },
      take: Math.min(PRIORITY_LIMITS[Temperature.WARM], remaining),
    });

    remaining -= warmItems.length;
    if (remaining <= 0)
      return [...airingNow, ...airingToday, ...hotItems, ...warmItems];

    // Priority 5: COLD items (least priority)
    const coldInterval = meta.includes(type)
      ? UpdateInterval.DAY_28
      : UpdateInterval.DAY_14;
    const coldItems = await this.prisma.lastUpdated.findMany({
      where: {
        type,
        updatedAt: {
          lt: new Date(now.getTime() - coldInterval),
        },
      },
      orderBy: { updatedAt: 'asc' },
      take: Math.min(PRIORITY_LIMITS[Temperature.COLD], remaining),
    });

    return [
      ...airingNow,
      ...airingToday,
      ...hotItems,
      ...warmItems,
      ...coldItems,
    ];
  }

  private async _getAnilistData(lastUpdated: LastUpdated, type: UpdateType) {
    const entityId = lastUpdated.entityId;
    const externalId = lastUpdated.externalId;

    switch (type) {
      case UpdateType.ANILIST:
        return this.anilistService.getAnilist(Number(entityId) || 0);
      case UpdateType.SHIKIMORI:
        return this.anilistService.getAnilist(Number(entityId) || 0, true);
      default:
        return this.anilistService.getAnilist(Number(externalId) || 0);
    }
  }

  private async _getAnilistBasedTemperature(
    lastUpdated: LastUpdated,
    type: UpdateType,
  ): Promise<Temperature> {
    const anilistData = await this._getAnilistData(lastUpdated, type);
    if (!anilistData) return Temperature.UNKNOWN;

    const now = new Date();

    if (anilistData.nextAiringEpisode) {
      const airingTime = new Date(
        (anilistData?.nextAiringEpisode?.airingAt || 0) * 1000,
      );
      const timeDiff = Math.abs(airingTime.getTime() - now.getTime());

      if (timeDiff <= ONE_HOUR_MS * 2 && !meta.includes(type)) {
        return Temperature.AIRING_NOW;
      }

      if (airingTime.toDateString() === now.toDateString()) {
        return Temperature.AIRING_TODAY;
      }
    }

    const status = anilistData.status as MediaStatus;
    const relevanceScore = this._calculateRelevanceScore(anilistData, now);

    switch (status) {
      case MediaStatus.RELEASING:
        return Temperature.HOT;
      case MediaStatus.NOT_YET_RELEASED:
        if (anilistData.startDate) {
          const startDate = new Date(
            anilistData.startDate.year!,
            (anilistData.startDate.month || 1) - 1,
            anilistData.startDate.day || 1,
          );
          const daysUntilStart =
            (startDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

          if (daysUntilStart <= 7) return Temperature.HOT;
          if (daysUntilStart <= 30) return Temperature.WARM;
        }
        return Temperature.COLD;
      case MediaStatus.FINISHED:
        if (relevanceScore >= 7) return Temperature.HOT;
        if (relevanceScore >= 5) return Temperature.WARM;
        return Temperature.COLD;
      case MediaStatus.CANCELLED:
        return Temperature.COLD;
      case MediaStatus.HIATUS:
        return relevanceScore >= 6 ? Temperature.WARM : Temperature.COLD;
      default:
        return Temperature.UNKNOWN;
    }
  }

  private _calculateRelevanceScore(
    anilist: AnilistWithRelations,
    now: Date,
  ): number {
    let score = 0;

    if (anilist.popularity) {
      if (anilist.popularity > 100000) score += 3;
      else if (anilist.popularity > 50000) score += 2;
      else if (anilist.popularity > 10000) score += 1;
    }

    if (anilist.trending) {
      if (anilist.trending > 1000) score += 3;
      else if (anilist.trending > 500) score += 2;
      else if (anilist.trending > 100) score += 1;
    }

    if (anilist.updatedAt) {
      const daysSinceUpdate =
        (now.getTime() - anilist.updatedAt * 1000) / (24 * 60 * 60 * 1000);
      if (daysSinceUpdate < 1) score += 2;
      else if (daysSinceUpdate < 7) score += 1;
    }

    const topRanking = anilist.rankings?.find(
      (r) => (r.allTime && r.rank) || 0 <= 100,
    );
    if (topRanking) {
      if (topRanking.rank || 0 <= 50) score += 2;
      else score += 1;
    }

    if (anilist.averageScore && anilist.averageScore > 80) score += 1;
    if (anilist.favourites && anilist.favourites > 10000) score += 1;

    if (anilist.season && anilist.seasonYear) {
      const currentYear = now.getFullYear();
      const currentSeason = this._getCurrentSeason(now);

      if (
        anilist.seasonYear === currentYear &&
        anilist.season === currentSeason
      ) {
        score += 1;
      }
    }

    return score;
  }

  private _getCurrentSeason(date: Date): string {
    const month = date.getMonth();
    if (month >= 0 && month <= 2) return 'WINTER';
    if (month >= 3 && month <= 5) return 'SPRING';
    if (month >= 6 && month <= 8) return 'SUMMER';
    return 'FALL';
  }

  private async _getTmdbTemperature(
    lastUpdated: LastUpdated,
  ): Promise<Temperature> {
    const tmdbData = await this.tmdbService.getTmdb(
      Number(lastUpdated.externalId) || 0,
    );
    if (!tmdbData) return Temperature.UNKNOWN;

    const now = new Date();
    const airingDateStr = tmdbData.next_episode_to_air?.air_date;

    if (airingDateStr) {
      const airingDate = new Date(airingDateStr);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (
        airingDate.getFullYear() === today.getFullYear() &&
        airingDate.getMonth() === today.getMonth() &&
        airingDate.getDate() === today.getDate()
      ) {
        return Temperature.AIRING_TODAY;
      }
    }

    const status = tmdbData.status as TmdbStatus;
    switch (status) {
      case TmdbStatus.InProduction:
      case TmdbStatus.PostProduction:
        return Temperature.HOT;
      case TmdbStatus.Planned:
      case TmdbStatus.Rumored:
      case TmdbStatus.ReturningSeries:
        return Temperature.WARM;
      case TmdbStatus.Released:
      case TmdbStatus.Ended:
      case TmdbStatus.Canceled:
        return Temperature.COLD;
      default:
        return Temperature.UNKNOWN;
    }
  }

  private async _getTvdbTemperature(
    lastUpdated: LastUpdated,
  ): Promise<Temperature> {
    const tvdbData = await this.tvdbService.getTvdb(
      Number(lastUpdated.externalId) || 0,
    );
    if (!tvdbData || !tvdbData.status) return Temperature.UNKNOWN;

    const status = tvdbData.status?.name as ETvdbStatus;

    switch (status) {
      case ETvdbStatus.Continuing:
        return Temperature.HOT;
      case ETvdbStatus.Pilot:
        return Temperature.WARM;
      case ETvdbStatus.Ended:
      case ETvdbStatus.Cancelled:
        return Temperature.COLD;
      default:
        return Temperature.UNKNOWN;
    }
  }

  private async _calculateTemperature(
    lastUpdated: LastUpdated,
    type: UpdateType,
  ): Promise<Temperature> {
    if (type === UpdateType.TMDB) {
      return this._getTmdbTemperature(lastUpdated);
    } else if (type === UpdateType.TVDB) {
      return this._getTvdbTemperature(lastUpdated);
    } else {
      return this._getAnilistBasedTemperature(lastUpdated, type);
    }
  }

  async calculateAndStoreTemperatures(
    type: UpdateType,
    batchSize: number = 1000,
  ): Promise<void> {
    console.log(`Pre-calculating temperatures for ${type}...`);

    let offset = 0;
    let processed = 0;

    while (true) {
      const items = await this.prisma.lastUpdated.findMany({
        where: { type },
        skip: offset,
        take: batchSize,
        orderBy: { updatedAt: 'asc' },
      });

      if (items.length === 0) break;

      const updates = await Promise.all(
        items.map(async (item) => {
          const temp = await this._calculateTemperature(item, type);
          return {
            id: item.id,
            temperature: Temperature[temp],
          };
        }),
      );

      for (const update of updates) {
        await this.prisma.updateTemperature.upsert({
          where: { id: update.id },
          create: {
            id: update.id,
            temperature: update.temperature,
          },
          update: {
            temperature: update.temperature,
          },
        });
      }

      processed += items.length;
      offset += batchSize;

      console.log(
        `Processed ${processed} temperature calculations for ${type}`,
      );
      await sleep(0.1, false);
    }
  }

  async update(types?: UpdateType[]): Promise<void> {
    types ??= Object.values(UpdateType) as UpdateType[];
    if (!Config.UPDATE_ENABLED) {
      console.log('Updates are disabled via configuration.');
      return;
    }

    if (this.lock.isLocked(Config.INDEXER_RUNNING_KEY)) {
      console.log('Indexer is running. Skipping this update cycle.');
      return;
    }

    if (!this.lock.acquire(Config.UPDATE_RUNNING_KEY)) {
      console.log('Update cycle is already running. Skipping this cycle.');
      return;
    }

    try {
      console.log('Starting SMART priority-based update cycle...');

      for (const provider of this.providers) {
        if (!types.includes(provider.type)) continue;

        try {
          const itemsToUpdate = await this.getHighPriorityUpdates(
            provider.type,
            500,
          );

          if (itemsToUpdate.length === 0) {
            console.log(
              `No high-priority items to update for ${provider.type}`,
            );
            continue;
          }

          console.log(
            `Processing ${itemsToUpdate.length} HIGH-PRIORITY items for ${provider.type}`,
          );

          for (const item of itemsToUpdate) {
            try {
              if (!this.lock.isLocked(Config.UPDATE_RUNNING_KEY)) {
                console.log('Update stopped');
                return;
              }

              const temp = await this.getStoredTemperature(item);
              console.log(
                `Updating ${provider.type} ID:${item.entityId} (Temp: ${Temperature[temp]}) - ${itemsToUpdate.length - itemsToUpdate.indexOf(item)} left`,
              );

              await provider.update(item.entityId);
              await sleep(SLEEP_BETWEEN_UPDATES, false);
            } catch (itemError) {
              console.error(
                `Error updating ${provider.type} ID:${item.entityId}:`,
                itemError,
              );
              continue;
            }
          }

          console.log(`Finished ${provider.type} high-priority updates`);
        } catch (e: any) {
          console.error(`Error in provider ${provider.type}:`, e.message);
        }
      }

      console.log('SMART update cycle finished.');
    } finally {
      this.lock.release(Config.UPDATE_RUNNING_KEY);
    }
  }

  public stop(): void {
    this.lock.release(Config.UPDATE_RUNNING_KEY);
  }

  @Cron(CronExpression.EVERY_30_MINUTES) // Check high-priority stuff frequently
  async updateHighPriority(): Promise<void> {
    await this.update(streaming); // Streaming sources need frequent updates
  }

  @Cron(CronExpression.EVERY_HOUR) // Meta sources less frequently
  async updateMeta(): Promise<void> {
    await this.update(meta);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async updateTmdb(): Promise<void> {
    await this.update([UpdateType.TMDB]);
  }

  // Daily temperature calculation
  @Cron(CronExpression.EVERY_DAY_AT_3PM, { timeZone: 'Europe/London' })
  async recalculateTemperatures(): Promise<void> {
    console.log('Starting daily temperature recalculation...');
    for (const type of Object.values(UpdateType)) {
      await this.calculateAndStoreTemperatures(type as UpdateType);
    }
    console.log('Temperature recalculation completed.');
  }
}
