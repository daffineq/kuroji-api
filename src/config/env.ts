import 'dotenv/config';
import { parseBoolean, parseNumber } from 'src/helpers/parsers';

const env = {
  // App Settings
  PORT: parseNumber(process.env.PORT) ?? 3000,
  PUBLIC_URL: process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,

  PROXY_URL: process.env.PROXY_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api/proxy`,

  // CORS
  CORS: (process.env.CORS ?? `http://localhost:${process.env.PORT ?? 3000}`).split(','),

  // Update Settings
  UPDATE_ENABLED: parseBoolean(process.env.UPDATE_ENABLED) ?? true,
  ANILIST_INDEXER_UPDATE_ENABLED: parseBoolean(process.env.ANILIST_INDEXER_UPDATE_ENABLED) ?? true,

  // Provider Settings
  ANIMEPAHE_ENABLED: parseBoolean(process.env.ANIMEPAHE_ENABLED) ?? true,
  ANIMEKAI_ENABLED: parseBoolean(process.env.ANIMEKAI_ENABLED) ?? true,
  ZORO_ENABLED: parseBoolean(process.env.ZORO_ENABLED) ?? true,

  // API Base URLs
  ANILIST: process.env.ANILIST ?? 'https://graphql.anilist.co',
  ANILIBRIA: process.env.ANILIBRIA ?? 'https://aniliberty.top/api/v1',
  ANI_ZIP: process.env.ANI_ZIP ?? 'https://api.ani.zip',
  SHIKIMORI: process.env.SHIKIMORI ?? 'https://shikimori.one',
  KITSU: process.env.KITSU ?? 'https://kitsu.io/api/edge',
  TMDB: process.env.TMDB ?? 'https://api.themoviedb.org/3',
  TMDB_IMAGE: process.env.TMDB_IMAGE ?? 'https://image.tmdb.org/t/p/',
  TVDB: process.env.TVDB ?? 'https://api4.thetvdb.com/v4',
  JIKAN: process.env.JIKAN ?? 'https://api.jikan.moe/v4',
  CRYSOLINE: process.env.CRYSOLINE ?? 'https://api.crysoline.moe',
  CRYSOLINE_API: process.env.CRYSOLINE_API ?? '',

  // API Keys
  TMDB_API: process.env.TMDB_API ?? '',
  TVDB_API: process.env.TVDB_API === '' ? null : process.env.TVDB_API,

  // Redis Config
  REDIS_ENABLED: process.env.REDIS !== 'false',
  REDIS_TIME: parseNumber(process.env.REDIS_TIME) ?? 3600,
  REDIS_USERNAME: process.env.REDIS_USERNAME ?? '',
  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: parseNumber(process.env.REDIS_PORT) ?? 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? '',

  // Rate Limiting
  RATE_LIMIT: parseNumber(process.env.RATE_LIMIT) ?? 0,
  RATE_LIMIT_TTL: parseNumber(process.env.RATE_LIMIT_TTL) ?? 60,

  // Pagination
  DEFAULT_PER_PAGE: parseNumber(process.env.DEFAULT_PER_PAGE) ?? 25,
  DEFAULT_PAGE: parseNumber(process.env.DEFAULT_PAGE) ?? 1,

  DEFAULT_MAX_PER_PAGE: process.env.DEFAULT_MAX_PER_PAGE ? parseInt(process.env.DEFAULT_MAX_PER_PAGE) : 50,
  DEFAULT_MIN_PER_PAGE: process.env.DEFAULT_MIN_PER_PAGE ? parseInt(process.env.DEFAULT_MIN_PER_PAGE) : 1,
  DEFAULT_MIN_PAGE: process.env.DEFAULT_MIN_PAGE ? parseInt(process.env.DEFAULT_MIN_PAGE) : 1,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET ?? 'supersecret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',

  // Admin Key
  ADMIN_KEY: process.env.ADMIN_KEY ?? '',

  // Database
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://prisma:postgres@localhost:5432/kuroji'
};

export default env;
