import Config from './Config';
import { UrlConfig } from './url.config';

export class TVDB {
  static readonly API_KEY: string | null = Config.TVDB_API || null;

  static getLoginUrl(): string {
    return `${UrlConfig.TVDB}login`;
  }

  static getRemoteId(id: string): string {
    return `${UrlConfig.TVDB}search/remoteid/${id}`;
  }

  static getMovie(id: number): string {
    return `${UrlConfig.TVDB}movies/${id}/extended`;
  }

  static getSeries(id: number): string {
    return `${UrlConfig.TVDB}series/${id}/extended`;
  }

  static getMovieTranslations(id: number, translations: string): string {
    return `${UrlConfig.TVDB}movies/${id}/translations/${translations}`;
  }

  static getSeriesTranslations(id: number, translations: string): string {
    return `${UrlConfig.TVDB}series/${id}/translations/${translations}`;
  }

  static getLanguages(): string {
    return `${UrlConfig.TVDB}languages`;
  }
}
