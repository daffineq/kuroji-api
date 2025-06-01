import { IAnimeEpisode, IAnimeInfo } from '@consumet/extensions'
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimeKaiHelper {
  getAnimekaiData(anime: IAnimeInfo): Prisma.AnimeKaiCreateInput {
    return {
      id: anime.id,
      title: typeof anime.title === 'object' ? anime.title.romaji : anime.title,
      japaneseTitle: anime.japaneseTitle,
      image: anime.image,
      description: anime.description,
      type: anime.type,
      url: anime.url,
      // updatedAt: new Date(),
      subOrDub: anime.subOrDub,
      hasSub: anime.hasSub,
      hasDub: anime.hasDub,
      status: anime.status,
      season: anime.season,
      totalEpisodes: anime.totalEpisodes,
      episodes: {
        connectOrCreate: (anime?.episodes ?? []).map((e: IAnimeEpisode) => ({
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
