import { Transform } from 'class-transformer';
import * as crypto from 'crypto';

export function getPageInfo(total: number, perPage: number, page: number) {
  const lastPage = Math.ceil(total / perPage);
  return {
    total,
    perPage,
    currentPage: page,
    lastPage,
    hasNextPage: page < lastPage,
  };
}

export function sleep(duration: number, log: boolean = true): Promise<void> {
  if (log) {
    console.log(`Sleeping for ${duration} seconds...`);
  }

  return new Promise((resolve) => setTimeout(resolve, duration * 1000));
}

export function firstUpper(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function firstUpperList(arr: string[]): string[] {
  return arr.map(firstUpper);
}

export function hashFilters(input: Record<string, any>): string {
  const sorted = Object.entries(input)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => {
      const sortedVal = Object.entries(val)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(',') : v}`)
        .join(';');
      return `${key}={${sortedVal}}`;
    })
    .join(':');

  return crypto.createHash('sha1').update(sorted).digest('hex');
}

export const TransformToArray = () =>
  Transform(({ value }: { value: unknown }) => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [value];
  });

export const TransformToNumberArray = () =>
  Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => Number(v));
    if (typeof value === 'string')
      return value.split(',').map((v) => Number(v));
    return [Number(value)];
  });

export const TransformToBoolean = () =>
  Transform(({ value }) => value === 'true');

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
