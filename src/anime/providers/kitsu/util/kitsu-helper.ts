import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class KitsuHelper {
  public getDataForPrisma(rawAnime: any): Prisma.KitsuCreateInput {
    const anime = rawAnime.data;
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
      titles: attrs.titles ? {
        create: {
          en: attrs.titles.en,
          en_jp: attrs.titles.en_jp,
          ja_jp: attrs.titles.ja_jp,
        }
      } : undefined,

      posterImage: attrs.posterImage ? {
        create: {
          tiny: attrs.posterImage.tiny,
          small: attrs.posterImage.small,
          medium: attrs.posterImage.medium,
          large: attrs.posterImage.large,
          original: attrs.posterImage.original,
          dimensions: attrs.posterImage.meta?.dimensions ? {
            create: {
              tiny: {
                create: {
                  width: attrs.posterImage.meta.dimensions.tiny?.width,
                  height: attrs.posterImage.meta.dimensions.tiny?.height,
                }
              },
              small: {
                create: {
                  width: attrs.posterImage.meta.dimensions.small?.width,
                  height: attrs.posterImage.meta.dimensions.small?.height,
                }
              },
              medium: {
                create: {
                  width: attrs.posterImage.meta.dimensions.medium?.width,
                  height: attrs.posterImage.meta.dimensions.medium?.height,
                }
              },
              large: {
                create: {
                  width: attrs.posterImage.meta.dimensions.large?.width,
                  height: attrs.posterImage.meta.dimensions.large?.height,
                }
              },
            }
          } : undefined
        }
      } : undefined,

      coverImage: attrs.coverImage ? {
        create: {
          tiny: attrs.coverImage.tiny,
          small: attrs.coverImage.small,
          large: attrs.coverImage.large,
          original: attrs.coverImage.original,
          dimensions: attrs.coverImage.meta?.dimensions ? {
            create: {
              tiny: {
                create: {
                  width: attrs.coverImage.meta.dimensions.tiny?.width,
                  height: attrs.coverImage.meta.dimensions.tiny?.height,
                }
              },
              small: {
                create: {
                  width: attrs.coverImage.meta.dimensions.small?.width,
                  height: attrs.coverImage.meta.dimensions.small?.height,
                }
              },
              large: {
                create: {
                  width: attrs.coverImage.meta.dimensions.large?.width,
                  height: attrs.coverImage.meta.dimensions.large?.height,
                }
              },
            }
          } : undefined
        }
      } : undefined,

      // Relationships
      genres: relationships?.genres ? {
        create: {
          selfLink: relationships.genres.links.self,
          related: relationships.genres.links.related,
        }
      } : undefined,

      categories: relationships?.categories ? {
        create: {
          selfLink: relationships.categories.links.self,
          related: relationships.categories.links.related,
        }
      } : undefined,

      castings: relationships?.castings ? {
        create: {
          selfLink: relationships.castings.links.self,
          related: relationships.castings.links.related,
        }
      } : undefined,

      installments: relationships?.installments ? {
        create: {
          selfLink: relationships.installments.links.self,
          related: relationships.installments.links.related,
        }
      } : undefined,

      mappings: relationships?.mappings ? {
        create: {
          selfLink: relationships.mappings.links.self,
          related: relationships.mappings.links.related,
        }
      } : undefined,

      reviews: relationships?.reviews ? {
        create: {
          selfLink: relationships.reviews.links.self,
          related: relationships.reviews.links.related,
        }
      } : undefined,

      mediaRelationships: relationships?.mediaRelationships ? {
        create: {
          selfLink: relationships.mediaRelationships.links.self,
          related: relationships.mediaRelationships.links.related,
        }
      } : undefined,

      episodes: relationships?.episodes ? {
        create: {
          selfLink: relationships.episodes.links.self,
          related: relationships.episodes.links.related,
        }
      } : undefined,

      streamingLinks: relationships?.streamingLinks ? {
        create: {
          selfLink: relationships.streamingLinks.links.self,
          related: relationships.streamingLinks.links.related,
        }
      } : undefined,

      animeProductions: relationships?.animeProductions ? {
        create: {
          selfLink: relationships.animeProductions.links.self,
          related: relationships.animeProductions.links.related,
        }
      } : undefined,

      animeCharacters: relationships?.animeCharacters ? {
        create: {
          selfLink: relationships.animeCharacters.links.self,
          related: relationships.animeCharacters.links.related,
        }
      } : undefined,

      animeStaff: relationships?.animeStaff ? {
        create: {
          selfLink: relationships.animeStaff.links.self,
          related: relationships.animeStaff.links.related,
        }
      } : undefined,

      anilist: anime.anilistId ? {
        connect: {
          id: anime.anilistId,
        }
      } : undefined,
    }
  }

  public getInclude(): Prisma.KitsuInclude {
    return {
      titles: {
        omit: {
          id: true,
          kitsuId: true,
        }
      },
      posterImage: {
        omit: {
          id: true,
          kitsuId: true,
        },
        include: {
          dimensions: {
            omit: {
              id: true,
              posterImageId: true,
              coverImageId: true,
            },
            include: {
              tiny: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              },
              small: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              },
              medium: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              },
              large: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              }
            }
          }
        }
      },
      coverImage: {
        omit: {
          id: true,
          kitsuId: true,
        },
        include: {
          dimensions: {
            omit: {
              id: true,
              posterImageId: true,
              coverImageId: true,
            },
            include: {
              tiny: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              },
              small: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              },
              large: {
                omit: {
                  id: true,
                  tinyDimensionId: true,
                  smallDimensionId: true,
                  mediumDimensionId: true,
                  largeDimensionId: true,
                }
              }
            }
          }
        }
      },
      // One-to-One relation includes
      genres: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      categories: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      castings: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      installments: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      mappings: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      reviews: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      mediaRelationships: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      episodes: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      streamingLinks: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      animeProductions: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      animeCharacters: {
        select: {
          selfLink: true,
          related: true,
        }
      },
      animeStaff: {
        select: {
          selfLink: true,
          related: true,
        }
      }
    }
  }
}