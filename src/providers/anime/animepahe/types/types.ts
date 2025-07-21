import { Prisma } from '@prisma/client';

export const animepaheSelect: Prisma.AnimepaheSelect = {
  id: true,
  alId: true,
  title: true,
  image: true,
  cover: true,
  updatedAt: true,
  hasSub: true,
  status: true,
  type: true,
  releaseDate: true,
  totalEpisodes: true,
  episodePages: true,

  externalLinks: {
    select: {
      id: true,
      url: true,
      sourceName: true,
    },
  },
  episodes: {
    select: {
      id: true,
      number: true,
      title: true,
      image: true,
      duration: true,
      url: true,
    },
  },
};

export type AnimepahePayload = Prisma.AnimepaheGetPayload<{
  select: typeof animepaheSelect;
}>;
