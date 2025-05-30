export default class Config {
  public static readonly BASE = process.env.PUBLIC_URL;

  public static readonly UPDATE_ENABLED =
    (process.env.UPDATE_ENABLED ?? 'true') === 'true';
  public static readonly ANILIST_INDEXER_UPDATE_ENABLED =
    (process.env.ANILIST_INDEXER_UPDATE_ENABLED ?? 'true') === 'true';

  public static readonly ANIMEPAHE_ENABLED =
    (process.env.ANIMEPAHE_ENABLED ?? 'true') === 'true';
  public static readonly ANIMEKAI_ENABLED =
    (process.env.ANIMEKAI_ENABLED ?? 'true') === 'true';
  public static readonly ZORO_ENABLED =
    (process.env.ZORO_ENABLED ?? 'true') === 'true';

  public static readonly ANILIST = process.env.ANILIST;
  public static readonly SHIKIMORI = process.env.SHIKIMORI;
  public static readonly TMDB = process.env.TMDB;
  public static readonly TVDB = process.env.TVDB;
  public static readonly JIKAN = process.env.JIKAN;
  public static readonly KITSU = process.env.KITSU;

  public static readonly TMDB_API = process.env.TMDB_API;
  public static readonly TVDB_API = process.env.TVDB_API;

  public static readonly REDIS_USERNAME = process.env.REDIS_USERNAME;
  public static readonly REDIS_HOST = process.env.REDIS_HOST;
  public static readonly REDIS_PORT: number = parseInt(process.env.REDIS_PORT ?? '0');
  public static readonly REDIS_PASSWORD = process.env.REDIS_PASSWORD;

  public static readonly REDIS =
    (process.env.REDIS ?? 'true') === 'true';
  public static readonly REDIS_TIME = process.env.REDIS_TIME ? parseInt(process.env.REDIS_TIME) : 3600;

  public static readonly CORS: string[] = (process.env.CORS ?? '').split(',').map(s => s.trim()).filter(Boolean);

  public static readonly RATE_LIMIT: number =
    process.env.RATE_LIMIT && parseInt(process.env.RATE_LIMIT) != 0
      ? parseInt(process.env.RATE_LIMIT)
      : Infinity;
  public static readonly RATE_LIMIT_TTL: number = (process.env.RATE_LIMIT_TTL ? parseInt(process.env.RATE_LIMIT_TTL) : 60) * 1000;
}
