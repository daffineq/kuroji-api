import { Config } from 'src/config/config';
import { CLASS_SCHEDULES, GLOBAL_SCHEDULES } from './global';
import logger from './logger';

const Schedule = {
  everyMinute(): ScheduleOptions {
    return {};
  },

  every5Minutes(): ScheduleOptions {
    return { minute: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] };
  },

  every15Minutes(): ScheduleOptions {
    return { minute: [0, 15, 30, 45] };
  },

  every30Minutes(): ScheduleOptions {
    return { minute: [0, 30] };
  },

  everyHour(): ScheduleOptions {
    return {
      hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      minute: [0]
    };
  },

  every6Hours(): ScheduleOptions {
    return {
      hour: [0, 6, 12, 18],
      minute: [0]
    };
  },

  every12Hours(): ScheduleOptions {
    return {
      hour: [0, 12],
      minute: [0]
    };
  },

  dailyAt(hour: number, minute = 0): ScheduleOptions {
    return { hour: [hour], minute: [minute] };
  },

  weekdaysAt(hour: number, minute = 0): ScheduleOptions {
    return {
      weekday: [1, 2, 3, 4, 5],
      hour: [hour],
      minute: [minute]
    };
  },

  weeklyOn(day: number, hour = 0, minute = 0): ScheduleOptions {
    return {
      weekday: [day],
      hour: [hour],
      minute: [minute]
    };
  },

  everyOtherDay(hour = 0, minute = 0): ScheduleOptions {
    return {
      weekday: [2, 4, 6],
      hour: [hour],
      minute: [minute]
    };
  },

  everyOtherWeek(hour = 0, minute = 0): ScheduleOptions {
    return {
      day: [7, 21],
      hour: [hour],
      minute: [minute]
    };
  }
};

type ScheduleField = number[] | '*';

type ScheduleOptions = {
  minute?: ScheduleField;
  hour?: ScheduleField;
  day?: ScheduleField;
  month?: ScheduleField;
  weekday?: ScheduleField;
};

function fieldMatch(value: number, rule?: ScheduleField) {
  return !rule || rule === '*' || rule.includes(value);
}

function Scheduled(options: ScheduleOptions, enabled: boolean = true) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!enabled) {
      return;
    }

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

      if (Config.vercel) {
        return;
      }

      const schedules = CLASS_SCHEDULES.classes.get(constructor.prototype);
      if (schedules) {
        for (const { method, options } of schedules) {
          const { minute, hour, day, month, weekday } = options as ScheduleOptions;

          const lastRun = { minute: -1, hour: -1, day: -1 };

          setInterval(async () => {
            const now = new Date();
            const currentMinute = now.getMinutes();
            const currentHour = now.getHours();
            const currentDay = now.getDate();

            const shouldRun =
              fieldMatch(currentMinute, minute) &&
              fieldMatch(currentHour, hour) &&
              fieldMatch(currentDay, day) &&
              fieldMatch(now.getMonth() + 1, month) &&
              fieldMatch(now.getDay(), weekday);

            const alreadyRan =
              lastRun.minute === currentMinute && lastRun.hour === currentHour && lastRun.day === currentDay;

            if (shouldRun && !alreadyRan) {
              lastRun.minute = currentMinute;
              lastRun.hour = currentHour;
              lastRun.day = currentDay;

              try {
                await method.call(this);
              } catch (err) {
                logger.error(`Scheduled method failed:`, err);
              }
            }
          }, 5000);
        }
      }
    }
  };
}

export { EnableSchedule, Scheduled, Schedule, type ScheduleOptions };
