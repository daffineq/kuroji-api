import 'dotenv/config';

import { parseBoolean, parseNumber, parseString } from 'src/helpers/parsers';

type ApiStrategy = 'all_routes' | 'not_required';

function parseApiStrategy(value?: string): ApiStrategy {
  if (value === 'all_routes' || value === 'not_required') {
    return value;
  }
  return 'not_required';
}

class ConfigModule {
  // App Settings
  readonly port = parseNumber(process.env.PORT) ?? 3000;
  readonly public_url = process.env.PUBLIC_URL ?? `http://localhost:${this.port}`;

  readonly proxy_url = process.env.PROXY_URL ?? `${this.public_url}/api/proxy`;

  // CORS
  readonly cors = (process.env.CORS ?? this.public_url).split(',');

  // Update Settings
  readonly anime_update_enabled = parseBoolean(process.env.ANIME_UPDATE_ENABLED) ?? true;

  readonly anime_indexer_update_enabled = parseBoolean(process.env.ANIME_INDEXER_UPDATE_ENABLED) ?? true;

  // Indexer
  readonly anime_indexer_default_popularity_threshold =
    parseNumber(process.env.ANIME_INDEXER_DEFAULT_POPULARITY_THRESHOLD) ??
    parseNumber(process.env.ANIME_POPULARITY_THRESHOLD) ??
    1500;

  readonly anime_indexer_default_delay = parseNumber(process.env.ANIME_INDEXER_DEFAULT_DELAY) ?? 5;

  // API Base URLs
  readonly anilist = process.env.ANILIST ?? 'https://graphql.anilist.co';
  readonly ani_zip = process.env.ANI_ZIP ?? 'https://api.ani.zip';
  readonly shikimori = process.env.SHIKIMORI ?? 'https://shikimori.one';
  readonly kitsu = process.env.KITSU ?? 'https://kitsu.io/api/edge';
  readonly tmdb = process.env.TMDB ?? 'https://api.themoviedb.org/3';
  readonly tmdb_image = process.env.TMDB_IMAGE ?? 'https://image.tmdb.org/t/p/';
  readonly tvdb = process.env.TVDB ?? 'https://api4.thetvdb.com/v4';

  // Keys
  readonly crysoline_api_key = process.env.CRYSOLINE_API_KEY ?? '';
  readonly tmdb_api_key = process.env.TMDB_API_KEY ?? '';
  readonly tvdb_api_key = process.env.TVDB_API_KEY ?? '';

  readonly has_crysoline_api_key = this.crysoline_api_key !== '';
  readonly has_tmdb_api_key = this.tmdb_api_key !== '';
  readonly has_tvdb_api_key = this.tvdb_api_key !== '';

  // Redis
  readonly caching_enabled = parseBoolean(process.env.CACHING_ENABLED) ?? true;

  readonly redis_ttl = parseNumber(process.env.REDIS_TTL) ?? 900;

  readonly redis_url = process.env.REDIS_URL;

  // Rate limiting
  readonly rate_limit = parseNumber(process.env.RATE_LIMIT) ?? 0;

  readonly rate_limit_ttl = parseNumber(process.env.RATE_LIMIT_TTL) ?? 60;

  // Misc
  readonly admin_key = process.env.ADMIN_KEY ?? '';
  readonly api_strategy = parseApiStrategy(process.env.API_KEY_STRATEGY);

  readonly routes_whitelist = parseString(process.env.ROUTES_WHITELIST)?.split(',') ?? ['/docs', '/docs/openapi'];

  readonly routes_blacklist = parseString(process.env.ROUTES_BLACKLIST)?.split(',') ?? [];

  readonly transaction_batch = parseNumber(process.env.TRANSACTION_BATCH) ?? 10;

  readonly database_url = process.env.DATABASE_URL;

  readonly vercel = parseBoolean(process.env.VERCEL) ?? false;
  readonly render = parseBoolean(process.env.RENDER) ?? false;
}

const Config = new ConfigModule();

export { Config, ConfigModule };
