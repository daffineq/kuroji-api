import { Config } from 'src/config/config';
import { CLASS_SCHEDULES, GLOBAL_SCHEDULES } from './global';
import logger from './logger';
import {
  hoursToMilliseconds,
  minutesToMilliseconds,
  monthsSinceEpoch,
  secondsToMilliseconds,
  weeksSinceEpoch
} from './time';

type ScheduleStrategyConfig = Partial<Omit<ScheduleOptions, 'strategies'>>;

const ScheduleStrategies = {
  EVERY_MINUTE: { everyMs: minutesToMilliseconds(1) },
  EVERY_5_MINUTES: { everyMs: minutesToMilliseconds(5) },
  EVERY_15_MINUTES: { everyMs: minutesToMilliseconds(15) },
  EVERY_30_MINUTES: { everyMs: minutesToMilliseconds(30) },

  EVERY_HOUR: { everyMs: hoursToMilliseconds(1) },
  EVERY_2_HOURS: { everyMs: hoursToMilliseconds(2) },
  EVERY_6_HOURS: { everyMs: hoursToMilliseconds(6) },
  EVERY_12_HOURS: { everyMs: hoursToMilliseconds(12) },

  EVERY_DAY_MIDNIGHT: {
    hour: 0,
    minute: 0,
    delay: minutesToMilliseconds(1)
  },

  EVERY_DAY_23: {
    hour: 23,
    minute: 0,
    delay: minutesToMilliseconds(10)
  },

  EVERY_OTHER_DAY: {
    days: [1, 3, 5],
    delay: minutesToMilliseconds(30)
  },

  WEEKDAYS: {
    days: [1, 2, 3, 4, 5],
    delay: minutesToMilliseconds(30)
  },

  WEEKENDS: {
    days: [0, 6],
    delay: minutesToMilliseconds(30)
  },

  EVERY_WEEK: {
    days: [1],
    delay: hoursToMilliseconds(1)
  },

  EVERY_OTHER_WEEK: {
    delay: hoursToMilliseconds(1),
    shouldRun: (now) => weeksSinceEpoch(now) % 2 === 0 && now.getDay() === 1 && now.getHours() === 0
  },

  EVERY_MONTH_START: {
    delay: hoursToMilliseconds(1),
    shouldRun: (now) => now.getDate() === 1 && now.getDay() === 1 && now.getHours() === 0
  },

  EVERY_OTHER_MONTH: {
    delay: hoursToMilliseconds(1),
    shouldRun: (now) =>
      monthsSinceEpoch(now) % 2 === 0 && now.getDate() === 1 && now.getDay() === 1 && now.getHours() === 0
  }
} as const satisfies Record<string, ScheduleStrategyConfig>;

type ScheduleOptions = {
  strategies?: ScheduleStrategyConfig[];
  days?: number[]; // 0 = Sun ... 6 = Sat
  hour?: number;
  minute?: number;
  everyMs?: number;
  delay?: number;
  shouldRun?: (now: Date, lastRun: number) => boolean;
};

function mergeStrategies(strategies?: ScheduleStrategyConfig[]): Partial<ScheduleOptions> {
  if (!strategies?.length) return {};
  const merged: Partial<ScheduleOptions> = {
    days: [0, 1, 2, 3, 4, 5, 6],
    delay: secondsToMilliseconds(1)
  };

  for (const s of strategies) {
    if (s.days) merged.days = s.days;
    if (s.everyMs !== undefined) merged.everyMs = s.everyMs;
    if (s.delay !== undefined) merged.delay = s.delay;
    if (s.hour !== undefined) merged.hour = s.hour;
    if (s.minute !== undefined) merged.minute = s.minute;

    if (s.shouldRun) {
      const prev = merged.shouldRun;
      merged.shouldRun = prev ? (now, lastRun) => prev(now, lastRun) || s.shouldRun!(now, lastRun) : s.shouldRun;
    }
  }

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

      // Vercel doesnt support setInterval :(
      if (Config.vercel) {
        return;
      }

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

          let lastRun = new Date().getTime();

          setInterval(async () => {
            const now = new Date();
            const day = now.getDay();
            const currentTime = now.getTime();

            const target = new Date();
            if (hour !== undefined || minute !== undefined) {
              if (hour !== undefined) target.setHours(hour);
              if (minute !== undefined) target.setMinutes(minute);
              target.setSeconds(0);
              target.setMilliseconds(0);
            }

            if (!days.includes(day)) return;

            let run = false;

            if (shouldRun) {
              run = shouldRun(now, lastRun);
            } else if (everyMs) {
              run = currentTime - lastRun >= everyMs;
            } else if (
              currentTime > target.getTime() &&
              lastRun < target.getTime() &&
              (hour !== undefined || minute !== undefined)
            ) {
              run = true;
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
