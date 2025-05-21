import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class KitsuHelper {
  public getDataForPrisma(rawAnime: any): Prisma.KitsuCreateInput {
    const anime = rawAnime.data;
    const attrs = anime.attributes;

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

      anilist: {
        connect: {
          id: anime.anilistId,
        }
      }
    }
  }

  public getInclude(): Prisma.KitsuInclude {
    return {
      titles: {
        select: {
          en: true,
          en_jp: true,
          ja_jp: true,
        }
      },
      posterImage: {
        select: {
          tiny: true,
          small: true,
          medium: true,
          large: true,
          original: true,
          dimensions: {
            select: {
              tiny: {
                select: {
                  width: true,
                  height: true,
                }
              },
              small: {
                select: {
                  width: true,
                  height: true,
                }
              },
              medium: {
                select: {
                  width: true,
                  height: true,
                }
              },
              large: {
                select: {
                  width: true,
                  height: true,
                }
              },
            }
          }
        }
      },
      coverImage: {
        select: {
          tiny: true,
          small: true,
          large: true,
          original: true,
          dimensions: {
            select: {
              tiny: {
                select: {
                  width: true,
                  height: true,
                }
              },
              small: {
                select: {
                  width: true,
                  height: true,
                }
              },
              large: {
                select: {
                  width: true,
                  height: true,
                }
              },
            }
          }
        }
      },
    }
  }
}