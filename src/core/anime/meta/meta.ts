import { prisma, Prisma } from 'src/lib/prisma';
import { MetaPayload } from './helpers/meta.dto';
import { MetaPrisma, MetaFetch, MetaUtils } from './helpers';
import { Anime } from '../anime';
import { Module } from 'src/helpers/module';

class MetaModule extends Module {
  override readonly name = 'Meta';

  async fetchOrCreate<T extends Prisma.MetaDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    const existing = await prisma.meta.findUnique({
      where: { id },
      ...(args as Prisma.MetaDefaultArgs)
    });

    if (existing) return existing as Prisma.MetaGetPayload<T>;

    await Anime.fetchOrCreate(id);

    return this.save(id, args);
  }

  async save<T extends Prisma.MetaDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.upsert({
      where: { id },
      update: MetaPrisma.getMeta(id),
      create: MetaPrisma.getMeta(id),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async loadMappings(id: number) {
    await this.fetchOrCreate(id);
    const fetched = await MetaFetch.fetchMappings(id).catch(() => null);
    const mappings = MetaUtils.toMappingsArray(fetched?.mappings);
    await this.update(id, { mappings });
  }

  async update<T extends Prisma.MetaDefaultArgs>(
    id: number,
    payload: MetaPayload,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    const updateData = MetaPrisma.buildUpdateData(payload);

    return prisma.meta.update({
      where: { id },
      data: updateData,
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async remove<T extends Prisma.MetaDefaultArgs>(
    id: number,
    payload: Partial<Record<keyof MetaPayload, true>>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    const removeData = MetaPrisma.buildRemoveData(payload);

    return prisma.meta.update({
      where: { id },
      data: removeData,
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async forceUpdate<T extends Prisma.MetaDefaultArgs>(
    id: number,
    payload: MetaPayload,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    const updateData = MetaPrisma.buildForceUpdateData(id, payload);

    return prisma.meta.update({
      where: { id },
      data: updateData,
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }
}

const Meta = new MetaModule();

export { Meta, MetaModule };
