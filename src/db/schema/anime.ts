import { boolean, index, integer, pgTable, primaryKey, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import cuid from 'cuid';

export const anime = pgTable(
  'anime',
  {
    id: integer('id').primaryKey(),
    id_mal: integer('id_mal'),
    background: varchar('background', { length: 255 }),
    description: text('description'),
    status: varchar('status', { length: 255 }),
    type: varchar('type', { length: 255 }),
    format: varchar('format', { length: 255 }),
    updated_at: integer('updated_at')
      .$defaultFn(() => Math.floor(Date.now() / 1000))
      .$onUpdateFn(() => Math.floor(Date.now() / 1000)),
    season: varchar('season', { length: 255 }),
    season_year: integer('season_year'),
    duration: integer('duration'),
    country: varchar('country', { length: 255 }),
    is_licensed: boolean('is_licensed').default(false),
    source: varchar('source', { length: 255 }),
    hashtag: varchar('hashtag', { length: 255 }),
    is_adult: boolean('is_adult').default(false),
    score: integer('score'),
    popularity: integer('popularity'),
    trending: integer('trending'),
    favorites: integer('favorites'),
    color: varchar('color', { length: 255 }),
    franchise: varchar('franchise', { length: 255 }),
    age_rating: varchar('age_rating', { length: 255 }),
    episodes_aired: integer('episodes_aired'),
    episodes_total: integer('episodes_total'),
    moreinfo: varchar('moreinfo', { length: 255 }),
    broadcast: varchar('broadcast', { length: 255 }),
    nsfw: boolean('nsfw').default(false),
    latest_airing_episode: integer('latest_airing_episode'),
    next_airing_episode: integer('next_airing_episode'),
    last_airing_episode: integer('last_airing_episode'),
    auto_update: boolean('auto_update').default(true),
    disabled: boolean('disabled').default(false)
  },
  (t) => [
    index('idx_anime_id_mal').on(t.id_mal),
    index('idx_anime_status').on(t.status),
    index('idx_anime_type').on(t.type),
    index('idx_anime_format').on(t.format),
    index('idx_anime_season').on(t.season),
    index('idx_anime_season_year').on(t.season_year),
    index('idx_anime_source').on(t.source),
    index('idx_anime_country').on(t.country),
    index('idx_anime_is_adult').on(t.is_adult),
    index('idx_anime_is_licensed').on(t.is_licensed),
    index('idx_anime_score').on(t.score),
    index('idx_anime_popularity').on(t.popularity),
    index('idx_anime_trending').on(t.trending),
    index('idx_anime_favorites').on(t.favorites),
    index('idx_anime_franchise').on(t.franchise),
    index('idx_anime_next_airing_episode').on(t.next_airing_episode),
    index('idx_anime_updated_at').on(t.updated_at),
    index('idx_anime_season_season_year').on(t.season, t.season_year),
    index('idx_anime_season_year_format').on(t.season_year, t.format)
  ]
);

export const animePoster = pgTable(
  'anime_poster',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    anime_id: integer('anime_id')
      .notNull()
      .unique()
      .references(() => anime.id, { onDelete: 'cascade' }),
    small: varchar('small', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    large: varchar('large', { length: 255 })
  },
  (t) => [index('idx_anime_poster_anime_id').on(t.anime_id)]
);

export const animeTitle = pgTable(
  'anime_title',
  {
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
  },
  (t) => [index('idx_anime_title_anime_id').on(t.anime_id)]
);

export const animeStartDate = pgTable(
  'anime_start_date',
  {
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
  },
  (t) => [index('idx_anime_start_date_anime_id').on(t.anime_id), index('idx_anime_start_date_year').on(t.year)]
);

export const animeEndDate = pgTable(
  'anime_end_date',
  {
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
  },
  (t) => [index('idx_anime_end_date_anime_id').on(t.anime_id), index('idx_anime_end_date_year').on(t.year)]
);

export const animeGenre = pgTable('anime_genre', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: varchar('name', { length: 255 }).notNull().unique()
});

export const animeToGenre = pgTable(
  '_anime_to_genre',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeGenre.id, { onDelete: 'cascade' })
  },
  (t) => [
    primaryKey({ columns: [t.A, t.B] }),
    index('idx_anime_to_genre_a').on(t.A),
    index('idx_anime_to_genre_b').on(t.B)
  ]
);

export const animeAiringSchedule = pgTable('anime_airing_schedule', {
  id: integer('id').primaryKey(),
  episode: integer('episode'),
  airing_at: integer('airing_at')
});

