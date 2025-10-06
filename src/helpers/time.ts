const secondsToMilliseconds = (seconds: number): number => seconds * 1000;
const minutesToMilliseconds = (minutes: number): number => minutes * 60 * 1000;
const hoursToMilliseconds = (hours: number): number => hours * 60 * 60 * 1000;
const daysToMilliseconds = (days: number): number => days * 24 * 60 * 60 * 1000;
const weeksToMilliseconds = (weeks: number): number => weeks * 7 * 24 * 60 * 60 * 1000;
const monthsToMilliseconds = (months: number): number => months * 30 * 24 * 60 * 60 * 1000;
const yearsToMilliseconds = (years: number): number => years * 365 * 24 * 60 * 60 * 1000;

const weeksSinceEpoch = (now = new Date()): number => {
  const oneWeek = weeksToMilliseconds(1);
  return Math.floor(now.getTime() / oneWeek);
};

const monthsSinceEpoch = (now = new Date()): number => {
  return now.getFullYear() * 12 + now.getMonth();
};

export {
  secondsToMilliseconds,
  minutesToMilliseconds,
  hoursToMilliseconds,
  daysToMilliseconds,
  weeksToMilliseconds,
  monthsToMilliseconds,
  yearsToMilliseconds,
  weeksSinceEpoch,
  monthsSinceEpoch
};
