import cuid from 'cuid';
import { boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tvdbLogin = pgTable('tvdb_login', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  token: text('token').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  expired: boolean('expired').notNull().default(false)
});
