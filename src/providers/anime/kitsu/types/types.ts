import { Prisma } from '@prisma/client';

export interface KitsuAnime {
  id: string;
  anilistId: number;
  type: string;
  links: KitsuLink;
  attributes: KitsuAnimeAttributes;
  relationships: KitsuAnimeRelationships;
}

export interface KitsuLink {
  self: string;
}

export interface KitsuAnimeAttributes {
  createdAt: string;
  updatedAt: string;
  slug: string;
  synopsis: string;
  coverImageTopOffset: number;
  titles: KitsuAnimeTitles;
  canonicalTitle: string;
  abbreviatedTitles: string[];
  averageRating: string;
  ratingFrequencies: Record<string, string>;
  userCount: number;
  favoritesCount: number;
  startDate: string;
  endDate: string;
  popularityRank: number;
  ratingRank: number;
  ageRating: string;
  ageRatingGuide: string;
  subtype: string;
  status: string;
  tba: string;
  posterImage: KitsuImageSetWithMeta;
  coverImage: KitsuImageSetWithMeta;
  episodeCount: number;
  episodeLength: number;
  youtubeVideoId: string;
  showType: string;
  nsfw: boolean;
}

export interface KitsuAnimeTitles {
  en?: string;
  en_jp?: string;
  ja_jp?: string;
  [key: string]: string | undefined;
}

export interface KitsuAnimeRelationships {
  genres: KitsuRelationshipLink;
  categories: KitsuRelationshipLink;
  castings: KitsuRelationshipLink;
  installments: KitsuRelationshipLink;
  mappings: KitsuRelationshipLink;
  reviews: KitsuRelationshipLink;
  mediaRelationships: KitsuRelationshipLink;
  episodes: KitsuRelationshipLink;
  streamingLinks: KitsuRelationshipLink;
  animeProductions: KitsuRelationshipLink;
  animeCharacters: KitsuRelationshipLink;
  animeStaff: KitsuRelationshipLink;
}

export interface KitsuRelationshipLink {
  links: {
    self: string;
    related: string;
  };
}

export interface KitsuImageSetWithMeta {
  tiny: string;
  small: string;
  medium?: string;
  large?: string;
  original: string;
  meta: {
    dimensions: {
      [size: string]: {
        width: number | null;
        height: number | null;
      };
    };
  };
}

export const kitsuSelect: Prisma.KitsuSelect = {
  id: true,
  anilistId: true,
  type: true,
  selfLink: true,

  createdAt: true,
  updatedAt: true,
  slug: true,
  synopsis: true,
  coverImageTopOffset: true,
  canonicalTitle: true,
  abbreviatedTitles: true,
  averageRating: true,
  ratingFrequencies: true,
  userCount: true,
  favoritesCount: true,
  startDate: true,
  endDate: true,
  popularityRank: true,
  ratingRank: true,
  ageRating: true,
  ageRatingGuide: true,
  subtype: true,
  status: true,
  tba: true,
  episodeCount: true,
  episodeLength: true,
  youtubeVideoId: true,
  showType: true,
  nsfw: true,
};

export type KitsuPayload = Prisma.KitsuGetPayload<{
  select: typeof kitsuSelect;
}>;
