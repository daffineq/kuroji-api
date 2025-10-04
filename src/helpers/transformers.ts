import { Transform } from 'class-transformer';

export const TransformToArray = () =>
  Transform(({ value }: { value: unknown }) => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [value];
  });

export const TransformToNumberArray = () =>
  Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => Number(v));
    if (typeof value === 'string') return value.split(',').map((v) => Number(v));
    return [Number(value)];
  });

export const TransformToBoolean = () => Transform(({ value }) => value === 'true');
