import AnilistQueryBuilder from './query/AnilistQueryBuilder'

type FieldTypeMap = { [key: string]: string };

export default class AnilistQL {
  private static readonly FIELD_TYPE_MAP: FieldTypeMap = {
    page: 'Int',
    perPage: 'Int',
    sort: '[AiringSort]',
    airingAt_greater: 'Int',
    airingAt_lesser: 'Int',
    episode_lesser: 'Int',
    episode_greater: 'Int',
    episode_not_in: '[Int]',
    episode_in: '[Int]',
    episode_not: 'Int',
    mediaId_not_in: '[Int]',
    mediaId_in: '[Int]',
    mediaId_not: 'Int',
    notYetAired: 'Boolean',
    airingAt: 'Int',
    episode: 'Int',
    mediaId: 'Int',
    airingSchedulesId: 'Int',
    timeUntilAiring: 'Int',
    source_in: '[MediaSource]',
    popularity_lesser: 'Int',
    popularity_greater: 'Int',
    popularity_not: 'Int',
    averageScore_lesser: 'Int',
    averageScore_greater: 'Int',
    averageScore_not: 'Int',
    licensedById_in: '[Int]',
    licensedBy_in: '[String]',
    tagCategory_not_in: '[String]',
    tagCategory_in: '[String]',
    tag_not_in: '[String]',
    tag_in: '[String]',
    genre_not_in: '[String]',
    genre_in: '[String]',
    duration_lesser: 'Int',
    duration_greater: 'Int',
    episodes_lesser: 'Int',
    episodes_greater: 'Int',
    status_not_in: '[MediaStatus]',
    status_not: 'MediaStatus',
    status_in: '[MediaStatus]',
    format_not_in: '[MediaFormat]',
    format_not: 'MediaFormat',
    format_in: '[MediaFormat]',
    endDate_like: 'String',
    endDate_lesser: 'String',
    endDate_greater: 'String',
    startDate_like: 'String',
    startDate_lesser: 'String',
    startDate_greater: 'String',
    idMal_not_in: '[Int]',
    idMal_in: '[Int]',
    idMal_not: 'Int',
    id_not_in: '[Int]',
    id_in: '[Int]',
    id_not: 'Int',
    search: 'String',
    isLicensed: 'Boolean',
    countryOfOrigin: 'String',
    isAdult: 'Boolean',
    format: 'MediaFormat',
    type: 'MediaType',
    status: 'MediaStatus',
    season: 'MediaSeason',
    id: 'Int',
    idMal: 'Int',
  };

  public static getGraphQLType(fieldName: string): string {
    return this.FIELD_TYPE_MAP[fieldName] || 'String';
  }

  public static getQuery(builder: AnilistQueryBuilder): string {
    const fields = this.buildFullFields();
    const allVariables = builder.build();
    const mediaVariables = builder.buildMedia();
    
    const variables = Object.keys(allVariables)
      .map((key) => `$${key}: ${this.getGraphQLType(key)}`)
      .join(', ');
    
    const mediaAssignments = Object.keys(mediaVariables)
      .map((key) => `${key}: $${key}`)
      .join(', ');

    const query = `
      query (${variables}) {
        Page(page: $page, perPage: $perPage) {
          media(${mediaAssignments}) {
            ${fields}
          }
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
        }
      }
    `;

    return query.trim();
  }

  private static buildFullFields(): string {
    return `
      id
      idMal
      title {
        romaji
        english
        native
      }
      status
      type
      format
      updatedAt
      coverImage {
        extraLarge
        large
        medium
        color
      }
      recommendations {
        edges {
          node {
            id
            rating
            mediaRecommendation {
              id
              idMal
            }
          }
        }
      }
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      seasonYear
      episodes
      duration
      countryOfOrigin
      isLicensed
      source
      hashtag
      trailer {
        id
        site
        thumbnail
      }
      genres
      synonyms
      averageScore
      meanScore
      popularity
      isLocked
      trending
      favourites
      tags {
        id
        name
        description
        category
        rank
        isGeneralSpoiler
        isMediaSpoiler
        isAdult
      }
      rankings {
        id
        rank
        type
        format
        year
        season
        allTime
        context
      }
      characters {
        edges {
          id
          node {
            id
            name {
              full
              native
              alternative
            }
            image {
              large
              medium
            }
          }
          role
          voiceActors {
            id
            image {
              large
              medium
            }
            name {
              full
              native
              alternative
            }
            languageV2
          }
        }
      }
      studios {
        edges {
          id
          isMain
          node {
            id
            name
          }
        }
      }
      isAdult
      nextAiringEpisode {
        id
        airingAt
        timeUntilAiring
        episode
      }
      airingSchedule {
        edges {
          node {
            id
            airingAt
            timeUntilAiring
            episode
          }
        }
      }
      externalLinks {
        id
        url
        site
        type
      }
      streamingEpisodes {
        title
        url
        site
      }
      stats {
        scoreDistribution {
          score
          amount
        }
        statusDistribution {
          status
          amount
        }
      }
      bannerImage
    `.replace(/\s+/g, ' ').trim();
  }

  public static getSimplePageQuery(builder: AnilistQueryBuilder): string {
    const variables = Object.keys(builder.buildMedia())
      .map((key) => `$${key}: ${this.getGraphQLType(key)}`)
      .join(', ');
    const variableAssignments = Object.keys(builder.buildMedia())
      .map((key) => `${key}: $${key}`)
      .join(', ');

    return `
    query Page($page: Int, $perPage: Int, ${variables}) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(${variableAssignments}) {
          id
        }
      }
    }
  `.trim();
  }
}