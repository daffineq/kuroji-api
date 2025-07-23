export class ANILIBRIA {
  public static search(
    query: string,
    year?: number | null,
    season?: string | null,
  ): string {
    const params = new URLSearchParams();

    params.set('f[search]', query);
    params.set('limit', '25');

    if (year != null) {
      params.set('f[years][from_year]', year.toString());
      params.set('f[years][to_year]', year.toString());
    }

    if (season != null) {
      params.set('f[seasons]', season);
    }

    return `anime/catalog/releases?${params.toString()}`;
  }

  public static getAnime(id: number) {
    return `anime/releases/${id}`;
  }
}
