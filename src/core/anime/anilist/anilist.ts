import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import { AnilistMedia } from './types';
import { getAnilistPrismaData } from './helpers/anilist.prisma';
import anilistFetch from './helpers/anilist.fetch';
import mappings from '../mappings/mappings';

class Anilist {
  async getInfo<T extends Prisma.AnilistSelect>(
    id: number,
    select?: T
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    const existing = await prisma.anilist.findUnique({
      where: { id },
      select
    });

    if (existing) {
      return existing as Prisma.AnilistGetPayload<{ select: T }>;
    }

    const anilist = await anilistFetch.fetchInfo(id);

    return this.save(anilist, select);
  }

  async getAndJustSave<T extends Prisma.AnilistSelect>(
    id: number,
    select?: T
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    const existing = await prisma.anilist.findUnique({
      where: { id },
      select
    });

    if (existing) {
      return existing as Prisma.AnilistGetPayload<{ select: T }>;
    }

    const anilist = await anilistFetch.fetchInfo(id);

    return this.justSave(anilist, select);
  }

  private async save<T extends Prisma.AnilistSelect>(
    data: AnilistMedia,
    select?: T
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    await this.justSave(data, select);

    await Promise.all([]);

    return prisma.anilist.findUnique({
      where: { id: data.id },
      select
    }) as Prisma.AnilistGetPayload<{ select: T }>;
  }

  private async justSave<T extends Prisma.AnilistSelect>(
    data: AnilistMedia,
    select?: T
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    return prisma.anilist.upsert({
      where: { id: data.id },
      update: await getAnilistPrismaData(data),
      create: await getAnilistPrismaData(data),
      select
    }) as Prisma.AnilistGetPayload<{ select: T }>;
  }
}

export default new Anilist();
