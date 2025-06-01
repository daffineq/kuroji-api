import { IAnimeInfo } from '@consumet/extensions'
import { ExternalLink, IAnimeEpisode } from '@consumet/extensions/dist/models/types'
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimePaheHelper {
  getAnimePaheData(
    anime: IAnimeInfo,
  ): Prisma.AnimepaheCreateInput {
    return {
      id: anime.id,
      title: typeof anime.title === 'object' ? anime.title.romaji : anime.title,
      image: anime.image,
      cover: anime.cover,
      // updatedAt: new Date(),
      hasSub: anime.hasSub,
      externalLinks: {
        connectOrCreate: (anime?.externalLinks ?? [])
          .filter((e): e is Required<ExternalLink> => 
            e?.id != null && e?.url != null && e?.sourceName != null)
          .map((e) => ({
            where: { id: e.id },
            create: {
              id: e.id,
              url: e.url,
              sourceName: e.sourceName
            }
          }))
      },
      status: anime.status,
      type: anime.type,
      releaseDate: anime.releaseDate,
      totalEpisodes: anime.totalEpisodes,
      episodePages: anime.episodePages,
      episodes: {
        connectOrCreate: (anime?.episodes ?? []).map((e: IAnimeEpisode) => ({
          where: { id: e.id },
          create: {
            id: e?.id,
            number: e?.number,
            title: e?.title,
            image: e?.image,
            duration: e?.duration?.toString(),
            url: e?.url
          }
        })) ?? []
      },
      anilist: {
        connect: {
          id: anime.alId
        }
      }
    };
  }
}
