import { Injectable } from '@nestjs/common';
import { startOfWeek, addDays } from 'date-fns'
import { PrismaService } from '../../../../../prisma.service'
import { convertAnilistToBasic, createScheduleData, getAnilistInclude } from '../../utils/anilist-helper'
import { BasicAnilist } from '../../model/BasicAnilist'
import { Schedule, Weekday } from '../../model/AnilistModels'

@Injectable()
export class AnilistScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getWithCurrentWeek(): Promise<BasicAnilist[]> {
    const { start, end } = this.getWeekRangeTimestamps()
    const releases = await this.getThisWeeksAnilist(start, end);
    return releases.map(r =>convertAnilistToBasic(r));
  }

  async getSchedule(): Promise<Schedule> {
    const now = new Date()
    const currentDay = now.getDay()
    const { start, end } = this.getWeekRangeTimestamps()

    const releases = await this.getThisWeeksAnilist(start, end);

    const releasesByDay: Partial<Record<Weekday, BasicAnilist[]>> = {}

    for (const release of releases) {
      const small = convertAnilistToBasic(release)
      const airingAt = small.nextAiringEpisode?.airingAt

      if (airingAt) {
        const date = new Date(airingAt * 1000)
        const weekdayIndex = date.getDay()
        const weekday = this.getWeekdayName(weekdayIndex)

        if (!releasesByDay[weekday]) {
          releasesByDay[weekday] = []
        }
        releasesByDay[weekday]!.push(small)
      }
    }

    const schedule: Schedule = {
      monday: createScheduleData(releasesByDay['monday'], currentDay === 1),
      tuesday: createScheduleData(releasesByDay['tuesday'], currentDay === 2),
      wednesday: createScheduleData(releasesByDay['wednesday'], currentDay === 3),
      thursday: createScheduleData(releasesByDay['thursday'], currentDay === 4),
      friday: createScheduleData(releasesByDay['friday'], currentDay === 5),
      saturday: createScheduleData(releasesByDay['saturday'], currentDay === 6),
      sunday: createScheduleData(releasesByDay['sunday'], currentDay === 0),
    }

    return schedule
  }

  private getWeekdayName(index: number): Weekday {
    const days: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[index]
  }

  private getWeekRangeTimestamps(): { start: number, end: number, currentDay: number } {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = addDays(weekStart, 7)
    return {
      start: Math.floor(weekStart.getTime() / 1000),
      end: Math.floor(weekEnd.getTime() / 1000),
      currentDay: now.getDay()
    }
  }

  private async getThisWeeksAnilist(start: number, end: number) {
    return this.prisma.anilist.findMany({
      where: {
        OR: [
          { nextAiringEpisode: { airingAt: { gte: start, lt: end } } },
          { airingSchedule: { some: { airingAt: { gte: start, lt: end } } } },
        ]
      },
      include: getAnilistInclude(),
    })
  }
}