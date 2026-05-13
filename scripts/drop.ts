import { sql } from 'drizzle-orm';
import { db } from 'src/db';

async function drop() {
  console.log('Dropping all tables...');

  await db.execute(sql`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  console.log('All tables dropped.');
  process.exit(0);
}

drop().catch((err) => {
  console.error('Drop failed:', err);
  process.exit(1);
});
