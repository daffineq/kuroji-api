import cuid from 'cuid';
import { index, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const updateQueue = pgTable(
  'update_queue',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    anime_id: integer('anime_id').notNull().unique(),
    mal_id: integer('mal_id'),
    added_at: timestamp('added_at').notNull().defaultNow(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow()
  },
  (t) => [index('update_queue_anime_id_idx').on(t.anime_id)]
);
