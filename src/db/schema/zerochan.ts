import cuid from 'cuid';
import { boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const zerochanLogin = pgTable('zerochan_login', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  z_id: text('z_id').notNull(),
  z_hash: text('z_hash').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  expired: boolean('expired').notNull().default(false)
});
