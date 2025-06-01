import { Kitsu, KitsuTitle, KitsuPosterImage, KitsuCoverImage } from '@prisma/client'

export interface KitsuWithRelations extends Kitsu {
  titles: KitsuTitle;
  posterImage: KitsuPosterImage;
  coverImage: KitsuCoverImage;
}

export interface KitsuAnime {
  id: string
  anilistId: number
  type: string
  links: {
    self: string
  }
  attributes: {
    createdAt: string
    updatedAt: string
    slug: string
    synopsis: string
    coverImageTopOffset: number
    titles: {
      en?: string
      en_jp?: string
      ja_jp?: string;
      [key: string]: string | undefined
    }
    canonicalTitle: string
    abbreviatedTitles: string[]
    averageRating: string
    ratingFrequencies: Record<string, string>
    userCount: number
    favoritesCount: number
    startDate: string
    endDate: string
    popularityRank: number
    ratingRank: number
    ageRating: string
    ageRatingGuide: string
    subtype: string
    status: string
    tba: string
    posterImage: KitsuImageSetWithMeta
    coverImage: KitsuImageSetWithMeta
    episodeCount: number
    episodeLength: number
    youtubeVideoId: string
    showType: string
    nsfw: boolean
  }
  relationships: {
    genres: KitsuRelationshipLink
    categories: KitsuRelationshipLink
    castings: KitsuRelationshipLink
    installments: KitsuRelationshipLink
    mappings: KitsuRelationshipLink
    reviews: KitsuRelationshipLink
    mediaRelationships: KitsuRelationshipLink
    episodes: KitsuRelationshipLink
    streamingLinks: KitsuRelationshipLink
    animeProductions: KitsuRelationshipLink
    animeCharacters: KitsuRelationshipLink
    animeStaff: KitsuRelationshipLink
  }
}

interface KitsuRelationshipLink {
  links: {
    self: string
    related: string
  }
}

interface KitsuImageSetWithMeta {
  tiny: string
  small: string
  medium?: string
  large?: string
  original: string
  meta: {
    dimensions: {
      [size: string]: {
        width: number | null
        height: number | null
      }
    }
  }
}
