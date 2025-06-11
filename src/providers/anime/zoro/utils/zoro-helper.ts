import { IAnimeEpisode, IAnimeInfo } from '@consumet/extensions';
import { Prisma } from '@prisma/client';

export function getZoroData(anime: IAnimeInfo): Prisma.ZoroCreateInput {
  return {
    id: anime.id,
    title: typeof anime.title === 'object' ? anime.title.romaji : anime.title,
    malID: anime.malID as number,
    japaneseTitle: anime.japaneseTitle as string,
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
      connectOrCreate:
        (anime?.episodes ?? []).map((e: IAnimeEpisode) => ({
          where: { id: e.id },
          create: {
            id: e.id,
            number: e.number,
            title: e.title,
            isFiller: e.isFiller,
            isSubbed: e.isSubbed,
            isDubbed: e.isDubbed,
            url: e.url,
          },
        })) ?? [],
    },
    anilist: {
      connect: {
        id: anime.alID as number,
      },
    },
  };
}
