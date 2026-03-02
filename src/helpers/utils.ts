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
