import { boolean, integer, pgTable, primaryKey, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import cuid from 'cuid';

export const anime = pgTable('anime', {
  id: integer('id').primaryKey(),
  id_mal: integer('id_mal'),
  background: varchar('background', { length: 255 }),
  synonyms: text('synonyms').array(),
  description: text('description'),
  status: varchar('status', { length: 255 }),
  type: varchar('type', { length: 255 }),
  format: varchar('format', { length: 255 }),
  updated_at: integer('updated_at').notNull(),
  season: varchar('season', { length: 255 }),
  season_year: integer('season_year'),
  episodes: integer('episodes'),
  duration: integer('duration'),
  country_of_origin: varchar('country_of_origin', { length: 255 }),
  is_licensed: boolean('is_licensed'),
  source: varchar('source', { length: 255 }),
  hashtag: varchar('hashtag', { length: 255 }),
  is_adult: boolean('is_adult'),
  score: integer('score'),
  popularity: integer('popularity'),
  trending: integer('trending'),
  favorites: integer('favorites'),
  color: varchar('color', { length: 255 }),
  latest_airing_episode: integer('latest_airing_episode'),
  next_airing_episode: integer('next_airing_episode'),
  last_airing_episode: integer('last_airing_episode')
});

export const animePoster = pgTable('anime_poster', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  anime_id: integer('anime_id')
    .notNull()
    .unique()
    .references(() => anime.id, { onDelete: 'cascade' }),
  large: varchar('large', { length: 255 }),
  medium: varchar('medium', { length: 255 }),
  extra_large: varchar('extra_large', { length: 255 })
});

export const animeTitle = pgTable('anime_title', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  anime_id: integer('anime_id')
    .notNull()
    .unique()
    .references(() => anime.id, { onDelete: 'cascade' }),
  romaji: varchar('romaji', { length: 255 }),
  english: varchar('english', { length: 255 }),
  native: varchar('native', { length: 255 })
});

export const animeStartDate = pgTable('anime_start_date', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  anime_id: integer('anime_id')
    .notNull()
    .unique()
    .references(() => anime.id, { onDelete: 'cascade' }),
  day: integer('day'),
  month: integer('month'),
  year: integer('year')
});

export const animeEndDate = pgTable('anime_end_date', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  anime_id: integer('anime_id')
    .notNull()
    .unique()
    .references(() => anime.id, { onDelete: 'cascade' }),
  day: integer('day'),
  month: integer('month'),
  year: integer('year')
});

export const animeGenre = pgTable('anime_genre', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: varchar('name', { length: 255 }).notNull().unique()
});

// Many-to-many for Anime and Genre
export const animeToGenre = pgTable(
  '_anime_genres',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeGenre.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

export const animeAiringSchedule = pgTable('anime_airing_schedule', {
  id: integer('id').primaryKey(),
  anime_id: integer('anime_id')
    .notNull()
    .references(() => anime.id),
  episode: integer('episode'),
  airing_at: integer('airing_at')
});

export const animeCharacter = pgTable('anime_character', {
  id: integer('id').primaryKey()
});

export const animeCharacterEdge = pgTable('anime_character_edge', {
  id: integer('id').primaryKey(),
  anime_id: integer('anime_id')
    .notNull()
    .references(() => anime.id, { onDelete: 'cascade' }),
  character_id: integer('character_id')
    .notNull()
    .references(() => animeCharacter.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 255 })
});

export const animeVoiceActor = pgTable('anime_voice_actor', {
  id: integer('id').primaryKey(),
  language: varchar('language', { length: 255 })
});

// Many-to-many for Character and Voice Actor
export const characterToVoiceActor = pgTable(
  '_character_to_voice_actor',
  {
    A: integer('A')
      .notNull()
      .references(() => animeCharacterEdge.id, { onDelete: 'cascade' }),
    B: integer('B')
      .notNull()
      .references(() => animeVoiceActor.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] })]
);

export const animeCharacterName = pgTable('anime_character_name', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  full: varchar('full', { length: 255 }),
  native: varchar('native', { length: 255 }),
  alternative: text('alternative').array(),
  character_id: integer('character_id')
    .unique()
    .references(() => animeCharacter.id, { onDelete: 'cascade' })
});

export const animeCharacterImage = pgTable('anime_character_image', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  large: varchar('large', { length: 255 }),
  medium: varchar('medium', { length: 255 }),
  character_id: integer('character_id')
    .unique()
    .references(() => animeCharacter.id, { onDelete: 'cascade' })
});

export const animeVoiceName = pgTable('anime_voice_name', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  full: varchar('full', { length: 255 }),
  native: varchar('native', { length: 255 }),
  alternative: text('alternative').array(),
  voice_actor_id: integer('voice_actor_id')
    .unique()
    .references(() => animeVoiceActor.id, { onDelete: 'cascade' })
});

export const animeVoiceImage = pgTable('anime_voice_image', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  large: varchar('large', { length: 255 }),
  medium: varchar('medium', { length: 255 }),
  voice_actor_id: integer('voice_actor_id')
    .unique()
    .references(() => animeVoiceActor.id, { onDelete: 'cascade' })
});

export const animeStudio = pgTable('anime_studio', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 })
});

export const animeStudioEdge = pgTable('anime_studio_edge', {
  id: integer('id').primaryKey(),
  anime_id: integer('anime_id')
    .notNull()
    .references(() => anime.id, { onDelete: 'cascade' }),
  studio_id: integer('studio_id')
    .notNull()
    .references(() => animeStudio.id, { onDelete: 'cascade' }),
  is_main: boolean('is_main')
});

export const animeTag = pgTable('anime_tag', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).unique(),
  description: text('description'),
  category: varchar('category', { length: 255 }),
  is_general_spoiler: boolean('is_general_spoiler'),
  is_adult: boolean('is_adult')
});

export const animeTagEdge = pgTable(
  'anime_tag_edge',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    tag_id: integer('tag_id')
      .notNull()
      .references(() => animeTag.id, { onDelete: 'cascade' }),
    rank: integer('rank'),
    is_media_spoiler: boolean('is_media_spoiler')
  },
  (t) => [uniqueIndex('anime_tag_unique').on(t.anime_id, t.tag_id)]
);

export const animeExternalLink = pgTable('anime_external_link', {
  id: integer('id').primaryKey(),
  anime_id: integer('anime_id')
    .notNull()
    .references(() => anime.id),
  url: varchar('url', { length: 255 }),
  site: varchar('site', { length: 255 }),
  site_id: integer('site_id'),
  type: varchar('type', { length: 255 }),
  language: varchar('language', { length: 255 }),
  color: varchar('color', { length: 255 }),
  icon: varchar('icon', { length: 255 }),
  notes: varchar('notes', { length: 255 }),
  is_disabled: boolean('is_disabled')
});

export const animeScoreDistribution = pgTable(
  'anime_score_distribution',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    score: integer('score').notNull(),
    amount: integer('amount').notNull(),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' })
  },
  (t) => [uniqueIndex('score_distribution_unique').on(t.anime_id, t.score)]
);

export const animeStatusDistribution = pgTable(
  'anime_status_distribution',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    status: varchar('status', { length: 255 }).notNull(),
    amount: integer('amount').notNull(),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' })
  },
  (table) => [uniqueIndex('status_distribution_unique').on(table.anime_id, table.status)]
);
