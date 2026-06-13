import {
  boolean,
  customType,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  varchar,
  vector
} from 'drizzle-orm/pg-core';
import cuid from 'cuid';
import { sql, SQL } from 'drizzle-orm';

const timestamps = {
  created_at: integer('created_at').$defaultFn(() => Math.floor(Date.now() / 1000)),
  updated_at: integer('updated_at')
    .$defaultFn(() => Math.floor(Date.now() / 1000))
    .$onUpdateFn(() => Math.floor(Date.now() / 1000))
};

export const media = pgTable(
  'media',
  {
    id: integer('id').primaryKey(),
    id_mal: integer('id_mal'),
    background: text('background'),
    description: text('description'),
    status: varchar('status', { length: 255 }),
    type: varchar('type', { length: 255 }),
    format: varchar('format', { length: 255 }),
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
    local_favorites: integer('local_favorites'),
    color: varchar('color', { length: 255 }),
    franchise: varchar('franchise', { length: 255 }),
    episodes_aired: integer('episodes_aired'),
    episodes_total: integer('episodes_total'),
    volumes: integer('volumes'),
    chapters: integer('chapters'),
    more_info: text('more_info'),
    air_week: integer('air_week'),
    views_total: integer('views_total').default(0),
    views_hour: integer('views_hour').default(0),
    views_today: integer('views_today').default(0),
    views_week: integer('views_week').default(0),
    views_month: integer('views_month').default(0),
    auto_update: boolean('auto_update').default(true),
    disabled: boolean('disabled').default(false),
    ...timestamps
  },
  (t) => [
    index('idx_media_id_mal').on(t.id_mal),
    index('idx_media_status').on(t.status),
    index('idx_media_type').on(t.type),
    index('idx_media_format').on(t.format),
    index('idx_media_season').on(t.season),
    index('idx_media_season_year').on(t.season_year),
    index('idx_media_source').on(t.source),
    index('idx_media_country').on(t.country),
    index('idx_media_is_adult').on(t.is_adult),
    index('idx_media_is_licensed').on(t.is_licensed),
    index('idx_media_score').on(t.score),
    index('idx_media_popularity').on(t.popularity),
    index('idx_media_trending').on(t.trending),
    index('idx_media_favorites').on(t.favorites),
    index('idx_media_franchise').on(t.franchise),
    index('idx_media_updated_at').on(t.updated_at),
    index('idx_media_season_season_year').on(t.season, t.season_year),
    index('idx_media_season_year_format').on(t.season_year, t.format)
  ]
);

export const mediaEmbedding = pgTable('media_embedding', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  media_id: integer('media_id')
    .notNull()
    .unique()
    .references(() => media.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 1536 }),
  ...timestamps
});

export const mediaPoster = pgTable(
  'media_poster',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    ...timestamps
  },
  (t) => [index('idx_media_poster_media_id').on(t.media_id)]
);

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  }
});

export const mediaTitle = pgTable(
  'media_title',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    romaji: text('romaji'),
    english: text('english'),
    native: text('native'),
    search_vector: tsvector('search_vector').generatedAlwaysAs(
      (): SQL => sql`to_tsvector('english',
          coalesce(${mediaTitle.romaji}, '') || ' ' ||
          coalesce(${mediaTitle.english}, '') || ' ' ||
          coalesce(${mediaTitle.native}, '')
        )`
    ),
    ...timestamps
  },
  (t) => [
    index('idx_media_title_media_id').on(t.media_id),
    index('idx_media_title_romaji').on(t.romaji),
    index('idx_media_title_english').on(t.english),
    index('idx_media_title_native').on(t.native),
    index('search_vector_idx').using('gin', t.search_vector)
  ]
);

export const mediaStartDate = pgTable(
  'media_start_date',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    day: integer('day'),
    month: integer('month'),
    year: integer('year'),
    ...timestamps
  },
  (t) => [index('idx_media_start_date_media_id').on(t.media_id), index('idx_media_start_date_year').on(t.year)]
);

export const mediaEndDate = pgTable(
  'media_end_date',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    day: integer('day'),
    month: integer('month'),
    year: integer('year'),
    ...timestamps
  },
  (t) => [index('idx_media_end_date_media_id').on(t.media_id), index('idx_media_end_date_year').on(t.year)]
);

export const mediaBroadcast = pgTable(
  'media_broadcast',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    week: integer('week'),
    time: varchar('time', { length: 255 }),
    timezone: varchar('timezone', { length: 255 }),
    ...timestamps
  },
  (t) => [index('idx_media_broadcast_media_id').on(t.media_id), index('idx_media_broadcast_week').on(t.week)]
);

