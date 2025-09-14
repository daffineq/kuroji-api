import { Prisma } from '@prisma/client';
import { AnimepaheInfo, Title } from 'src/core/types';

export const getAnimepahePrismaData = (anime: AnimepaheInfo): Prisma.AnimepaheCreateInput => {
  return {
    id: anime.id as string,
    idMal: anime.idMal,

    titleEnglish: (anime.title as Title).english,
    titleRomaji: (anime.title as Title).romaji,
    titleJapanese: (anime.title as Title).japanese,

    synonyms: anime.synonyms ?? undefined,
    description: anime.description,
    image: anime.image as string,
    banner: anime.banner as string,
    airedEpisodes: anime.airedEpisodes,
    totalEpisodes: anime.totalEpisodes,

    updatedAt: Math.floor(Date.now() / 1000),

    year: anime.metadata?.year,
    season: anime.metadata?.season,
    status: anime.metadata?.status,
    type: anime.metadata?.type,
    startDate: anime.metadata?.startDate,
    endDate: anime.metadata?.endDate,
    duration: anime.metadata?.duration,
    genres: anime.metadata?.genres ?? undefined,
    studios: anime.metadata?.studios ?? undefined,
    themes: anime.metadata?.themes ?? undefined,
    demographics: anime.metadata?.demographics ?? undefined,

    episodes: {
      connectOrCreate:
        anime.episodes
          ?.filter((e) => e.id)
          .map((e) => ({
            where: { id: e.id as string },
            create: {
              id: e.id as string,
              number: e.number,
              title: e.title,
              image: e.image as string,
              duration: e.metadata?.duration,
              url: e.metadata?.url
            }
          })) || []
    },

    externalLinks: {
      connectOrCreate:
        anime.metadata?.externalLinks
          ?.filter((l) => l.id)
          .map((l) => ({
            where: { id: l.id },
            create: {
              id: l.id,
              url: l.url,
              sourceName: l.sourceName
            }
          })) || []
    },

    anilist: {
      connect: {
        id: anime.idAl!
      }
    }
  };
};
