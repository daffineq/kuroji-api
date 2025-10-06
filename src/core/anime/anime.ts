import { Prisma } from '@prisma/client';
import { AnilistMedia } from './providers/anilist/types';
import prisma from 'src/lib/prisma';
import { getAnimePrismaData } from './helpers/anime.prisma';
import anilist from './providers/anilist/anilist';
import mappings from './mappings/mappings';
import { MetaInfo } from 'src/helpers/response';
import { BadRequestError } from 'src/helpers/errors';

class Anime {
  async initOrGet<T extends Prisma.AnimeDefaultArgs>(
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

  async update<T extends Prisma.AnimeDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    const al = await anilist.getInfo(id);

    return this.save(al, args);
  }

  async many<T extends Prisma.AnimeFindManyArgs>(
    find?: T
  ): Promise<{ meta: MetaInfo; data: Prisma.AnimeGetPayload<T>[] }> {
    if (find?.take && find.take > 50) {
      throw new BadRequestError('Nawwww, Maximum take is 50');
    }

    const [total, data] = await Promise.all([
      prisma.anime.count({ where: find?.where }),
      prisma.anime.findMany(find)
    ]);

    const page = find?.skip ? Math.floor(find.skip / (find.take ?? 1)) + 1 : 1;
    const perPage = find?.take || 1;

    return {
      meta: { total, page, perPage, hasNextPage: total > page * perPage },
      data: data as Prisma.AnimeGetPayload<T>[]
    };
  }

  async first<T extends Prisma.AnimeFindFirstArgs>(find?: T) {
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

    await this.initProviders(al.id);

    return prisma.anime.findUnique({
      where: { id: al.id },
      ...(args as Prisma.AnimeDefaultArgs)
    }) as unknown as Promise<Prisma.AnimeGetPayload<T>>;
  }

  private async initProviders(id: number) {
    await mappings.loadMappings(id);
  }
}

const anime = new Anime();

export default anime;
