import { Injectable } from '@nestjs/common'
import { BasicIdShik, Prisma, Shikimori } from '@prisma/client'
import { ShikimoriWithRelations } from '../types/types'

export type CreateShikimoriData = Prisma.ShikimoriCreateInput

@Injectable()
export class ShikimoriHelper {
  public getDataForPrisma(anime: ShikimoriWithRelations): CreateShikimoriData {
    return {
      id: anime.id,
      name: anime.name,
      russian: anime.russian,
      licenseNameRu: anime.licenseNameRu,
      english: anime.english,
      japanese: anime.japanese,
      synonyms: anime.synonyms,
      kind: anime.kind,
      rating: anime.rating,
      score: anime.score,
      status: anime.status,
      franchise: anime.franchise,
      episodes: anime.episodes,
      episodesAired: anime.episodesAired,
      duration: anime.duration,
      url: anime.url,
      season: anime.season,
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
      nextEpisodeAt: anime.nextEpisodeAt,

      poster: anime.poster
        ? {
          connectOrCreate: {
            where: { id: anime.poster.id },
            create: {
              id: anime.poster.id,
              originalUrl: anime.poster.originalUrl,
              mainUrl: anime.poster.mainUrl,
            },
          },
        }
        : undefined,

      airedOn: anime.airedOn
        ? {
          connectOrCreate: {
            where: { shikimoriId: anime.id },
            create: {
              year: anime.airedOn.year,
              month: anime.airedOn.month,
              day: anime.airedOn.day,
              date: anime.airedOn.date,
            }
          },
        }
        : undefined,

      releasedOn: anime.releasedOn
        ? {
          connectOrCreate: {
            where: { shikimoriId: anime.id },
            create: {
              year: anime.airedOn.year,
              month: anime.airedOn.month,
              day: anime.airedOn.day,
              date: anime.airedOn.date,
            }
          },
        }
        : undefined,

      chronology: anime.chronology?.length
        ? {
          connectOrCreate: anime.chronology.map((c) => ({
            where: { id: c.id },
            create: {
              id: c.id,
              malId: c.malId ?? null,
            },
          })),
        }
        : undefined,

      videos: anime.videos?.length
        ? {
          connectOrCreate: anime.videos.map((v) => ({
            where: { id: v.id },
            create: {
              id: v.id,
              url: v.url,
              name: v.name,
              kind: v.kind,
              playerUrl: v.playerUrl,
              imageUrl: v.imageUrl,
            },
          })),
        }
        : undefined,

      screenshots: anime.screenshots?.length
        ? {
          connectOrCreate: anime.screenshots.map((s) => ({
            where: { id: s.id },
            create: {
              id: s.id,
              originalUrl: s.originalUrl,
              x166Url: s.x166Url,
              x332Url: s.x332Url,
            },
          })),
        }
        : undefined,
      anilist: anime.malId ? {
        connect: {
          idMal: +anime.malId
        }
      } : undefined
    }
  }
}

export function shikimoriToBasicId(shikimori: Shikimori): BasicIdShik {
  return {
    id: shikimori.id,
    malId: String(shikimori.malId),
  }
}

export function getShikimoriInclude(): any {
  const include = {
    poster: {
      omit: {
        shikimoriId: true
      }
    },
    airedOn: {
      omit: {
        id: true,
        shikimoriId: true,
      }
    },
    releasedOn: {
      omit: {
        id: true,
        shikimoriId: true,
      }
    },
    videos: true,
    screenshots: true,
  }

  return include
}