import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import shikimoriFetch from './helpers/shikimori.fetch';
import { ShikimoriAnime } from './types';
import { getShikimoriPrismaData } from './helpers/shikimori.prisma';

class Shikimori {
  async getInfo<T extends Prisma.ShikimoriSelect>(
    id: string,
    select?: T
  ): Promise<Prisma.ShikimoriGetPayload<{ select: T }>> {
    const existing = await prisma.shikimori.findUnique({
      where: { id: id },
      select
    });

    if (existing) {
      return existing as Prisma.ShikimoriGetPayload<{ select: T }>;
    }

    const fetched = await shikimoriFetch.getInfo(id);

    return this.save(fetched, select);
  }

  async save<T extends Prisma.ShikimoriSelect>(
    data: ShikimoriAnime,
    select?: T
  ): Promise<Prisma.ShikimoriGetPayload<{ select: T }>> {
    return prisma.shikimori.upsert({
      where: { id: data.id },
      create: getShikimoriPrismaData(data),
      update: getShikimoriPrismaData(data),
      select
    }) as Promise<Prisma.ShikimoriGetPayload<{ select: T }>>;
  }
}

export default new Shikimori();
