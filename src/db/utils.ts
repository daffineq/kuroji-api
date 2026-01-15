import { sleep } from 'bun';
import { sql } from 'drizzle-orm';
import { db } from '.';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

export const upsertWithExcluded = <T extends Record<string, any>>(
  payload: T,
  idField: keyof T = 'id' as keyof T
): {
  values: T;
  set: Record<string, any>;
} => {
  const values = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== undefined)) as T;

  const set: Record<string, any> = {};
  Object.keys(values).forEach((key) => {
    if (key !== idField) {
      set[key] = sql`excluded.${sql.raw(key)}`;
    }
  });

  return { values, set };
};
