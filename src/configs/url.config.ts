import Config from './config.js';

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : url + '/';
}

export class UrlConfig {
  // 🔧 Base values
  public static readonly BASE = withTrailingSlash(
    Config.BASE || 'http://localhost:3000',
  );

  // 🌐 API Base URLs
  public static readonly ANILIBRIA = withTrailingSlash(
    Config.ANILIBRIA || 'https://aniliberty.top/api/v1',
  );
  public static readonly CONSUMET_BASE = withTrailingSlash(
    Config.CONSUMET || '',
  );
  public static readonly HIANIME_BASE = withTrailingSlash(Config.HIANIME || '');
  public static readonly ANI_ZIP_BASE = withTrailingSlash(
    Config.ANI_ZIP || 'https://api.ani.zip',
  );
  public static readonly SHIKIMORI = withTrailingSlash(
    Config.SHIKIMORI || 'https://shikimori.one',
  );
  public static readonly JIKAN = withTrailingSlash(
    Config.JIKAN || 'https://api.jikan.moe/v4',
  );
  public static readonly ANILIST_GRAPHQL =
    Config.ANILIST || 'https://graphql.anilist.co';
  public static readonly TMDB: string = withTrailingSlash(
    Config.TMDB || 'https://api.themoviedb.org/3/',
  );
  public static readonly TVDB: string = withTrailingSlash(
    Config.TVDB || 'https://api4.thetvdb.com/v4/',
  );
  public static readonly KITSU: string = withTrailingSlash(
    Config.KITSU || 'https://kitsu.io/api/edge/',
  );

  // 📡 External Links
  public static readonly MAL = 'https://myanimelist.net/anime/';
  public static readonly ANILIST = 'https://anilist.co/anime/';

  // 🔁 SHIKIMORI Sub Routes
  public static readonly SHIKIMORI_API = `${UrlConfig.SHIKIMORI}api/`;
  public static readonly SHIKIMORI_GRAPHQL = `${UrlConfig.SHIKIMORI_API}graphql`;

  // 📺 Stream/Source APIs via Consumet
  public static readonly ZORO = `${UrlConfig.CONSUMET_BASE}anime/zoro/`;
  public static readonly ANIMEKAI = `${UrlConfig.CONSUMET_BASE}anime/animekai/`;
  public static readonly ANIMEPAHE = `${UrlConfig.CONSUMET_BASE}anime/animepahe/`;
  public static readonly HIANIME = `${UrlConfig.HIANIME_BASE}api/`;

  // Proxy URL
  public static readonly PROXY_URL = `${this.BASE}api/proxy?url=`;
}
