const GLOBAL_SCHEDULES_KEY = '__GLOBAL_SCHEDULES__';

if (!(globalThis as any)[GLOBAL_SCHEDULES_KEY]) {
  (globalThis as any)[GLOBAL_SCHEDULES_KEY] = {
    intervals: new Map<string, NodeJS.Timeout>(),
    methods: new Set<string>()
  };
}

const GLOBAL_SCHEDULES = (globalThis as any)[GLOBAL_SCHEDULES_KEY];

export { GLOBAL_SCHEDULES };
