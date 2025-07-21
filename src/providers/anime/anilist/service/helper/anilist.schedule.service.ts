import { Injectable } from '@nestjs/common';
import { startOfWeek, addDays } from 'date-fns';
import { createScheduleData } from '../../utils/anilist-helper.js';
import { basicSelect, Schedule, Weekday } from '../../types/types.js';
import { AnilistSearchService } from './anilist.search.service.js';
import { FilterDto } from '../../filter/FilterDto.js';
@Injectable()
export class AnilistScheduleService {
  constructor(private readonly search: AnilistSearchService) {}

  async getSchedule(): Promise<Schedule> {
    const now = new Date();
    const currentDay = now.getDay();
    const { start, end } = this.getWeekRangeTimestamps();

    const releases = await this.search.getAnilists(
      new FilterDto({
        airingAtGreater: start,
        airingAtLesser: end,
      }),
      basicSelect,
    );

    const releasesByDay: Partial<Record<Weekday, any[]>> = {};

    for (const release of releases.data) {
      const airingAt = release.nextAiringEpisode?.airingAt;

      if (airingAt) {
        const date = new Date(airingAt * 1000);
        const weekdayIndex = date.getDay();
        const weekday = this.getWeekdayName(weekdayIndex);

        if (!releasesByDay[weekday]) {
          releasesByDay[weekday] = [];
        }
        releasesByDay[weekday].push(release);
      }
    }

    const schedule: Schedule = {
      monday: createScheduleData(releasesByDay['monday'], currentDay === 1),
      tuesday: createScheduleData(releasesByDay['tuesday'], currentDay === 2),
      wednesday: createScheduleData(
        releasesByDay['wednesday'],
        currentDay === 3,
      ),
      thursday: createScheduleData(releasesByDay['thursday'], currentDay === 4),
      friday: createScheduleData(releasesByDay['friday'], currentDay === 5),
      saturday: createScheduleData(releasesByDay['saturday'], currentDay === 6),
      sunday: createScheduleData(releasesByDay['sunday'], currentDay === 0),
    };

    return schedule;
  }

  private getWeekdayName(index: number): Weekday {
    const days: Weekday[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[index];
  }

  private getWeekRangeTimestamps(): {
    start: number;
    end: number;
    currentDay: number;
  } {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 14);
    return {
      start: Math.floor(weekStart.getTime() / 1000),
      end: Math.floor(weekEnd.getTime() / 1000),
      currentDay: now.getDay(),
    };
  }
}
