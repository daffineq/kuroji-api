import { UrlConfig } from './url.config.js';

export class ANILIBRIA {
  public static search(query: string, year: number, season: string) {
    return `${UrlConfig.ANILIBRIA}anime/catalog/releases?f[search]=${query}&f[years][from_year]=${year}&f[years][to_year]=${year}&f[seasons]=${season}&limit=25`;
  }

  public static getAnime(id: number) {
    return `${UrlConfig.ANILIBRIA}anime/releases/${id}`;
  }
}
