import { Prisma, TmdbSeasonEpisode } from '@prisma/client';
import prisma from 'src/lib/prisma';
import { MappingEntry } from './types';
import {
  addMappingsPrismaData,
  addOrUpdateEpisodes,
  editMappingsPrismaData,
  getMappingsPrismaData,
  removeMappingsPrismaData
} from './helpers/mappings.prisma';
import mappingsFetch from './helpers/mappings.fetch';
import { toMappingsArray } from './helpers/mappings.utils';
import anilist from '../anilist/anilist';

class Mappings {
  async getMappings<T extends Prisma.MappingsSelect>(
    id: number,
    select?: T
  ): Promise<Prisma.MappingsGetPayload<{ select: T }>> {
    await anilist.getAndJustSave(id);

    const existing = await prisma.mappings.findUnique({
      where: { id },
      select
    });

    if (existing) {
      return existing as Prisma.MappingsGetPayload<{ select: T }>;
    }

    const fetched = await mappingsFetch.fetchMappings(id);
    const mappings = toMappingsArray(fetched.mappings);

    return this.save(id, mappings, select);
  }

  async save<T extends Prisma.MappingsSelect>(
    id: number,
    data: Array<MappingEntry>,
    select?: T
  ): Promise<Prisma.MappingsGetPayload<{ select: T }>> {
    return prisma.mappings.upsert({
      where: { id },
      update: getMappingsPrismaData(id, data),
      create: getMappingsPrismaData(id, data),
      select
    }) as Prisma.MappingsGetPayload<{ select: T }>;
  }

  async add<T extends Prisma.MappingsSelect>(
    id: number,
    entry: MappingEntry,
    select?: T
  ): Promise<Prisma.MappingsGetPayload<{ select: T }>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addMappingsPrismaData(entry),
      select
    }) as Prisma.MappingsGetPayload<{ select: T }>;
  }

  async edit<T extends Prisma.MappingsSelect>(
    id: number,
    old: MappingEntry,
    updated: MappingEntry,
    select?: T
  ): Promise<Prisma.MappingsGetPayload<{ select: T }>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: editMappingsPrismaData(old, updated),
      select
    }) as Prisma.MappingsGetPayload<{ select: T }>;
  }

  async remove<T extends Prisma.MappingsSelect>(
    id: number,
    entry: MappingEntry,
    select?: T
  ): Promise<Prisma.MappingsGetPayload<{ select: T }>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: removeMappingsPrismaData(entry),
      select
    }) as Prisma.MappingsGetPayload<{ select: T }>;
  }

  async addOrUpdateEpisodes<T extends Prisma.MappingsSelect>(
    id: number,
    episodes: Array<TmdbSeasonEpisode>,
    select?: T
  ): Promise<Prisma.MappingsGetPayload<{ select: T }>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateEpisodes(episodes),
      select
    }) as Prisma.MappingsGetPayload<{ select: T }>;
  }
}

export default new Mappings();