export const mediaAgeRating = pgTable(
  'media_age_rating',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    rating: varchar('rating', { length: 255 }),
    description: varchar('description', { length: 255 }),
    ...timestamps
  },
  (t) => [index('idx_media_age_rating_media_id').on(t.media_id), index('idx_media_age_rating_rating').on(t.rating)]
);

export const mediaStatistic = pgTable(
  'media_statistic',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    views_count: integer('views_count').default(0),
    record_date: date('record_date').defaultNow()
  },
  (t) => [uniqueIndex('media_statistic_unique').on(t.media_id, t.record_date)]
);

export const mediaGenre = pgTable(
  'media_genre',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    name: varchar('name', { length: 255 }).notNull().unique(),
    ...timestamps
  },
  (t) => [index('idx_media_genre_name').on(t.name)]
);

export const mediaToGenre = pgTable(
  '_media_to_genre',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaGenre.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    primaryKey({ columns: [t.A, t.B] }),
    index('idx_media_to_genre_a').on(t.A),
    index('idx_media_to_genre_b').on(t.B)
  ]
);

export const mediaAiringSchedule = pgTable(
  'media_airing_schedule',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    episode: integer('episode'),
    airing_at: integer('airing_at'),
    ...timestamps
  },
  (t) => [
    uniqueIndex('media_airing_schedule_unique').on(t.media_id, t.episode),
    index('idx_media_airing_schedule_media_id').on(t.media_id)
  ]
);

export const mediaLatestAiringEpisode = pgTable('media_latest_airing_episode', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  media_id: integer('media_id')
    .notNull()
    .unique()
    .references(() => media.id, { onDelete: 'cascade' }),
  episode: integer('episode'),
  airing_at: integer('airing_at'),
  ...timestamps
});

export const mediaNextAiringEpisode = pgTable('media_next_airing_episode', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  media_id: integer('media_id')
    .notNull()
    .unique()
    .references(() => media.id, { onDelete: 'cascade' }),
  episode: integer('episode'),
  airing_at: integer('airing_at'),
  ...timestamps
});

export const mediaLastAiringEpisode = pgTable('media_last_airing_episode', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => cuid()),
  media_id: integer('media_id')
    .notNull()
    .unique()
    .references(() => media.id, { onDelete: 'cascade' }),
  episode: integer('episode'),
  airing_at: integer('airing_at'),
  ...timestamps
});

export const mediaCharacter = pgTable('media_character', {
  id: integer('id').primaryKey(),
  age: varchar('age', { length: 255 }),
  blood_type: varchar('blood_type', { length: 255 }),
  description: text('description'),
  gender: varchar('gender', { length: 255 }),
  ...timestamps
});

export const mediaToCharacter = pgTable(
  '_media_to_character',
  {
    id: integer('id').primaryKey(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    character_id: integer('character_id')
      .notNull()
      .references(() => mediaCharacter.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 255 }),
    role_i: integer('role_i').default(2), // 0: Main, 1: Support, 2: Background
    ...timestamps
  },
  (t) => [
    index('idx_media_to_character_media_id').on(t.media_id),
    index('idx_media_to_character_character_id').on(t.character_id)
  ]
);

export const mediaVoiceActor = pgTable('media_voice_actor', {
  id: integer('id').primaryKey(),
  language: varchar('language', { length: 255 }),
  age: integer('age'),
  blood_type: varchar('blood_type', { length: 255 }),
  description: text('description'),
  gender: varchar('gender', { length: 255 }),
  home_town: text('home_town'),
  ...timestamps
});

