export default class Config {
  public static readonly BASE = process.env.PUBLIC_URL;

  public static readonly PORT = process.env.PORT
    ? parseInt(process.env.PORT)
    : 3000;

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
  public static readonly ANILIBRIA = process.env.ANILIBRIA;
  public static readonly SHIKIMORI = process.env.SHIKIMORI;
  public static readonly CONSUMET = process.env.CONSUMET;
  public static readonly HIANIME = process.env.HIANIME;
  public static readonly ANI_ZIP = process.env.ANI_ZIP;
  public static readonly TMDB = process.env.TMDB;
  public static readonly TVDB = process.env.TVDB;
  public static readonly JIKAN = process.env.JIKAN;
  public static readonly KITSU = process.env.KITSU;

  public static readonly TMDB_API =
    process.env.TMDB_API ?? '5201b54eb0968700e693a30576d7d4dc';
  public static readonly TVDB_API = process.env.TVDB_API;

  public static readonly REDIS_USERNAME = process.env.REDIS_USERNAME;
  public static readonly REDIS_HOST = process.env.REDIS_HOST;
  public static readonly REDIS_PORT: number = parseInt(
    process.env.REDIS_PORT ?? '0',
  );
  public static readonly REDIS_PASSWORD = process.env.REDIS_PASSWORD;

  public static readonly REDIS = (process.env.REDIS ?? 'true') === 'true';
  public static readonly REDIS_TIME = process.env.REDIS_TIME
    ? parseInt(process.env.REDIS_TIME)
    : 3600;

  public static readonly CORS = (() => {
    const corsEnv = process.env.CORS ?? '';

    if (corsEnv === '*') {
      return true;
    }

    if (corsEnv === '') {
      return false;
    }

    return corsEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })();

  public static readonly RATE_LIMIT: number =
    process.env.RATE_LIMIT && parseInt(process.env.RATE_LIMIT) != 0
      ? parseInt(process.env.RATE_LIMIT)
      : Infinity;
  public static readonly RATE_LIMIT_TTL: number =
    (process.env.RATE_LIMIT_TTL ? parseInt(process.env.RATE_LIMIT_TTL) : 60) *
    1000;

  public static readonly DEFAULT_PER_PAGE: number = process.env.DEFAULT_PER_PAGE
    ? parseInt(process.env.DEFAULT_PER_PAGE)
    : 25;

  public static readonly DEFAULT_MAX_PER_PAGE: number = process.env
    .DEFAULT_MAX_PER_PAGE
    ? parseInt(process.env.DEFAULT_MAX_PER_PAGE)
    : 50;

  public static readonly DEFAULT_MIN_PER_PAGE: number = process.env
    .DEFAULT_MIN_PER_PAGE
    ? parseInt(process.env.DEFAULT_MIN_PER_PAGE)
    : 1;

  public static readonly DEFAULT_PAGE: number = process.env.DEFAULT_PAGE
    ? parseInt(process.env.DEFAULT_PAGE)
    : 1;

  public static readonly DEFAULT_MIN_PAGE: number = process.env.DEFAULT_MIN_PAGE
    ? parseInt(process.env.DEFAULT_MIN_PAGE)
    : 1;

  public static readonly MAX_FILTER_BATCHES: number = process.env
    .MAX_FILTER_BATCHES
    ? parseInt(process.env.MAX_FILTER_BATCHES)
    : 20;

  public static readonly INDEXER_RUNNING_KEY =
    process.env.INDEXER_RUNNING_KEY ?? 'isIndexerRunning';
  public static readonly UPDATE_RUNNING_KEY =
    process.env.UPDATE_RUNNING_KEY ?? 'isUpdateRunning';
  public static readonly QUEUE_LOCK_KEY =
    process.env.QUEUE_LOCK_KEY ?? 'UPDATE_QUEUE_LOCK';

  public static readonly SECURITY_PASSWORD = process.env.SECURITY_PASSWORD;

  public static readonly JWT_SECRET = process.env.JWT_SECRET ?? 'secretkey';
  public static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
}
