import {
  boolean,
  customType,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  real,
  text,
  uniqueIndex,
  vector
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
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
    slug: text('slug'),
    background: text('background'),
    description: text('description'),
    status: text('status'),
    type: text('type'),
    format: text('format'),
    season: text('season'),
    season_year: integer('season_year'),
    duration: integer('duration'),
    country: text('country'),
    is_licensed: boolean('is_licensed').default(false),
    source: text('source'),
    hashtag: text('hashtag'),
    is_adult: boolean('is_adult').default(false),
    score: integer('score'),
    popularity: integer('popularity'),
    trending: integer('trending'),
    favorites: integer('favorites'),
    local_score: real('local_score').default(0),
    local_favorites: integer('local_favorites').default(0),
    color: text('color'),
    franchise: text('franchise'),
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
    index('idx_media_slug').on(t.slug),
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    week: integer('week'),
    time: text('time'),
    timezone: text('timezone'),
    ...timestamps
  },
  (t) => [index('idx_media_broadcast_media_id').on(t.media_id), index('idx_media_broadcast_week').on(t.week)]
);

export const mediaAgeRating = pgTable(
  'media_age_rating',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    media_id: integer('media_id')
      .notNull()
      .unique()
      .references(() => media.id, { onDelete: 'cascade' }),
    rating: text('rating'),
    description: text('description'),
    ...timestamps
  },
  (t) => [index('idx_media_age_rating_media_id').on(t.media_id), index('idx_media_age_rating_rating').on(t.rating)]
);

export const mediaStatistic = pgTable(
  'media_statistic',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull().unique(),
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
    B: text('B')
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  media_id: integer('media_id')
    .notNull()
    .unique()
    .references(() => media.id, { onDelete: 'cascade' }),
  episode: integer('episode'),
  airing_at: integer('airing_at'),
  ...timestamps
});

export const mediaNextAiringEpisode = pgTable('media_next_airing_episode', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  media_id: integer('media_id')
    .notNull()
    .unique()
    .references(() => media.id, { onDelete: 'cascade' }),
  episode: integer('episode'),
  airing_at: integer('airing_at'),
  ...timestamps
});

export const mediaLastAiringEpisode = pgTable('media_last_airing_episode', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
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
  age: text('age'),
  blood_type: text('blood_type'),
  description: text('description'),
  gender: text('gender'),
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
    role: text('role'),
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
  language: text('language'),
  age: integer('age'),
  blood_type: text('blood_type'),
  description: text('description'),
  gender: text('gender'),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    name: text('name').unique(),
    description: text('description'),
    category: text('category'),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    status: text('status').notNull(),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    link: text('link').notNull(),
    label: text('label').notNull(),
    type: text('type'),
    ...timestamps
  },
  (t) => [uniqueIndex('link_unique').on(t.link, t.label)]
);

export const mediaAltTitle = pgTable(
  'media_alt_title',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title').notNull(),
    source: text('source').notNull(),
    language: text('language'),
    ...timestamps
  },
  (t) => [uniqueIndex('alt_title_unique').on(t.title, t.source)]
);

export const mediaAltDescription = pgTable(
  'media_alt_description',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    description: text('description').notNull(),
    source: text('source').notNull(),
    language: text('language'),
    ...timestamps
  },
  (t) => [uniqueIndex('alt_description_unique').on(t.description, t.source)]
);

export const mediaImage = pgTable(
  'media_image',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    url: text('url').notNull(),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    type: text('type'),
    source: text('source').notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_image_unique').on(t.url, t.source)]
);

export const mediaVideo = pgTable(
  'media_video',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    url: text('url').notNull(),
    title: text('title'),
    thumbnail: text('thumbnail'),
    artist: text('artist'),
    type: text('type'),
    source: text('source').notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_video_unique').on(t.url, t.source)]
);

export const mediaScreenshot = pgTable(
  'media_screenshot',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    url: text('url').notNull(),
    order: integer('order').notNull(),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    source: text('source').notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_screenshot_unique').on(t.url, t.source)]
);

export const mediaArtwork = pgTable(
  'media_artwork',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    url: text('url').notNull(),
    height: integer('height'),
    width: integer('width'),
    large: text('large'),
    medium: text('medium'),
    iso_639_1: text('iso_639_1'),
    is_adult: boolean('is_adult').default(false),
    type: text('type'),
    source: text('source').notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_artwork_unique').on(t.url, t.source)]
);

export const mediaTranslation = pgTable(
  'media_translation',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    iso_639_1: text('iso_639_1'),
    title: text('title'),
    description: text('description'),
    tagline: text('tagline'),
    source: text('source').notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex('media_translation_unique').on(t.iso_639_1, t.title, t.source)]
);

export const mediaChronology = pgTable(
  'media_chronology',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    parent_id: integer('parent_id').notNull(),
    related_id: integer('related_id').notNull(),
    relation_type: text('relation_type').notNull(),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title'),
    number: integer('number').notNull(),
    air_date: text('air_date'),
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
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    small: text('small'),
    medium: text('medium'),
    large: text('large'),
    episode_id: text('episode_id')
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
    B: text('B')
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
    B: text('B')
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
    B: text('B')
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
    B: text('B')
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
    B: text('B')
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
    B: text('B')
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
    B: text('B')
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
    B: text('B')
      .notNull()
      .references(() => mediaTranslation.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.A, t.B] }), index('idx_media_to_translation_a').on(t.A)]
);