export const animeToAiringSchedule = pgTable(
  '_anime_to_airing_schedule',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: integer('B')
      .notNull()
      .references(() => animeAiringSchedule.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_airing_schedule_a').on(t.A)]
);

export const animeCharacter = pgTable('anime_character', {
  id: integer('id').primaryKey()
});

export const animeToCharacter = pgTable(
  '_anime_to_character',
  {
    id: integer('id').primaryKey(),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    character_id: integer('character_id')
      .notNull()
      .references(() => animeCharacter.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 255 })
  },
  (t) => [
    index('idx_anime_to_character_anime_id').on(t.anime_id),
    index('idx_anime_to_character_character_id').on(t.character_id)
  ]
);

export const animeVoiceActor = pgTable('anime_voice_actor', {
  id: integer('id').primaryKey(),
  language: varchar('language', { length: 255 })
});

export const characterToVoiceActor = pgTable(
  '_character_to_voice_actor',
  {
    A: integer('A')
      .notNull()
      .references(() => animeToCharacter.id, { onDelete: 'cascade' }),
    B: integer('B')
      .notNull()
      .references(() => animeVoiceActor.id, { onDelete: 'cascade' })
  },
  (t) => [
    primaryKey({ columns: [t.A, t.B] }),
    index('idx_character_to_voice_actor_a').on(t.A),
    index('idx_character_to_voice_actor_b').on(t.B)
  ]
);

export const animeCharacterName = pgTable(
  'anime_character_name',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    full: varchar('full', { length: 255 }),
    native: varchar('native', { length: 255 }),
    alternative: text('alternative').array(),
    character_id: integer('character_id')
      .unique()
      .references(() => animeCharacter.id, { onDelete: 'cascade' })
  },
  (t) => [index('idx_anime_character_name_character_id').on(t.character_id)]
);

export const animeCharacterImage = pgTable(
  'anime_character_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    large: varchar('large', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    character_id: integer('character_id')
      .unique()
      .references(() => animeCharacter.id, { onDelete: 'cascade' })
  },
  (t) => [index('idx_anime_character_image_character_id').on(t.character_id)]
);

export const animeVoiceName = pgTable(
  'anime_voice_name',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    full: varchar('full', { length: 255 }),
    native: varchar('native', { length: 255 }),
    alternative: text('alternative').array(),
    voice_actor_id: integer('voice_actor_id')
      .unique()
      .references(() => animeVoiceActor.id, { onDelete: 'cascade' })
  },
  (t) => [index('idx_anime_voice_name_voice_actor_id').on(t.voice_actor_id)]
);

export const animeVoiceImage = pgTable(
  'anime_voice_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    large: varchar('large', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    voice_actor_id: integer('voice_actor_id')
      .unique()
      .references(() => animeVoiceActor.id, { onDelete: 'cascade' })
  },
  (t) => [index('idx_anime_voice_image_voice_actor_id').on(t.voice_actor_id)]
);

export const animeStudio = pgTable('anime_studio', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 })
});

export const animeToStudio = pgTable(
  '_anime_to_studio',
  {
    id: integer('id').primaryKey(),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    studio_id: integer('studio_id')
      .notNull()
      .references(() => animeStudio.id, { onDelete: 'cascade' }),
    is_main: boolean('is_main')
  },
  (t) => [
    index('idx_anime_to_studio_anime_id').on(t.anime_id),
    index('idx_anime_to_studio_studio_id').on(t.studio_id)
  ]
);

export const animeTag = pgTable(
  'anime_tag',
  {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique(),
    description: text('description'),
    category: varchar('category', { length: 255 }),
    is_adult: boolean('is_adult')
  },
  (t) => [index('idx_anime_tag_category').on(t.category), index('idx_anime_tag_is_adult').on(t.is_adult)]
);

export const animeToTag = pgTable(
  '_anime_to_tag',
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
    is_spoiler: boolean('is_spoiler')
  },
  (t) => [
    uniqueIndex('anime_tag_unique').on(t.anime_id, t.tag_id),
    index('idx_anime_to_tag_anime_id').on(t.anime_id),
    index('idx_anime_to_tag_tag_id').on(t.tag_id)
  ]
);

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
  (t) => [
    uniqueIndex('score_distribution_unique').on(t.anime_id, t.score),
    index('idx_anime_score_distribution_anime_id').on(t.anime_id)
  ]
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
  (t) => [
    uniqueIndex('status_distribution_unique').on(t.anime_id, t.status),
    index('idx_anime_status_distribution_anime_id').on(t.anime_id)
  ]
);

