import { Injectable } from '@nestjs/common';
import { Animepahe, Prisma } from '@prisma/client';

@Injectable()
export class AnimePaheHelper {
  getAnimePaheData(
    animePahe: any,
  ): Prisma.AnimepaheCreateInput {
    return {
      id: animePahe.id,
      title: animePahe.title,
      image: animePahe.image,
      cover: animePahe.cover,
      // updatedAt: Math.floor(Date.now() / 1000),
      hasSub: animePahe.hasSub,
      externalLinks: {
        connectOrCreate: animePahe.externalLinks.map((e: any) => ({
          where: { id: e.id },
          create: {
            id: e.id,
            url: e.url,
            sourceName: e.sourceName
          }
        })) ?? []
      },
      status: animePahe.status,
      type: animePahe.type,
      releaseDate: animePahe.releaseDate,
      totalEpisodes: animePahe.totalEpisodes,
      episodePages: animePahe.episodePages,
      episodes: {
        connectOrCreate: animePahe.episodes.map((e: any) => ({
          where: { id: e.id },
          create: {
            id: e.id,
            number: e.number,
            title: e.title,
            image: e.image,
            duration: e.duration,
            url: e.url
          }
        })) ?? []
      },
      anilist: {
        connect: {
          id: animePahe.alId
        }
      }
    };
  }
}
