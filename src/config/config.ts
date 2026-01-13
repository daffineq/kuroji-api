import 'dotenv/config';

import { parseBoolean, parseNumber, parseString } from 'src/helpers/parsers';

type ApiStrategy = 'all_routes' | 'not_required';

function parseApiStrategy(value?: string): ApiStrategy {
  if (value === 'all_routes' || value === 'not_required') {
    return value;
  }
  return 'not_required';
}

const Config = {
  // App Settings
  port: parseNumber(process.env.PORT) ?? 3000,
  public_url: process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,

  proxy_url: process.env.PROXY_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api/proxy`,

  // CORS
  cors: (process.env.CORS ?? `http://localhost:${process.env.PORT ?? 3000}`).split(','),

  // Update Settings
  anime_update_enabled: parseBoolean(process.env.ANIME_UPDATE_ENABLED) ?? true,
  anime_indexer_update_enabled: parseBoolean(process.env.ANIME_INDEXER_UPDATE_ENABLED) ?? true,

  // Indexer
  anime_popularity_threshold: parseNumber(process.env.ANIME_POPULARITY_THRESHOLD) ?? 1500,

  // API Base URLs
  anilist: process.env.ANILIST ?? 'https://graphql.anilist.co',
  ani_zip: process.env.ANI_ZIP ?? 'https://api.ani.zip',
  shikimori: process.env.SHIKIMORI ?? 'https://shikimori.one',
  kitsu: process.env.KITSU ?? 'https://kitsu.io/api/edge',
  tmdb: process.env.TMDB ?? 'https://api.themoviedb.org/3',
  tmdb_image: process.env.TMDB_IMAGE ?? 'https://image.tmdb.org/t/p/',
  TVDB: process.env.TVDB ?? 'https://api4.thetvdb.com/v4',
  JIKAN: process.env.JIKAN ?? 'https://api.jikan.moe/v4',

  // Crysoline
  crysoline_api_key: process.env.CRYSOLINE_API_KEY ?? '',

  // API Keys
  tmdb_api_key: process.env.TMDB_API_KEY ?? '',
  tvdb_api_key: process.env.TVDB_API_KEY === '' ? null : process.env.TVDB_API_KEY,

  // Redis Config
  redis_enabled: process.env.REDIS_ENABLED !== 'false',
  redis_ttl: parseNumber(process.env.REDIS_TTL) ?? 900,
  redis_url: process.env.REDIS_URL ?? '',

  // Rate Limiting
  rate_limit: parseNumber(process.env.RATE_LIMIT) ?? 0,
  rate_limit_ttl: parseNumber(process.env.RATE_LIMIT_TTL) ?? 60,

  // Admin Key
  admin_key: process.env.ADMIN_KEY ?? '',

  api_strategy: parseApiStrategy(process.env.API_KEY_STRATEGY),

  routes_whitelist: parseString(process.env.ROUTES_WHITELIST)?.split(',') ?? ['/docs', '/docs/openapi'],
  routes_blacklist: parseString(process.env.ROUTES_BLACKLIST)?.split(',') ?? [],

  transaction_batch: parseNumber(process.env.TRANSACTION_BATCH) ?? 10,

  // Database
  database_url: process.env.DATABASE_URL ?? '',

  // Vercel
  vercel: parseBoolean(process.env.VERCEL) ?? false
};

export { Config };
