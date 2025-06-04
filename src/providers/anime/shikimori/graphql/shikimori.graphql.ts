export class GraphQL {
  /**
   * Generates a GraphQL query for fetching Shikimori anime data.
   * @param ids - A comma-separated string of anime IDs.
   * @param page - The page number for pagination.
   * @param perPage - The number of items per page.
   * @returns The GraphQL query as a string.
   */
  public static getShikimoriAnime(
    ids: string,
    page: number,
    perPage: number,
  ): string {
    const includeChronology = !ids.includes(',');
    const fields = this.buildFields(includeChronology);

    return `{ animes(ids: "${ids}", page: ${page}, limit: ${perPage}) { ${fields} } }`;
  }

  /**
   * Builds the fields to be included in the GraphQL query.
   * @param includeChronology - Whether to include the chronology field.
   * @returns The fields as a string.
   */
  private static buildFields(includeChronology: boolean): string {
    const fields = [
      'id',
      'malId',
      'name',
      'russian',
      'licenseNameRu',
      'english',
      'japanese',
      'synonyms',
      'kind',
      'rating',
      'score',
      'status',
      'episodes',
      'franchise',
      'episodesAired',
      'duration',
      'airedOn { year month day date }',
      'releasedOn { year month day date }',
      'url',
      'season',
      'poster { id originalUrl mainUrl }',
      'createdAt',
      'updatedAt',
      'nextEpisodeAt',
      'videos { id url name kind playerUrl imageUrl }',
      'screenshots { id originalUrl x166Url x332Url }',
      'scoresStats { score count }',
      'statusesStats { status count }',
      'description',
      'descriptionHtml',
    ];

    if (includeChronology) {
      fields.push('chronology { id malId }');
    }

    return fields.join(' ');
  }
}
