import { Prisma } from '@prisma/client';
import { AnilistMedia } from './anilist/types';
import prisma from 'src/lib/prisma';
import { getAnimePrismaData } from './helpers/anime.prisma';
import anilist from './anilist/anilist';
import mal from './mal/mal';
import shikimori from './shikimori/shikimori';
import tmdb from './tmdb/tmdb';
import tvdb from './tvdb/tvdb';
import tmdbSeasons from './tmdb/helpers/tmdb.seasons';

class Anime {
  async getInfo<T extends Prisma.AnimeDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    const existing = await prisma.anime.findUnique({
      where: { id },
      ...(args as Prisma.AnimeDefaultArgs)
    });

    if (existing) {
      return existing as Prisma.AnimeGetPayload<T>;
    }

    const al = await anilist.getInfo(id);

    return this.save(al, args);
  }

  async findMany<T extends Prisma.AnimeFindManyArgs>(find?: T) {
    return prisma.anime.findMany(find);
  }

  async findFirst<T extends Prisma.AnimeFindFirstArgs>(find?: T) {
    return prisma.anime.findFirst(find);
  }

  async save<T extends Prisma.AnimeDefaultArgs>(
    al: AnilistMedia,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    await prisma.anime.upsert({
      where: { id: al.id },
      update: await getAnimePrismaData(al),
      create: await getAnimePrismaData(al)
    });

    await Promise.all([mal.getInfo(al.id), shikimori.getInfo(al.id), tmdb.getInfo(al.id), tvdb.getInfo(al.id)]);

    await tmdbSeasons.getSeason(al.id);

    return prisma.anime.findUnique({
      where: { id: al.id },
      ...(args as Prisma.AnimeDefaultArgs)
    }) as unknown as Promise<Prisma.AnimeGetPayload<T>>;
  }
}

export default new Anime();
