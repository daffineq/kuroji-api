import { CLASS_SCHEDULES, GLOBAL_SCHEDULES } from './global';
import logger from './logger';
import {
  hoursToMilliseconds,
  minutesToMilliseconds,
  monthsSinceEpoch,
  secondsToMilliseconds,
  weeksSinceEpoch
} from './time';

enum ScheduleStrategies {
  EVERY_MINUTE,
  EVERY_5_MINUTES,
  EVERY_15_MINUTES,
  EVERY_30_MINUTES,
  EVERY_HOUR,
  EVERY_2_HOURS,
  EVERY_6_HOURS,
  EVERY_12_HOURS,
  EVERY_DAY_MIDNIGHT,
  EVERY_DAY_23,
  EVERY_OTHER_DAY,
  EVERY_OTHER_WEEK,
  WEEKDAYS,
  WEEKENDS,
  EVERY_WEEK,
  EVERY_MONTH_START,
  EVERY_OTHER_MONTH
}

type ScheduleOptions = {
  strategies?: ScheduleStrategies[];
  days?: number[]; // 0 = Sun ... 6 = Sat
  hour?: number;
  minute?: number;
  everyMs?: number;
  delay?: number;
  shouldRun?: (now: Date, lastRun: number) => boolean;
};

const STRATEGIES: Record<ScheduleStrategies, Partial<ScheduleOptions>> = {
  [ScheduleStrategies.EVERY_MINUTE]: {
    everyMs: minutesToMilliseconds(1)
  },
  [ScheduleStrategies.EVERY_5_MINUTES]: {
    everyMs: minutesToMilliseconds(5)
  },
  [ScheduleStrategies.EVERY_15_MINUTES]: {
    everyMs: minutesToMilliseconds(15)
  },
  [ScheduleStrategies.EVERY_30_MINUTES]: {
    everyMs: minutesToMilliseconds(30)
  },
  [ScheduleStrategies.EVERY_HOUR]: {
    everyMs: hoursToMilliseconds(1)
  },
  [ScheduleStrategies.EVERY_2_HOURS]: {
    everyMs: hoursToMilliseconds(2)
  },
  [ScheduleStrategies.EVERY_6_HOURS]: {
    everyMs: hoursToMilliseconds(6)
  },
  [ScheduleStrategies.EVERY_12_HOURS]: {
    everyMs: hoursToMilliseconds(12)
  },
  [ScheduleStrategies.EVERY_DAY_MIDNIGHT]: {
    hour: 0,
    minute: 0,
    delay: minutesToMilliseconds(1)
  },
  [ScheduleStrategies.EVERY_DAY_23]: {
    hour: 23,
    minute: 0,
    delay: minutesToMilliseconds(10)
  },
  [ScheduleStrategies.EVERY_OTHER_DAY]: {
    days: [1, 3, 5],
    delay: minutesToMilliseconds(30)
  },
  [ScheduleStrategies.WEEKDAYS]: {
    days: [1, 2, 3, 4, 5],
    delay: minutesToMilliseconds(30)
  },
  [ScheduleStrategies.WEEKENDS]: {
    days: [0, 6],
    delay: minutesToMilliseconds(30)
  },
  [ScheduleStrategies.EVERY_WEEK]: {
    days: [1],
    delay: hoursToMilliseconds(1)
  },
  [ScheduleStrategies.EVERY_OTHER_WEEK]: {
    delay: hoursToMilliseconds(1),
    shouldRun: (now) => weeksSinceEpoch(now) % 2 === 0 && now.getDay() === 1 && now.getHours() === 0
  },
  [ScheduleStrategies.EVERY_MONTH_START]: {
    delay: hoursToMilliseconds(1),
    shouldRun: (now) => now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() === 0
  },
  [ScheduleStrategies.EVERY_OTHER_MONTH]: {
    delay: hoursToMilliseconds(1),
    shouldRun: (now) => monthsSinceEpoch(now) % 2 === 0 && now.getDate() === 1 && now.getHours() === 0
  }
};

function mergeStrategies(strategies?: ScheduleStrategies[]): Partial<ScheduleOptions> {
  if (!strategies?.length) return {};
  const merged: Partial<ScheduleOptions> = {
    days: [],
    delay: minutesToMilliseconds(1)
  };

  for (const strategy of strategies) {
    const s = STRATEGIES[strategy];
    if (!s) continue;

    if (s.days) merged.days!.push(...s.days);
    if (s.everyMs && (!merged.everyMs || s.everyMs < merged.everyMs)) merged.everyMs = s.everyMs;
    if (s.delay && s.delay < (merged.delay ?? Infinity)) merged.delay = s.delay;
    if (s.hour !== undefined) merged.hour = s.hour;
    if (s.minute !== undefined) merged.minute = s.minute;
    if (s.shouldRun) {
      const prev = merged.shouldRun;
      merged.shouldRun = prev ? (now, lastRun) => prev(now, lastRun) || s.shouldRun!(now, lastRun) : s.shouldRun;
    }
  }

  merged.days = [...new Set(merged.days)];

  return merged;
}

function Scheduled(options: ScheduleOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const id = `${target.constructor.name}.${propertyKey}`;

    if (GLOBAL_SCHEDULES.methods.has(id)) {
      return;
    }

    GLOBAL_SCHEDULES.methods.add(id);

    const existing = CLASS_SCHEDULES.classes.get(target) ?? [];
    existing.push({ method: original, options });
    CLASS_SCHEDULES.classes.set(target, existing);
  };
}

function EnableSchedule<T extends new (...args: any[]) => any>(constructor: T): T {
  if ((constructor as any).__scheduled) return constructor;
  (constructor as any).__scheduled = true;

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);

      const schedules = CLASS_SCHEDULES.classes.get(constructor.prototype);
      if (schedules) {
        for (const { method, options } of schedules) {
          const merged = { ...mergeStrategies(options.strategies), ...options };

          const {
            days = [0, 1, 2, 3, 4, 5, 6],
            hour,
            minute,
            everyMs,
            delay = secondsToMilliseconds(1),
            shouldRun
          } = merged;

          let lastRun = 0;

          setInterval(async () => {
            const now = new Date();
            const day = now.getDay();
            const currentTime = now.getTime();

            if (!days.includes(day)) return;

            let run = false;

            if (shouldRun) {
              run = shouldRun(now, lastRun);
            } else if (everyMs) {
              run = currentTime - lastRun >= everyMs;
            } else if (hour !== undefined && minute !== undefined) {
              run = now.getHours() === hour && now.getMinutes() === minute;
            }

            if (run) {
              lastRun = currentTime;
              try {
                await method.call(this);
              } catch (err) {
                logger.error(`Scheduled method failed:`, err);
              }
            }
          }, delay);
        }
      }
    }
  };
}

export { EnableSchedule, Scheduled, ScheduleStrategies, type ScheduleOptions };
