import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const tvdbLogin = pgTable('tvdb_login', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text('token').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  expired: boolean('expired').notNull().default(false)
});
