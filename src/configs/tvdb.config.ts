import Config from './Config';

export class TVDB {
  static readonly API_KEY: string | null = Config.TVDB_API || null;

  static getLoginUrl(): string {
    return `login`;
  }

  static getRemoteId(id: string): string {
    return `search/remoteid/${id}`;
  }

  static getMovie(id: number): string {
    return `movies/${id}/extended`;
  }

  static getSeries(id: number): string {
    return `series/${id}/extended`;
  }

  static getMovieTranslations(id: number, translations: string): string {
    return `movies/${id}/translations/${translations}`;
  }

  static getSeriesTranslations(id: number, translations: string): string {
    return `series/${id}/translations/${translations}`;
  }

  static getLanguages(): string {
    return `languages`;
  }
}
