import { drizzle } from 'drizzle-orm/postgres-js';
import { Config } from 'src/config';
import { relations } from './relations';

if (!Config.database_url) {
  throw new Error('no database?');
}

const db = drizzle({ connection: Config.database_url, relations });

export { db };

export * from './schema';
export * from './utils';
