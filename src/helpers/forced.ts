export type Forced<T> = T[] & { __forced: true };

export type ForceOr<T> = Forced<T> | T[] | T;

export function forced<T>(items: T[]): Forced<T> {
  return Object.assign(items, { __forced: true as const });
}

export function isForced<T>(value: ForceOr<T> | T | null | undefined): value is Forced<T> {
  return Array.isArray(value) && (value as Forced<T>).__forced === true;
}
