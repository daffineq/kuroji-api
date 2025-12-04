export const SHIKIMORI_INFO = `
  query ($ids: String) {
    animes(ids: $ids, page: 1, limit: 1) {
      id
      malId
      name
      russian
      licenseNameRu
      english
      japanese
      synonyms
      kind
      rating
      score
      status
      episodes
      franchise
      episodesAired
      duration
      airedOn { year month day date }
      releasedOn { year month day date }
      url
      season
      poster { id originalUrl mainUrl }
      createdAt
      updatedAt
      nextEpisodeAt
      videos { id url name kind playerUrl imageUrl }
      screenshots { id originalUrl x166Url x332Url }
      scoresStats { score count }
      statusesStats { status count }
      chronology { id }
      description
      descriptionHtml
      descriptionSource
    }
  }
`;
