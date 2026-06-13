import { ForceOr } from './forced';

export const uniqueBy = <T, K>(list: T[], key: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return list.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export function groupBy<T>(rows: T[], key: (row: T) => number | string): Map<number | string, T[]> {
  const map = new Map<number | string, T[]>();
  for (const row of rows) {
    const k = key(row);
    const bucket = map.get(k);
    if (bucket) bucket.push(row);
    else map.set(k, [row]);
  }
  return map;
}

export function indexBy<T>(rows: T[], key: (row: T) => number | string): Map<number | string, T> {
  const map = new Map<number | string, T>();
  for (const row of rows) map.set(key(row), row);
  return map;
}

export function toArray<T>(value: ForceOr<T> | null | undefined): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export const getApiKey = (request: Request) => {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey) return headerKey;

  const url = new URL(request.url);
  return url.searchParams.get('api_key');
};
