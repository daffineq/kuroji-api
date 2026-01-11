import { drizzle } from 'drizzle-orm/postgres-js';
import { Config } from 'src/config/config';
import { relations } from './relations';

const db = drizzle({ connection: Config.database_url, relations, casing: 'snake_case' });

export { db };

export * from './schema';
export * from './utils';
