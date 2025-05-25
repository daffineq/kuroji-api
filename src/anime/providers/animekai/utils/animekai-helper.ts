import { Injectable } from '@nestjs/common';
import { AnimeKai, Prisma } from '@prisma/client';

@Injectable()
export class AnimeKaiHelper {
  getAnimekaiData(anime: any): Prisma.AnimeKaiCreateInput {
    return {
      id: anime.id,
      title: anime.title,
      japaneseTitle: anime.japaneseTitle,
      image: anime.image,
      description: anime.description,
      type: anime.type,
      url: anime.url,
      updatedAt: Math.floor(Date.now() / 1000),
      subOrDub: anime.subOrDub,
      hasSub: anime.hasSub,
      hasDub: anime.hasDub,
      status: anime.status,
      season: anime.season,
      totalEpisodes: anime.totalEpisodes,
      episodes: {
        connectOrCreate: anime.episodes.map((e: any) => ({
          where: { id: e.id },
          create: {
            id: e.id,
            number: e.number,
            title: e.title,
            isFiller: e.isFiller,
            isSubbed: e.isSubbed,
            isDubbed: e.isDubbed,
            url: e.url
          }
        })) ?? []
      },
      anilist: {
        connect: {
          id: anime.anilistId
        }
      }
    };
  }
}
