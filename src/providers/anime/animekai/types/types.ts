import { Prisma } from '@prisma/client';

export const animeKaiSelect: Prisma.AnimeKaiSelect = {
  id: true,
  anilistId: true,
  title: true,
  japaneseTitle: true,
  image: true,
  description: true,
  type: true,
  url: true,
  updatedAt: true,
  subOrDub: true,
  hasSub: true,
  hasDub: true,
  status: true,
  season: true,
  totalEpisodes: true,

  episodes: {
    select: {
      id: true,
      number: true,
      title: true,
      isFiller: true,
      isSubbed: true,
      isDubbed: true,
      url: true,
    },
  },
};

export type AnimeKaiPayload = Prisma.AnimeKaiGetPayload<{
  select: typeof animeKaiSelect;
}>;
