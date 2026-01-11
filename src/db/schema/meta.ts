import { boolean, integer, pgTable, primaryKey, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { anime } from './anime';
import cuid from 'cuid';

export const meta = pgTable('meta', {
  id: integer('id').primaryKey(),
  anime_id: integer('anime_id')
    .notNull()
    .unique()
    .references(() => anime.id, { onDelete: 'cascade' }),
  franchise: varchar('franchise', { length: 255 }),
  rating: varchar('rating', { length: 255 }),
  episodes_aired: integer('episodes_aired'),
  episodes_total: integer('episodes_total'),
  moreinfo: varchar('moreinfo', { length: 255 }),
  broadcast: varchar('broadcast', { length: 255 }),
  nsfw: boolean('nsfw').notNull().default(false)
});

export const metaMapping = pgTable(
  'meta_mapping',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    source_id: varchar('source_id', { length: 255 }).notNull(),
    source_name: varchar('source_name', { length: 255 }).notNull(),
    meta_id: integer('meta_id')
      .notNull()
      .references(() => meta.id, { onDelete: 'cascade' })
  },
  (t) => [uniqueIndex('mapping_source_unique').on(t.source_id, t.source_name)]
);

export const metaTitle = pgTable(
  'meta_title',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    title: varchar('title', { length: 255 }).notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    language: varchar('language', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('title_unique').on(t.title, t.source, t.language)]
);

export const metaDescription = pgTable(
  'meta_description',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    description: text('description').notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    language: varchar('language', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('description_unique').on(t.description, t.source, t.language)]
);

export const metaImage = pgTable(
  'meta_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    small: varchar('small', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    large: varchar('large', { length: 255 }),
    type: varchar('type', { length: 255 }).notNull(),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('image_unique').on(t.url, t.type, t.source)]
);

export const metaVideo = pgTable(
  'meta_video',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }),
    thumbnail: varchar('thumbnail', { length: 255 }),
    artist: varchar('artist', { length: 255 }),
    type: varchar('type', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('video_unique').on(t.url, t.source)]
);

export const metaScreenshot = pgTable(
  'meta_screenshot',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    small: varchar('small', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    large: varchar('large', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('screenshot_unique').on(t.url, t.source)]
);

export const metaArtwork = pgTable(
  'meta_artwork',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    height: integer('height'),
    width: integer('width'),
    image: varchar('image', { length: 255 }),
    iso_639_1: varchar('iso_639_1', { length: 255 }),
    thumbnail: varchar('thumbnail', { length: 255 }),
    type: varchar('type', { length: 255 }).notNull(),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('artwork_unique').on(t.url, t.type, t.source)]
);

export const metaChronology = pgTable(
  'meta_chronology',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    order: integer('order').notNull(),
    meta_id: integer('meta_id')
      .notNull()
      .references(() => meta.id, { onDelete: 'cascade' })
  },
  (t) => [uniqueIndex('chronology_unique').on(t.parent_id, t.related_id)]
);

// Many-to-many junction table for Meta and Title
export const metaToTitle = pgTable(
  '_meta_to_title',
  {
    A: integer('A')
      .notNull()
      .references(() => meta.id),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => metaTitle.id)
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

// Similar junction tables for other meta relations
export const metaToDescription = pgTable(
  '_meta_to_description',
  {
    A: integer('A')
      .notNull()
      .references(() => meta.id),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => metaDescription.id)
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

export const metaToImage = pgTable(
  '_meta_to_image',
  {
    A: integer('A')
      .notNull()
      .references(() => meta.id),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => metaImage.id)
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

export const metaToVideo = pgTable(
  '_meta_to_video',
  {
    A: integer('A')
      .notNull()
      .references(() => meta.id),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => metaVideo.id)
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

export const metaToScreenshot = pgTable(
  '_meta_to_screenshot',
  {
    A: integer('A')
      .notNull()
      .references(() => meta.id),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => metaScreenshot.id)
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

export const metaToArtwork = pgTable(
  '_meta_to_artwork',
  {
    A: integer('A')
      .notNull()
      .references(() => meta.id),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => metaArtwork.id)
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);
