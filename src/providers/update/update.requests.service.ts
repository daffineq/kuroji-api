import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { QueueItem } from './update.service.js';

const POPULARITY_THRESHOLDS = {
  HIGH: 200 * 1000, // 200k
  MEDIUM: 30 * 1000, // 30k
  LOW: 10 * 1000, // 10k
  TRASH: 5 * 1000, // 5k
};

@Injectable()
export class UpdateRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  getPopularityPriority(popularity: number | null): QueueItem['priority'] {
    if (!popularity) return 'low';

    if (popularity >= POPULARITY_THRESHOLDS.HIGH) return 'high';
    if (popularity >= POPULARITY_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  }

  shouldUpdateBasedOnPopularity(popularity: number | null): boolean {
    if (!popularity) return false;
    return popularity >= POPULARITY_THRESHOLDS.TRASH;
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

  async getFinishedAnime(limit: number = 100) {
    const finishedAnime = await this.prisma.anilist.findMany({
      where: {
        status: 'FINISHED',
        popularity: {
          gte: POPULARITY_THRESHOLDS.TRASH,
        },
      },
      select: {
        id: true,
        idMal: true,
        popularity: true,
        averageScore: true,
      },
      orderBy: [{ popularity: 'desc' }, { averageScore: 'desc' }],
      take: limit,
    });

    return finishedAnime;
  }

  async getUpcomingAnime(limit: number = 50) {
    const now = Math.floor(Date.now() / 1000);
    const futureDate = now + 30 * 24 * 60 * 60; // 30 days

    const upcomingAnime = await this.prisma.anilist.findMany({
      where: {
        status: 'NOT_YET_RELEASED',
        popularity: {
          gte: POPULARITY_THRESHOLDS.TRASH,
        },
        OR: [
          {
            startDate: {
              year: { gte: new Date().getFullYear() },
            },
          },
          {
            airingSchedule: {
              some: {
                airingAt: {
                  gte: now,
                  lte: futureDate,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        idMal: true,
        popularity: true,
        startDate: true,
      },
      orderBy: [{ popularity: 'desc' }, { startDate: { year: 'asc' } }],
      take: limit,
    });

    return upcomingAnime;
  }

  async getStatusChangedAnime(limit: number = 30) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentlyUpdated = await this.prisma.anilist.findMany({
      where: {
        updatedAt: {
          gte: Math.floor(oneDayAgo.getTime() / 1000),
        },
        popularity: {
          gte: POPULARITY_THRESHOLDS.TRASH,
        },
      },
      select: {
        id: true,
        idMal: true,
        popularity: true,
        status: true,
      },
      orderBy: [{ popularity: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });

    return recentlyUpdated;
  }
}
