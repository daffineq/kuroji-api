export class KITSU {
  public static searchKitsu(query: string): string {
    return `anime?filter[text]=${query}`;
  }

  public static getKitsu(id: string): string {
    return `anime/${id}`;
  }
}
