export const ANILIST_INFO = `
  query Query($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      status
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
      updatedAt
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
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
      characters {
        edges {
          favouriteOrder
          id
          name
          node {
            id
            name {
              first
              middle
              last
              full
              native
              alternative
              alternativeSpoiler
              userPreferred
            }
            image {
              large
              medium
            }
            description
            gender
            dateOfBirth {
              year
              month
              day
            }
            age
            bloodType
            isFavourite
            isFavouriteBlocked
            siteUrl
            favourites
            modNotes
          }
          role
          voiceActors {
            age
            bloodType
            dateOfBirth {
              year
              month
              day
            }
            dateOfDeath {
              year
              month
              day
            }
            description
            favourites
            gender
            homeTown
            id
            image {
              large
              medium
            }
            languageV2
            name {
              first
              middle
              last
              full
              native
              alternative
              userPreferred
            }
            siteUrl
          }
        }
      }
      studios {
        edges {
          favouriteOrder
          id
          isMain
          node {
            favourites
            id
            isAnimationStudio
            name
            siteUrl
          }
        }
      }
      isAdult
      nextAiringEpisode {
        airingAt
        episode
        id
        mediaId
        timeUntilAiring
      }
      airingSchedule {
        edges {
          id
          node {
            airingAt
            episode
            id
            mediaId
            timeUntilAiring
          }
        }
      }
      externalLinks {
        id
        url
        site
        siteId
        type
        language
        color
        icon
        notes
        isDisabled
      }
      streamingEpisodes {
        title
        thumbnail
        url
        site
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
      siteUrl
    }
  }`;
