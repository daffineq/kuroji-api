import { UrlConfig } from './url.config';

export class KITSU {
  public static searchKitsu(query: string): string {
    return `${UrlConfig.KITSU}anime?filter[text]=${query}`;
  }

  public static getKitsu(id: string): string {
    return `${UrlConfig.KITSU}anime/${id}`;
  }
}
