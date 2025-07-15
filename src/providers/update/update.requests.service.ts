import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { QueueItem } from './update.service.js';
import { DateUtils } from './utils/date.utils.js';

const POPULARITY_THRESHOLDS = {
  HIGH: 200 * 1000, // 200k
  MEDIUM: 30 * 1000, // 30k
  LOW: 10 * 1000, // 10k
  TRASH: 3 * 1000, // 3k
};

@Injectable()
export class UpdateRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  getPopularityPriority(popularity: number | null): QueueItem['priority'] {
    if (!popularity || popularity < 0) return 'low';

    if (popularity >= POPULARITY_THRESHOLDS.HIGH) return 'high';
    if (popularity >= POPULARITY_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  }

  shouldUpdateBasedOnPopularity(popularity: number | null): boolean {
    if (!popularity || popularity < 0) return false;
    return popularity >= POPULARITY_THRESHOLDS.TRASH;
  }

  private validateHoursBack(hoursBack: number): number {
    if (hoursBack < 0 || hoursBack > 24) {
      console.warn(
        `[UpdateRequestsService] Invalid hoursBack: ${hoursBack}, using default: 2`,
      );
      return 2;
    }
    return hoursBack;
  }

  private validateLimit(
    limit: number,
    defaultLimit: number,
    maxLimit: number = 1000,
  ): number {
    if (limit < 1 || limit > maxLimit) {
      console.warn(
        `[UpdateRequestsService] Invalid limit: ${limit}, using default: ${defaultLimit}`,
      );
      return defaultLimit;
    }
    return limit;
  }

  async getRecentAiredAnime(hoursBack: number = 2) {
    const validatedHoursBack = this.validateHoursBack(hoursBack);

    try {
      const now = DateUtils.getLondonTimestamp();
      const startTime =
        DateUtils.getHoursAgoLondonTimestamp(validatedHoursBack);

      if (
        !DateUtils.isValidTimestamp(startTime) ||
        !DateUtils.isValidTimestamp(now)
      ) {
        throw new Error('Invalid timestamp range calculated');
      }

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

      console.log(
        `[UpdateRequestsService] Found ${todayAired.length} anime aired in last ${validatedHoursBack} hours`,
      );
      return todayAired;
    } catch (error) {
      console.error(
        '[UpdateRequestsService] Error fetching recent aired anime:',
        error,
      );
      return [];
    }
  }

  async getTodayAiredAnime() {
    try {
      const { start: startTimestamp, end: endTimestamp } =
        DateUtils.getTodayLondonRange();

      if (
        !DateUtils.isValidTimestamp(startTimestamp) ||
        !DateUtils.isValidTimestamp(endTimestamp)
      ) {
        throw new Error('Invalid timestamp range for today');
      }

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

      console.log(
        `[UpdateRequestsService] Found ${todayAired.length} anime aired today`,
      );
      return todayAired;
    } catch (error) {
      console.error(
        '[UpdateRequestsService] Error fetching today aired anime:',
        error,
      );
      return [];
    }
  }

  async getWeekAgoAiredAnime() {
    try {
      const { start: startTimestamp, end: endTimestamp } =
        DateUtils.getDaysAgoLondonRange(7);

      if (
        !DateUtils.isValidTimestamp(startTimestamp) ||
        !DateUtils.isValidTimestamp(endTimestamp)
      ) {
        throw new Error('Invalid timestamp range for week ago');
      }

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

      console.log(
        `[UpdateRequestsService] Found ${weekAgoAired.length} anime aired a week ago`,
      );
      return weekAgoAired;
    } catch (error) {
      console.error(
        '[UpdateRequestsService] Error fetching week ago aired anime:',
        error,
      );
      return [];
    }
  }

  async getFinishedAnime(limit: number = 100) {
    const validatedLimit = this.validateLimit(limit, 100);

    try {
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
        take: validatedLimit,
      });

      console.log(
        `[UpdateRequestsService] Found ${finishedAnime.length} finished anime`,
      );
      return finishedAnime;
    } catch (error) {
      console.error(
        '[UpdateRequestsService] Error fetching finished anime:',
        error,
      );
      return [];
    }
  }

  async getUpcomingAnime(limit: number = 50) {
    const validatedLimit = this.validateLimit(limit, 50);

    try {
      const now = DateUtils.getLondonTimestamp();
      const futureDate = DateUtils.getFutureLondonTimestamp(30);

      if (
        !DateUtils.isValidTimestamp(now) ||
        !DateUtils.isValidTimestamp(futureDate)
      ) {
        throw new Error('Invalid timestamp range for upcoming anime');
      }

      const upcomingAnime = await this.prisma.anilist.findMany({
        where: {
          status: 'NOT_YET_RELEASED',
          popularity: {
            gte: POPULARITY_THRESHOLDS.TRASH,
          },
          OR: [
            {
              startDate: {
                year: { gte: DateUtils.getLondonDate().getFullYear() },
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
        take: validatedLimit,
      });

      console.log(
        `[UpdateRequestsService] Found ${upcomingAnime.length} upcoming anime`,
      );
      return upcomingAnime;
    } catch (error) {
      console.error(
        '[UpdateRequestsService] Error fetching upcoming anime:',
        error,
      );
      return [];
    }
  }
}
