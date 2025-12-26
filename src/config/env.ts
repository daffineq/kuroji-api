import 'dotenv/config';
import { parseBoolean, parseNumber, parseString } from 'src/helpers/parsers';

type ApiStrategy = 'all_routes' | 'not_required';

function parseApiStrategy(value?: string): ApiStrategy {
  if (value === 'all_routes' || value === 'not_required') {
    return value;
  }
  return 'not_required';
}

const env = {
  // App Settings
  PORT: parseNumber(process.env.PORT) ?? 3000,
  PUBLIC_URL: process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,

  PROXY_URL: process.env.PROXY_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api/proxy`,

  // CORS
  CORS: (process.env.CORS ?? `http://localhost:${process.env.PORT ?? 3000}`).split(','),

  // Update Settings
  ANIME_UPDATE_ENABLED: parseBoolean(process.env.ANIME_UPDATE_ENABLED) ?? true,
  ANIME_INDEXER_UPDATE_ENABLED: parseBoolean(process.env.ANIME_INDEXER_UPDATE_ENABLED) ?? true,

  // Indexer
  ANIME_POPULARITY_THRESHOLD: parseNumber(process.env.ANIME_POPULARITY_THRESHOLD) ?? 1500,

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

  // Crysoline
  CRYSOLINE: process.env.CRYSOLINE ?? 'https://api.crysoline.moe',
  CRYSOLINE_API_KEY: process.env.CRYSOLINE_API_KEY ?? '',

  // API Keys
  TMDB_AP_KEY: process.env.TMDB_API_KEY ?? '',
  TVDB_API_KEY: process.env.TVDB_API_KEY === '' ? null : process.env.TVDB_API_KEY,

  // Redis Config
  REDIS_ENABLED: process.env.REDIS_ENABLED !== 'false',
  REDIS_TTL: parseNumber(process.env.REDIS_TTL) ?? 3600,
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

  // Admin Key
  ADMIN_KEY: process.env.ADMIN_KEY ?? '',

  API_STRATEGY: parseApiStrategy(process.env.API_KEY_STRATEGY),

  ROUTES_WHITELIST: parseString(process.env.ROUTES_WHITELIST)?.split(',') ?? ['/docs', '/docs/openapi'],

  // Database
  DATABASE_URL: process.env.DATABASE_URL ?? ''
};

export default env;
