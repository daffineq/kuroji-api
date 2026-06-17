import { integer, pgTable, timestamp, text } from 'drizzle-orm/pg-core';

export const indexerState = pgTable('indexer_state', {
  id: text('id').primaryKey(),
  last_page: integer('last_page').notNull(),
  last_pl: integer('last_pl'),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});