export const animeLink = pgTable(
  'anime_link',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    link: varchar('link', { length: 255 }).notNull(),
    label: varchar('label', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 })
  },
  (t) => [uniqueIndex('link_unique').on(t.link, t.label)]
);

export const animeOtherTitle = pgTable(
  'anime_other_title',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    title: varchar('title', { length: 255 }).notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    language: varchar('language', { length: 255 })
  },
  (t) => [uniqueIndex('other_title_unique').on(t.title, t.source)]
);

export const animeOtherDescription = pgTable(
  'anime_other_description',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    description: text('description').notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    language: varchar('language', { length: 255 })
  },
  (t) => [uniqueIndex('other_description_unique').on(t.description, t.source)]
);

export const animeImage = pgTable(
  'anime_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    small: varchar('small', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    large: varchar('large', { length: 255 }),
    type: varchar('type', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('anime_image_unique').on(t.url, t.source)]
);

export const animeVideo = pgTable(
  'anime_video',
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
  (t) => [uniqueIndex('anime_video_unique').on(t.url, t.source)]
);

export const animeScreenshot = pgTable(
  'anime_screenshot',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    order: integer('order').notNull(),
    small: varchar('small', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    large: varchar('large', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('anime_screenshot_unique').on(t.url, t.source)]
);

export const animeArtwork = pgTable(
  'anime_artwork',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: varchar('url', { length: 255 }).notNull(),
    height: integer('height'),
    width: integer('width'),
    large: varchar('large', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    iso_639_1: varchar('iso_639_1', { length: 255 }),
    type: varchar('type', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull()
  },
  (t) => [uniqueIndex('anime_artwork_unique').on(t.url, t.source)]
);

export const animeChronology = pgTable(
  'anime_chronology',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    order: integer('order').notNull(),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' })
  },
  (t) => [
    uniqueIndex('anime_chronology_unique').on(t.parent_id, t.related_id),
    index('idx_anime_chronology_parent_id').on(t.parent_id),
    index('idx_anime_chronology_anime_id').on(t.anime_id),
    index('idx_anime_chronology_related_id').on(t.related_id)
  ]
);

export const animeRecommendation = pgTable(
  'anime_recommendation',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    order: integer('order').notNull(),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' })
  },
  (t) => [
    uniqueIndex('anime_recommendation_unique').on(t.parent_id, t.related_id),
    index('idx_anime_recommendation_parent_id').on(t.parent_id),
    index('idx_anime_recommendation_anime_id').on(t.anime_id),
    index('idx_anime_recommendation_related_id').on(t.related_id)
  ]
);

export const animeEpisode = pgTable(
  'anime_episode',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    title: varchar('title', { length: 255 }),
    number: integer('number').notNull(),
    air_date: varchar('air_date', { length: 255 }),
    runtime: integer('runtime'),
    overview: text('overview'),
    anime_id: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' })
  },
  (t) => [
    uniqueIndex('anime_episode_unique').on(t.anime_id, t.number),
    index('idx_anime_episode_anime_id').on(t.anime_id)
  ]
);

export const animeEpisodeImage = pgTable(
  'anime_episode_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    small: varchar('small', { length: 255 }),
    medium: varchar('medium', { length: 255 }),
    large: varchar('large', { length: 255 }),
    episode_id: varchar('episode_id', { length: 255 })
      .unique()
      .references(() => animeEpisode.id, { onDelete: 'cascade' })
  },
  (t) => [index('idx_anime_episode_image_episode_id').on(t.episode_id)]
);

export const animeToLink = pgTable(
  '_anime_to_link',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeLink.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_link_a').on(t.A)]
);

export const animeToOtherTitle = pgTable(
  '_anime_to_other_title',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeOtherTitle.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_other_title_a').on(t.A)]
);

export const animeToOtherDescription = pgTable(
  '_anime_to_other_description',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeOtherDescription.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_other_description_a').on(t.A)]
);

export const animeToImage = pgTable(
  '_anime_to_image',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeImage.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_image_a').on(t.A)]
);

export const animeToVideo = pgTable(
  '_anime_to_video',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeVideo.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_video_a').on(t.A)]
);

export const animeToScreenshot = pgTable(
  '_anime_to_screenshot',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeScreenshot.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_screenshot_a').on(t.A)]
);

export const animeToArtwork = pgTable(
  '_anime_to_artwork',
  {
    A: integer('A')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => animeArtwork.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_anime_to_artwork_a').on(t.A)]
);
