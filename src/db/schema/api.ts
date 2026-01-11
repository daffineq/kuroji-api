import cuid from 'cuid';
import { boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const apiKey = pgTable('api_key', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  key: varchar('key', { length: 255 }).notNull().unique(),
  active: boolean('active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const apiKeyUsage = pgTable('api_key_usage', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  api_key_id: varchar('api_key_id', { length: 255 })
    .notNull()
    .references(() => apiKey.id, { onDelete: 'cascade' }),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 255 }).notNull(),
  origin: varchar('origin', { length: 255 }),
  user_agent: varchar('user_agent', { length: 255 }),
  ip: varchar('ip', { length: 255 }),
  used_at: timestamp('used_at').notNull().defaultNow()
});