export const characterToVoiceActor = pgTable(
  '_character_to_voice_actor',
  {
    A: integer('A')
      .notNull()
      .references(() => mediaToCharacter.id, { onDelete: 'cascade' }),
    B: integer('B')
      .notNull()
      .references(() => mediaVoiceActor.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    primaryKey({ columns: [t.A, t.B] }),
    index('idx_character_to_voice_actor_a').on(t.A),
    index('idx_character_to_voice_actor_b').on(t.B)
  ]
);

export const mediaCharacterBirthDate = pgTable(
  'media_character_birth_date',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    day: integer('day'),
    month: integer('month'),
    year: integer('year'),
    character_id: integer('character_id')
      .unique()
      .references(() => mediaCharacter.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_character_birth_date_character_id').on(t.character_id)]
);

export const mediaCharacterName = pgTable(
  'media_character_name',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    first: text('first'),
    middle: text('middle'),
    last: text('last'),
    full: text('full'),
    native: text('native'),
    alternative: text('alternative').array(),
    alternative_spoiler: text('alternative_spoiler').array(),
    character_id: integer('character_id')
      .unique()
      .references(() => mediaCharacter.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_character_name_character_id').on(t.character_id)]
);

export const mediaCharacterImage = pgTable(
  'media_character_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    large: text('large'),
    medium: text('medium'),
    character_id: integer('character_id')
      .unique()
      .references(() => mediaCharacter.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_character_image_character_id').on(t.character_id)]
);

export const mediaVoiceBirthDate = pgTable(
  'media_voice_birth_date',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    day: integer('day'),
    month: integer('month'),
    year: integer('year'),
    voice_actor_id: integer('character_id')
      .unique()
      .references(() => mediaVoiceActor.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_voice_birth_date_voice_actor_id').on(t.voice_actor_id)]
);

export const mediaVoiceDeathDate = pgTable(
  'media_voice_death_date',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    day: integer('day'),
    month: integer('month'),
    year: integer('year'),
    voice_actor_id: integer('character_id')
      .unique()
      .references(() => mediaVoiceActor.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_voice_death_date_voice_actor_id').on(t.voice_actor_id)]
);

export const mediaVoiceName = pgTable(
  'media_voice_name',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    first: text('first'),
    middle: text('middle'),
    last: text('last'),
    full: text('full'),
    native: text('native'),
    alternative: text('alternative').array(),
    voice_actor_id: integer('voice_actor_id')
      .unique()
      .references(() => mediaVoiceActor.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_voice_name_voice_actor_id').on(t.voice_actor_id)]
);

export const mediaVoiceImage = pgTable(
  'media_voice_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    large: text('large'),
    medium: text('medium'),
    voice_actor_id: integer('voice_actor_id')
      .unique()
      .references(() => mediaVoiceActor.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_voice_image_voice_actor_id').on(t.voice_actor_id)]
);

export const mediaStudio = pgTable(
  'media_studio',
  {
    id: integer('id').primaryKey(),
    name: text('name'),
    ...timestamps
  },
  (t) => [index('idx_media_studio_name').on(t.name)]
);

export const mediaToStudio = pgTable(
  '_media_to_studio',
  {
    id: integer('id').primaryKey(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    studio_id: integer('studio_id')
      .notNull()
      .references(() => mediaStudio.id, { onDelete: 'cascade' }),
    is_main: boolean('is_main'),
    ...timestamps
  },
  (t) => [
    index('idx_media_to_studio_media_id').on(t.media_id),
    index('idx_media_to_studio_studio_id').on(t.studio_id)
  ]
);

export const mediaTag = pgTable(
  'media_tag',
  {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique(),
    description: text('description'),
    category: varchar('category', { length: 255 }),
    is_adult: boolean('is_adult'),
    ...timestamps
  },
  (t) => [
    index('idx_media_tag_category').on(t.category),
    index('idx_media_tag_is_adult').on(t.is_adult),
    index('idx_media_tag_name').on(t.name)
  ]
);

export const mediaToTag = pgTable(
  '_media_to_tag',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    tag_id: integer('tag_id')
      .notNull()
      .references(() => mediaTag.id, { onDelete: 'cascade' }),
    rank: integer('rank'),
    is_spoiler: boolean('is_spoiler'),
    ...timestamps
  },
  (t) => [
    uniqueIndex('media_tag_unique').on(t.media_id, t.tag_id),
    index('idx_media_to_tag_media_id').on(t.media_id),
    index('idx_media_to_tag_tag_id').on(t.tag_id)
  ]
);

export const mediaScoreDistribution = pgTable(
  'media_score_distribution',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    score: integer('score').notNull(),
    amount: integer('amount').notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('score_distribution_unique').on(t.media_id, t.score),
    index('idx_media_score_distribution_media_id').on(t.media_id)
  ]
);

export const mediaStatusDistribution = pgTable(
  'media_status_distribution',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    status: varchar('status', { length: 255 }).notNull(),
    amount: integer('amount').notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('status_distribution_unique').on(t.media_id, t.status),
    index('idx_media_status_distribution_media_id').on(t.media_id)
  ]
);

export const mediaLocalScoreDistribution = pgTable(
  'media_local_score_distribution',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    score: integer('score').notNull(),
    amount: integer('amount').notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('score_local_distribution_unique').on(t.media_id, t.score),
    index('idx_media_local_score_distribution_media_id').on(t.media_id)
  ]
);

export const mediaLocalStatusDistribution = pgTable(
  'media_local_status_distribution',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    status: integer('status').notNull(),
    amount: integer('amount').notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('status_local_distribution_unique').on(t.media_id, t.status),
    index('idx_media_local_status_distribution_media_id').on(t.media_id)
  ]
);

export const mediaLink = pgTable(
  'media_link',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    link: text('link').notNull(),
    label: text('label').notNull(),
    type: varchar('type', { length: 255 }),
    ...timestamps
  },
  (t) => [uniqueIndex('link_unique').on(t.link, t.label)]
);

export const mediaAltTitle = pgTable(
  'media_alt_title',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    title: text('title').notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    language: varchar('language', { length: 255 }),
    ...timestamps
  },
  (t) => [uniqueIndex('alt_title_unique').on(t.title, t.source)]
);

export const mediaAltDescription = pgTable(
  'media_alt_description',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    description: text('description').notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    language: varchar('language', { length: 255 }),
    ...timestamps
  },
  (t) => [uniqueIndex('alt_description_unique').on(t.description, t.source)]
);

export const mediaImage = pgTable(
  'media_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: text('url').notNull(),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    type: varchar('type', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_image_unique').on(t.url, t.source)]
);

