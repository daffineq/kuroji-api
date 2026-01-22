import { parseString } from 'src/helpers/parsers';
import { MetaPayload } from './meta.dto';
import { Module } from 'src/helpers/module';
import { Config } from 'src/config/config';
import {
  db,
  meta,
  metaToArtwork,
  metaToImage,
  metaToScreenshot,
  metaToVideo,
  metaToTitle,
  metaToDescription,
  metaArtwork,
  metaImage,
  metaScreenshot,
  metaVideo,
  metaMapping,
  metaTitle,
  metaDescription,
  metaChronology,
  upsertWithExcluded
} from 'src/db';
import { sql, eq } from 'drizzle-orm';

class MetaDbModule extends Module {
  override readonly name = 'MetaDb';

  async upsert(id: number) {
    await db
      .insert(meta)
      .values({
        id,
        anime_id: id
      })
      .onConflictDoNothing({
        target: meta.id
      });
  }

  async update(payload: MetaPayload) {
    const normalize = <T>(v?: T | T[]) => (v ? (Array.isArray(v) ? v : [v]) : []);

    await db.transaction(async (tx) => {
      const { values, set } = upsertWithExcluded({
        id: payload.id,
        anime_id: payload.id,
        franchise: payload.franchise,
        rating: payload.rating,
        episodes_aired: payload.episodes_aired,
        episodes_total: payload.episodes_total,
        moreinfo: payload.moreinfo,
        broadcast: payload.broadcast,
        nsfw: payload.nsfw
      });

      await tx.insert(meta).values(values).onConflictDoUpdate({
        target: meta.id,
        set
      });

      const artworks = normalize(payload.artworks);
      const images = normalize(payload.images);
      const screenshots = normalize(payload.screenshots);
      const videos = normalize(payload.videos);
      const mappings = normalize(payload.mappings);
      const titles = normalize(payload.titles);
      const descriptions = normalize(payload.descriptions);
      const chronologies = normalize(payload.chronologies);

      const ops: Promise<any>[] = [];

      // Artworks
      if (artworks.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(metaArtwork)
              .values(
                artworks.map((a) => ({
                  url: a.url,
                  height: a.height,
                  large: a.large,
                  iso_639_1: a.iso_639_1,
                  medium: a.medium,
                  type: a.type,
                  width: a.width,
                  source: a.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaArtwork.url, metaArtwork.type, metaArtwork.source],
                set: {
                  height: sql`excluded.height`,
                  width: sql`excluded.width`,
                  large: sql`excluded.large`,
                  medium: sql`excluded.medium`,
                  iso_639_1: sql`excluded.iso_639_1`
                }
              })
              .returning({ id: metaArtwork.id });

            await tx
              .insert(metaToArtwork)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Images
      if (images.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(metaImage)
              .values(
                images.map((i) => ({
                  url: i.url,
                  small: i.small,
                  medium: i.medium,
                  large: i.large,
                  type: i.type,
                  source: i.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaImage.url, metaImage.type, metaImage.source],
                set: {
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: metaImage.id });

            await tx
              .insert(metaToImage)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Screenshots
      if (screenshots.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(metaScreenshot)
              .values(
                screenshots.map((s) => ({
                  url: s.url,
                  small: s.small,
                  medium: s.medium,
                  large: s.large,
                  source: s.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaScreenshot.url, metaScreenshot.source],
                set: {
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: metaScreenshot.id });

            await tx
              .insert(metaToScreenshot)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Videos
      if (videos.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(metaVideo)
              .values(
                videos.map((v) => ({
                  url: v.url,
                  title: v.title,
                  thumbnail: v.thumbnail,
                  artist: v.artist,
                  type: v.type,
                  source: v.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaVideo.url, metaVideo.source],
                set: {
                  title: sql`excluded.title`,
                  thumbnail: sql`excluded.thumbnail`,
                  artist: sql`excluded.artist`,
                  type: sql`excluded.type`
                }
              })
              .returning({ id: metaVideo.id });

            await tx
              .insert(metaToVideo)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Mappings
      if (mappings.length) {
        ops.push(
          Promise.resolve().then(async () => {
            await tx
              .insert(metaMapping)
              .values(
                mappings.map((m) => ({
                  meta_id: payload.id,
                  source_id: parseString(m.id)!,
                  source_name: m.name.toLowerCase()
                }))
              )
              .onConflictDoNothing({
                target: [metaMapping.source_id, metaMapping.source_name]
              });
          })
        );
      }

      // Titles
      if (titles.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(metaTitle)
              .values(
                titles.map((t) => ({
                  title: t.title,
                  source: t.source.toLowerCase(),
                  language: t.language
                }))
              )
              .onConflictDoNothing({
                target: [metaTitle.title, metaTitle.source, metaTitle.language]
              })
              .returning({ id: metaTitle.id });

            await tx
              .insert(metaToTitle)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Descriptions
      if (descriptions.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(metaDescription)
              .values(
                descriptions.map((d) => ({
                  description: d.description,
                  source: d.source.toLowerCase(),
                  language: d.language
                }))
              )
              .onConflictDoNothing({
                target: [metaDescription.description, metaDescription.source, metaDescription.language]
              })
              .returning({ id: metaDescription.id });

            await tx
              .insert(metaToDescription)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Chronologies
      if (chronologies.length) {
        ops.push(
          Promise.resolve().then(async () => {
            await tx
              .insert(metaChronology)
              .values(
                chronologies.map((c) => ({
                  meta_id: payload.id,
                  parent_id: c.parentId,
                  related_id: c.relatedId,
                  order: c.order
                }))
              )
              .onConflictDoNothing({
                target: [metaChronology.parent_id, metaChronology.related_id]
              });
          })
        );
      }

      for (let i = 0; i < ops.length; i += Config.transaction_batch) {
        await Promise.all(ops.slice(i, i + Config.transaction_batch));
      }
    });
  }

  async remove(payload: Partial<Record<Exclude<keyof MetaPayload, 'id'>, true>> & { id: number }) {
    await db.transaction(async (tx) => {
      await tx
        .insert(meta)
        .values({
          id: payload.id,
          anime_id: payload.id,
          franchise: null,
          rating: null,
          episodes_aired: null,
          episodes_total: null,
          moreinfo: null,
          broadcast: null,
          nsfw: false
        })
        .onConflictDoUpdate({
          target: meta.id,
          set: {
            franchise: null,
            rating: null,
            episodes_aired: null,
            episodes_total: null,
            moreinfo: null,
            broadcast: null,
            nsfw: false
          }
        });

      if (payload.mappings) {
        await tx.delete(metaMapping).where(eq(metaMapping.meta_id, payload.id));
      }

      if (payload.titles) {
        await tx.delete(metaToTitle).where(eq(metaToTitle.A, payload.id));
      }

      if (payload.descriptions) {
        await tx.delete(metaToDescription).where(eq(metaToDescription.A, payload.id));
      }

      if (payload.images) {
        await tx.delete(metaToImage).where(eq(metaToImage.A, payload.id));
      }

      if (payload.videos) {
        await tx.delete(metaToVideo).where(eq(metaToVideo.A, payload.id));
      }

      if (payload.screenshots) {
        await tx.delete(metaToScreenshot).where(eq(metaToScreenshot.A, payload.id));
      }

      if (payload.artworks) {
        await tx.delete(metaToArtwork).where(eq(metaToArtwork.A, payload.id));
      }

      if (payload.chronologies) {
        await tx.delete(metaChronology).where(eq(metaChronology.meta_id, payload.id));
      }
    });
  }

  async forceUpdate(payload: MetaPayload) {
    await db.transaction(async (tx) => {
      await tx
        .insert(meta)
        .values({
          id: payload.id,
          anime_id: payload.id,
          franchise: payload.franchise,
          rating: payload.rating,
          episodes_aired: payload.episodes_aired,
          episodes_total: payload.episodes_total,
          moreinfo: payload.moreinfo,
          broadcast: payload.broadcast,
          nsfw: payload.nsfw
        })
        .onConflictDoUpdate({
          target: meta.id,
          set: {
            anime_id: payload.id,
            franchise: payload.franchise,
            rating: payload.rating,
            episodes_aired: payload.episodes_aired,
            episodes_total: payload.episodes_total,
            moreinfo: payload.moreinfo,
            broadcast: payload.broadcast,
            nsfw: payload.nsfw
          }
        });

      const ops: Promise<any>[] = [];

      const normalize = <T>(v?: T | T[]) => (v ? (Array.isArray(v) ? v : [v]) : []);

      // Mappings
      if (payload.mappings) {
        const mappings = normalize(payload.mappings);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaMapping).where(eq(metaMapping.meta_id, payload.id));

            await tx
              .insert(metaMapping)
              .values(
                mappings.map((m) => ({
                  meta_id: payload.id,
                  source_id: parseString(m.id)!,
                  source_name: m.name.toLowerCase()
                }))
              )
              .onConflictDoNothing({
                target: [metaMapping.source_id, metaMapping.source_name]
              });
          })
        );
      }

      // Titles
      if (payload.titles) {
        const titles = normalize(payload.titles);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaToTitle).where(eq(metaToTitle.A, payload.id));

            const inserted = await tx
              .insert(metaTitle)
              .values(
                titles.map((t) => ({
                  title: t.title,
                  source: t.source.toLowerCase(),
                  language: t.language
                }))
              )
              .onConflictDoNothing({
                target: [metaTitle.title, metaTitle.source, metaTitle.language]
              })
              .returning({ id: metaTitle.id });

            await tx
              .insert(metaToTitle)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Descriptions
      if (payload.descriptions) {
        const descriptions = normalize(payload.descriptions);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaToDescription).where(eq(metaToDescription.A, payload.id));

            const inserted = await tx
              .insert(metaDescription)
              .values(
                descriptions.map((d) => ({
                  description: d.description,
                  source: d.source.toLowerCase(),
                  language: d.language
                }))
              )
              .onConflictDoNothing({
                target: [metaDescription.description, metaDescription.source, metaDescription.language]
              })
              .returning({ id: metaDescription.id });

            await tx
              .insert(metaToDescription)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Images
      if (payload.images) {
        const images = normalize(payload.images);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaToImage).where(eq(metaToImage.A, payload.id));

            const inserted = await tx
              .insert(metaImage)
              .values(
                images.map((i) => ({
                  url: i.url,
                  small: i.small,
                  medium: i.medium,
                  large: i.large,
                  type: i.type,
                  source: i.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaImage.url, metaImage.type, metaImage.source],
                set: {
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: metaImage.id });

            await tx
              .insert(metaToImage)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Videos
      if (payload.videos) {
        const videos = normalize(payload.videos);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaToVideo).where(eq(metaToVideo.A, payload.id));

            const inserted = await tx
              .insert(metaVideo)
              .values(
                videos.map((v) => ({
                  url: v.url,
                  title: v.title,
                  thumbnail: v.thumbnail,
                  artist: v.artist,
                  type: v.type,
                  source: v.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaVideo.url, metaVideo.source],
                set: {
                  title: sql`excluded.title`,
                  thumbnail: sql`excluded.thumbnail`,
                  artist: sql`excluded.artist`,
                  type: sql`excluded.type`
                }
              })
              .returning({ id: metaVideo.id });

            await tx
              .insert(metaToVideo)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Screenshots
      if (payload.screenshots) {
        const screenshots = normalize(payload.screenshots);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaToScreenshot).where(eq(metaToScreenshot.A, payload.id));

            const inserted = await tx
              .insert(metaScreenshot)
              .values(
                screenshots.map((s) => ({
                  url: s.url,
                  small: s.small,
                  medium: s.medium,
                  large: s.large,
                  source: s.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaScreenshot.url, metaScreenshot.source],
                set: {
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: metaScreenshot.id });

            await tx
              .insert(metaToScreenshot)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Artworks
      if (payload.artworks) {
        const artworks = normalize(payload.artworks);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaToArtwork).where(eq(metaToArtwork.A, payload.id));

            const inserted = await tx
              .insert(metaArtwork)
              .values(
                artworks.map((a) => ({
                  url: a.url,
                  height: a.height,
                  large: a.large,
                  iso_639_1: a.iso_639_1,
                  medium: a.medium,
                  type: a.type,
                  width: a.width,
                  source: a.source.toLowerCase()
                }))
              )
              .onConflictDoUpdate({
                target: [metaArtwork.url, metaArtwork.type, metaArtwork.source],
                set: {
                  height: sql`excluded.height`,
                  width: sql`excluded.width`,
                  large: sql`excluded.large`,
                  medium: sql`excluded.medium`,
                  iso_639_1: sql`excluded.iso_639_1`
                }
              })
              .returning({ id: metaArtwork.id });

            await tx
              .insert(metaToArtwork)
              .values(
                inserted.map((i) => ({
                  A: payload.id,
                  B: i.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Chronologies
      if (payload.chronologies) {
        const chronologies = normalize(payload.chronologies);
        ops.push(
          Promise.resolve().then(async () => {
            await tx.delete(metaChronology).where(eq(metaChronology.meta_id, payload.id));

            await tx
              .insert(metaChronology)
              .values(
                chronologies.map((c) => ({
                  meta_id: payload.id,
                  parent_id: c.parentId,
                  related_id: c.relatedId,
                  order: c.order
                }))
              )
              .onConflictDoNothing({
                target: [metaChronology.parent_id, metaChronology.related_id]
              });
          })
        );
      }

      for (let i = 0; i < ops.length; i += Config.transaction_batch) {
        await Promise.all(ops.slice(i, i + Config.transaction_batch));
      }
    });
  }
}

const MetaDb = new MetaDbModule();

export { MetaDb, MetaDbModule };
