import { MetaPayload } from './helpers/meta.dto';
import { MetaDb, MetaFetch, MetaUtils } from './helpers';
import { Anime } from '../anime';
import { Module } from 'src/helpers/module';
import { db, meta } from 'src/db';
import { eq } from 'drizzle-orm';

class MetaModule extends Module {
  override readonly name = 'Meta';

  async fetchOrCreate(id: number) {
    const existing = await db.query.meta.findFirst({
      where: {
        id
      },
      with: {
        mappings: true
      }
    });

    if (existing) return existing;

    await Anime.fetchOrCreate(id);

    return this.save(id);
  }

  async save(id: number) {
    await MetaDb.upsert(id);

    return db.query.meta.findFirst({
      where: {
        id
      },
      with: {
        mappings: true
      }
    });
  }

  async loadMappings(id: number) {
    await this.fetchOrCreate(id);
    const fetched = await MetaFetch.fetchMappings(id).catch(() => null);
    const mappings = MetaUtils.toMappingsArray(fetched?.mappings);
    await this.update({ id, mappings });
  }

  async update(payload: MetaPayload) {
    await this.fetchOrCreate(payload.id);
    await MetaDb.update(payload);
  }

  async remove(payload: Partial<Record<Exclude<keyof MetaPayload, 'id'>, true>> & { id: number }) {
    await this.fetchOrCreate(payload.id);
    await MetaDb.remove(payload);
  }

  async forceUpdate(payload: MetaPayload) {
    await this.fetchOrCreate(payload.id);
    await MetaDb.forceUpdate(payload);
  }
}

const Meta = new MetaModule();

export { Meta, MetaModule };
