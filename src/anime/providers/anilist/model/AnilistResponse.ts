export interface FullMediaResponse {
  id: number
  idMal: number
  title: {
    romaji: string
    english: string
    native: string
  }
  status: string
  type: string
  format: string
  updatedAt: number
  coverImage: {
    extraLarge: string
    large: string
    medium: string
    color: string | null
  }
  recommendations: {
    edges: {
      node: {
        id: number
        rating: number
        mediaRecommendation: {
          id: number
          idMal: number
        }
      }
    }[]
  }
  description: string
  startDate: {
    year: number
    month: number
    day: number
  }
  endDate: {
    year: number
    month: number
    day: number
  }
  season: string
  seasonYear: number
  episodes: number
  duration: number
  countryOfOrigin: string
  isLicensed: boolean
  source: string
  hashtag: string
  trailer: {
    id: string
    site: string
    thumbnail: string
  } | null
  genres: string[]
  synonyms: string[]
  averageScore: number
  meanScore: number
  popularity: number
  isLocked: boolean
  trending: number
  favourites: number
  tags: {
    id: number
    name: string
    description: string
    category: string
    rank: number
    isGeneralSpoiler: boolean
    isMediaSpoiler: boolean
    isAdult: boolean
  }[]
  rankings: {
    id: number
    rank: number
    type: string
    format: string
    year: number
    season: string
    allTime: boolean
    context: string
  }[]
  characters: {
    edges: {
      id: number
      node: {
        id: number
        name: {
          full: string
          native: string
          alternative: string[]
        }
        image: {
          large: string
          medium: string
        }
      }
      role: string
      voiceActors: {
        id: number
        image: {
          large: string
          medium: string
        }
        name: {
          full: string
          native: string
          alternative: string[]
        }
        languageV2: string
      }[]
    }[]
  }
  studios: {
    edges: {
      id: number
      isMain: boolean
      node: {
        id: number
        name: string
      }
    }[]
  }
  isAdult: boolean
  nextAiringEpisode: {
    id: number
    airingAt: number
    episode: number
  } | null
  airingSchedule: {
    edges: {
      node: {
        id: number
        airingAt: number
        episode: number
      }
    }[]
  }
  externalLinks: {
    id: number
    url: string
    site: string
    type: string
  }[]
  streamingEpisodes: {
    title: string
    thumbnail: string
    url: string
    site: string
  }[]
  stats: {
    scoreDistribution: {
      score: number
      amount: number
    }[]
    statusDistribution: {
      status: string
      amount: number
    }[]
  }
  bannerImage: string
}
