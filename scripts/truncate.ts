import { sql } from 'drizzle-orm';
import { db } from 'src/db';

async function truncate() {
  console.log('Truncating all tables...');

  await db.execute(sql`DO $$ DECLARE
    r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
      EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE;';
    END LOOP;
  END $$;`);

  console.log('All tables truncated.');
  process.exit(0);
}

truncate().catch((err) => {
  console.error('Truncate failed:', err);
  process.exit(1);
});
