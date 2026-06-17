import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, timestamp, text } from 'drizzle-orm/pg-core';

export const apiKey = pgTable('api_key', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  key: text('key').notNull().unique(),
  active: boolean('active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const apiKeyUsage = pgTable('api_key_usage', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  api_key_id: text('api_key_id')
    .notNull()
    .references(() => apiKey.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull(),
  origin: text('origin'),
  user_agent: text('user_agent'),
  ip: text('ip'),
  used_at: timestamp('used_at').notNull().defaultNow()
});
