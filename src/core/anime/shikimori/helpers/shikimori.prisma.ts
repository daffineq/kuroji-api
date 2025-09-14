import { Prisma } from '@prisma/client';
import { ShikimoriAnime } from '../types';

export const getShikimoriPrismaData = (anime: ShikimoriAnime): Prisma.ShikimoriCreateInput => {
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
    description: anime.description,
    descriptionHtml: anime.descriptionHtml,
    descriptionSource: anime.descriptionSource,

    poster: anime.poster
      ? {
          connectOrCreate: {
            where: { id: anime.poster.id },
            create: {
              id: anime.poster.id,
              originalUrl: anime.poster.originalUrl,
              mainUrl: anime.poster.mainUrl
            }
          }
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
              date: anime.airedOn.date
            }
          }
        }
      : undefined,

    releasedOn: anime.releasedOn
      ? {
          connectOrCreate: {
            where: { shikimoriId: anime.id },
            create: {
              year: anime.releasedOn.year,
              month: anime.releasedOn.month,
              day: anime.releasedOn.day,
              date: anime.releasedOn.date
            }
          }
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
              imageUrl: v.imageUrl
            }
          }))
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
              x332Url: s.x332Url
            }
          }))
        }
      : undefined,
    anilist: anime.id
      ? {
          connect: {
            idMal: +anime.id
          }
        }
      : undefined
  };
};
