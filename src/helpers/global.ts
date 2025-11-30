import { ScheduleOptions } from './schedule';

const GLOBAL_SCHEDULES_KEY = '__GLOBAL_SCHEDULES__';
const CLASS_SCHEDULES_KEY = '__CLASS_SCHEDULES__';

if (!(globalThis as any)[GLOBAL_SCHEDULES_KEY] && !(globalThis as any)[CLASS_SCHEDULES_KEY]) {
  (globalThis as any)[GLOBAL_SCHEDULES_KEY] = {
    intervals: new Map<string, NodeJS.Timeout>(),
    methods: new Set<string>()
  };

  (globalThis as any)[CLASS_SCHEDULES_KEY] = {
    classes: new WeakMap<any, { method: Function; options: ScheduleOptions }[]>()
  };
}

const GLOBAL_SCHEDULES = (globalThis as any)[GLOBAL_SCHEDULES_KEY];
const CLASS_SCHEDULES = (globalThis as any)[CLASS_SCHEDULES_KEY];

export { GLOBAL_SCHEDULES, CLASS_SCHEDULES };
