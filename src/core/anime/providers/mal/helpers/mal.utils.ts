type DayOfWeek = 'mondays' | 'tuesdays' | 'wednesdays' | 'thursdays' | 'fridays' | 'saturdays' | 'sundays';

const dayMap: Record<DayOfWeek, number> = {
  mondays: 1,
  tuesdays: 2,
  wednesdays: 3,
  thursdays: 4,
  fridays: 5,
  saturdays: 6,
  sundays: 7
};

function parseBroadcast(broadcast: string) {
  const regex = /^(\w+)\s+at\s+(\d{2}:\d{2})\s+\((.+)\)$/i;
  const match = broadcast.match(regex);

  if (!match) return null;

  const [_, dayName, time, timezone] = match;

  return {
    week: dayMap[dayName?.toLowerCase() as DayOfWeek] || 0,
    time: time,
    timezone: timezone
  };
}

const MalUtils = {
  parseBroadcast
};

export { MalUtils };
