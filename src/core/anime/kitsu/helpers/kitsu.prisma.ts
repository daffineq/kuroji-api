import { Prisma } from '@prisma/client';
import { KitsuAnime } from '../types';

export const getKitsuPrismaData = (anime: KitsuAnime): Prisma.KitsuCreateInput => {
  const attrs = anime.attributes;
  const relationships = anime.relationships;

  return {
    id: anime.id,
    type: anime.type,
    selfLink: anime.links?.self,

    // Attributes
    createdAt: attrs.createdAt ? new Date(attrs.createdAt) : null,
    updatedAt: attrs.updatedAt ? new Date(attrs.updatedAt) : null,
    slug: attrs.slug,
    synopsis: attrs.synopsis,
    coverImageTopOffset: attrs.coverImageTopOffset,
    canonicalTitle: attrs.canonicalTitle,
    abbreviatedTitles: attrs.abbreviatedTitles || [],
    averageRating: attrs.averageRating,
    ratingFrequencies: attrs.ratingFrequencies,
    userCount: attrs.userCount,
    favoritesCount: attrs.favoritesCount,
    startDate: attrs.startDate ? new Date(attrs.startDate) : null,
    endDate: attrs.endDate ? new Date(attrs.endDate) : null,
    popularityRank: attrs.popularityRank,
    ratingRank: attrs.ratingRank,
    ageRating: attrs.ageRating,
    ageRatingGuide: attrs.ageRatingGuide,
    subtype: attrs.subtype,
    status: attrs.status,
    tba: attrs.tba,
    episodeCount: attrs.episodeCount,
    episodeLength: attrs.episodeLength,
    youtubeVideoId: attrs.youtubeVideoId,
    showType: attrs.showType,
    nsfw: attrs.nsfw || false,

    // One-to-One Relations
    titles: attrs.titles
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              en: attrs.titles.en ?? null,
              en_jp: attrs.titles.en_jp ?? null,
              ja_jp: attrs.titles.ja_jp ?? null
            }
          }
        }
      : undefined,

    posterImage: attrs.posterImage
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              tiny: attrs.posterImage.tiny ?? null,
              small: attrs.posterImage.small ?? null,
              medium: attrs.posterImage.medium ?? null,
              large: attrs.posterImage.large ?? null,
              original: attrs.posterImage.original ?? null
            }
          }
        }
      : undefined,

    coverImage: attrs.coverImage
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              tiny: attrs.coverImage.tiny ?? null,
              small: attrs.coverImage.small ?? null,
              large: attrs.coverImage.large ?? null,
              original: attrs.coverImage.original ?? null
            }
          }
        }
      : undefined,

    // Relationships
    categories: relationships?.categories
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.categories.links.self,
              related: relationships.categories.links.related
            }
          }
        }
      : undefined,

    castings: relationships?.castings
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.castings.links.self,
              related: relationships.castings.links.related
            }
          }
        }
      : undefined,

    installments: relationships?.installments
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.installments.links.self,
              related: relationships.installments.links.related
            }
          }
        }
      : undefined,

    mappings: relationships?.mappings
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.mappings.links.self,
              related: relationships.mappings.links.related
            }
          }
        }
      : undefined,

    reviews: relationships?.reviews
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.reviews.links.self,
              related: relationships.reviews.links.related
            }
          }
        }
      : undefined,

    mediaRelationships: relationships?.mediaRelationships
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.mediaRelationships.links.self,
              related: relationships.mediaRelationships.links.related
            }
          }
        }
      : undefined,

    episodes: relationships?.episodes
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.episodes.links.self,
              related: relationships.episodes.links.related
            }
          }
        }
      : undefined,

    streamingLinks: relationships?.streamingLinks
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.streamingLinks.links.self,
              related: relationships.streamingLinks.links.related
            }
          }
        }
      : undefined,

    animeProductions: relationships?.animeProductions
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.animeProductions.links.self,
              related: relationships.animeProductions.links.related
            }
          }
        }
      : undefined,

    animeCharacters: relationships?.animeCharacters
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.animeCharacters.links.self,
              related: relationships.animeCharacters.links.related
            }
          }
        }
      : undefined,

    animeStaff: relationships?.animeStaff
      ? {
          connectOrCreate: {
            where: {
              kitsuId: anime.id
            },
            create: {
              selfLink: relationships.animeStaff.links.self,
              related: relationships.animeStaff.links.related
            }
          }
        }
      : undefined,

    anilist: anime.anilistId
      ? {
          connect: {
            id: anime.anilistId
          }
        }
      : undefined
  };
};