export const mediaVideo = pgTable(
  'media_video',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: text('url').notNull(),
    title: text('title'),
    thumbnail: text('thumbnail'),
    artist: text('artist'),
    type: varchar('type', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_video_unique').on(t.url, t.source)]
);

export const mediaScreenshot = pgTable(
  'media_screenshot',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: text('url').notNull(),
    order: integer('order').notNull(),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    source: varchar('source', { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_screenshot_unique').on(t.url, t.source)]
);

export const mediaArtwork = pgTable(
  'media_artwork',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    url: text('url').notNull(),
    height: integer('height'),
    width: integer('width'),
    large: text('large'),
    medium: text('medium'),
    iso_639_1: varchar('iso_639_1', { length: 255 }),
    is_adult: boolean('is_adult').default(false),
    type: varchar('type', { length: 255 }),
    source: varchar('source', { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_artwork_unique').on(t.url, t.source)]
);

export const mediaTranslation = pgTable(
  'media_translation',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    iso_639_1: varchar('iso_639_1', { length: 255 }),
    title: text('title'),
    description: text('description'),
    tagline: text('tagline'),
    source: varchar('source', { length: 255 }).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_translation_unique').on(t.iso_639_1, t.title, t.source)]
);

export const mediaChronology = pgTable(
  'media_chronology',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    order: integer('order').notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('media_chronology_unique').on(t.parent_id, t.related_id),
    index('idx_media_chronology_parent_id').on(t.parent_id),
    index('idx_media_chronology_media_id').on(t.media_id),
    index('idx_media_chronology_related_id').on(t.related_id)
  ]
);

export const mediaRecommendation = pgTable(
  'media_recommendation',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    order: integer('order').notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('media_recommendation_unique').on(t.parent_id, t.related_id),
    index('idx_media_recommendation_parent_id').on(t.parent_id),
    index('idx_media_recommendation_media_id').on(t.media_id),
    index('idx_media_recommendation_related_id').on(t.related_id)
  ]
);

export const mediaRelation = pgTable(
  'media_relation',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    relation_type: varchar('relation_type', { length: 255 }).notNull(),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('media_relation_unique').on(t.parent_id, t.related_id),
    index('idx_media_relation_parent_id').on(t.parent_id),
    index('idx_media_relation_media_id').on(t.media_id),
    index('idx_media_relation_related_id').on(t.related_id)
  ]
);

export const mediaEpisode = pgTable(
  'media_episode',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    title: text('title'),
    number: integer('number').notNull(),
    air_date: varchar('air_date', { length: 255 }),
    runtime: integer('runtime'),
    overview: text('overview'),
    views: integer('views').default(0),
    media_id: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    uniqueIndex('media_episode_unique').on(t.media_id, t.number),
    index('idx_media_episode_media_id').on(t.media_id)
  ]
);

export const mediaEpisodeImage = pgTable(
  'media_episode_image',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => cuid()),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    episode_id: varchar('episode_id', { length: 255 })
      .unique()
      .references(() => mediaEpisode.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [index('idx_media_episode_image_episode_id').on(t.episode_id)]
);

export const mediaToLink = pgTable(
  '_media_to_link',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaLink.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_link_a').on(t.A)]
);

export const mediaToAltTitle = pgTable(
  '_media_to_alt_title',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaAltTitle.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_alt_title_a').on(t.A)]
);

export const mediaToAltDescription = pgTable(
  '_media_to_alt_description',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaAltDescription.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_alt_description_a').on(t.A)]
);

export const mediaToImage = pgTable(
  '_media_to_image',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaImage.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_image_a').on(t.A)]
);

export const mediaToVideo = pgTable(
  '_media_to_video',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaVideo.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_video_a').on(t.A)]
);

export const mediaToScreenshot = pgTable(
  '_media_to_screenshot',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaScreenshot.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_screenshot_a').on(t.A)]
);

export const mediaToArtwork = pgTable(
  '_media_to_artwork',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaArtwork.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_artwork_a').on(t.A)]
);

export const mediaToTranslation = pgTable(
  '_media_to_translation',
  {
    A: integer('A')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    B: varchar('B', { length: 255 })
      .notNull()
      .references(() => mediaTranslation.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_translation_a').on(t.A)]
);
