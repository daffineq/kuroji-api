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
    await this.update({ id, mappings });
  }

  async update(payload: MetaPayload) {
    await this.fetchOrCreate(payload.id);
    await MetaPrisma.update(payload);
  }

  async remove(payload: Partial<Record<Exclude<keyof MetaPayload, 'id'>, true>> & { id: number }) {
    await this.fetchOrCreate(payload.id);
    await MetaPrisma.remove(payload);
  }

  async forceUpdate(payload: MetaPayload) {
    await this.fetchOrCreate(payload.id);
    await MetaPrisma.forceUpdate(payload);
  }
}

const Meta = new MetaModule();

export { Meta, MetaModule };
