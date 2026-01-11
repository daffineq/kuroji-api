import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const indexerState = pgTable('indexer_state', {
  id: varchar('id', { length: 255 }).primaryKey(),
  last_page: integer('last_page').notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});
