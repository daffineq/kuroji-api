import {
  MediaArgs,
  ArtworksArgs,
  EpisodeArgs,
  ImageArgs,
  LinkArgs,
  AltDescriptionArgs,
  AltTitleArgs,
  ScreenshotArgs,
  TranslationsArgs,
  VideoArgs
} from './types';
import {
  db,
  media,
  mediaTitle,
  mediaStartDate,
  mediaEndDate,
  mediaGenre,
  mediaToGenre,
  mediaStudio,
  mediaToStudio,
  mediaTag,
  mediaToTag,
  mediaLatestAiringEpisode,
  mediaNextAiringEpisode,
  mediaLastAiringEpisode,
  mediaAiringSchedule,
  mediaAgeRating,
  mediaEmbedding
} from 'src/db';
import {
  eq,
  and,
  or,
  inArray,
  gte,
  lte,
  gt,
  lt,
  sql,
  desc,
  asc,
  SQL,
  exists,
  notInArray,
  not,
  notExists
} from 'drizzle-orm';
import { Loaders } from './loaders';
import { GraphQLError } from 'graphql';
import { getEmbedding } from 'src/lib/openai';

const filterMedia = async (
  args: MediaArgs
): Promise<{
  where: SQL | undefined;
  orderBy: SQL[];
  take: number;
  skip: number;
  page: number;
}> => {
  const {
    page = 1,
    per_page = 20,
    search,
    id,
    id_in,
    id_not,
    id_not_in,
    id_mal,
    id_mal_in,
    id_mal_not,
    id_mal_not_in,
    season,
    season_year,
    season_year_greater,
    season_year_lesser,
    format,
    format_in,
    format_not_in,
    status,
    status_in,
    status_not_in,
    type,
    source,
    source_in,
    country,
    is_licensed,
    is_adult,
    air_week,
    air_week_in,
    air_week_not_in,
    age_rating,
    age_rating_in,
    age_rating_not_in,
    genres,
    genres_in,
    genres_not_in,
    tags,
    tags_in,
    tags_not_in,
    studios,
    studios_in,
    studios_not_in,
    studio_is_main,
    score_greater,
    score_lesser,
    popularity_greater,
    popularity_lesser,
    episodes_greater,
    episodes_lesser,
    duration_greater,
    duration_lesser,
    start_date_greater,
    start_date_lesser,
    end_date_greater,
    end_date_lesser,
    start_date_like,
    end_date_like,
    airing_at_greater,
    airing_at_lesser,
    has_next_episode,
    franchise,
    views_total_greater,
    views_total_lesser,
    views_hour_greater,
    views_hour_lesser,
    views_today_greater,
    views_today_lesser,
    views_week_greater,
    views_week_lesser,
    views_month_greater,
    views_month_lesser,
    sort = ['ID_DESC']
  } = args;

  if (per_page > 100) {
    throw new GraphQLError('per_page exceeds the limit of 100', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
  }

  const skip = (page - 1) * per_page;
  const conditions: SQL[] = [];

  const embedding = await getEmbedding(search);

  // Search
  if (search) {
    conditions.push(
      or(
        exists(
          db
            .select()
            .from(mediaTitle)
            .where(
              and(
                eq(mediaTitle.media_id, media.id),
                sql`${mediaTitle.search_vector} @@ plainto_tsquery('english', ${search})`
              )
            )
        ),
        embedding
          ? exists(
              db
                .select()
                .from(mediaEmbedding)
                .where(
                  and(
                    eq(mediaEmbedding.media_id, media.id),
                    sql`${mediaEmbedding.embedding} <=> ${JSON.stringify(embedding)}::vector < 0.8`
                  )
                )
            )
          : undefined
      )!
    );
  }

  // ID filters
  if (id) conditions.push(eq(media.id, id));
  if (id_in?.length) conditions.push(inArray(media.id, id_in));
  if (id_not) conditions.push(not(eq(media.id, id_not)));
  if (id_not_in?.length) conditions.push(notInArray(media.id, id_not_in));

  if (id_mal) conditions.push(eq(media.id_mal, id_mal));
  if (id_mal_in?.length) conditions.push(inArray(media.id_mal, id_mal_in));
  if (id_mal_not) conditions.push(not(eq(media.id_mal, id_mal_not)));
  if (id_mal_not_in?.length) conditions.push(notInArray(media.id_mal, id_mal_not_in));

  // Season filters
  if (season) conditions.push(eq(media.season, season));
  if (season_year) conditions.push(eq(media.season_year, season_year));
  if (season_year_greater) conditions.push(gte(media.season_year, season_year_greater));
  if (season_year_lesser) conditions.push(lte(media.season_year, season_year_lesser));

  // Format filters
  if (format) conditions.push(eq(media.format, format));
  if (format_in?.length) conditions.push(inArray(media.format, format_in));
  if (format_not_in?.length) conditions.push(notInArray(media.format, format_not_in));

  // Status filters
  if (status) conditions.push(eq(media.status, status));
  if (status_in?.length) conditions.push(inArray(media.status, status_in));
  if (status_not_in?.length) conditions.push(notInArray(media.status, status_not_in));

  // Air week filters
  if (air_week) conditions.push(eq(media.air_week, air_week));
  if (air_week_in?.length) conditions.push(inArray(media.air_week, air_week_in));
  if (air_week_not_in?.length) conditions.push(notInArray(media.air_week, air_week_not_in));

  // Age rating filters
  if (age_rating) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaAgeRating)
          .where(and(eq(mediaAgeRating.media_id, media.id), eq(mediaAgeRating.rating, age_rating)))
      )
    );
  }

  if (age_rating_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaAgeRating)
          .where(and(eq(mediaAgeRating.media_id, media.id), inArray(mediaAgeRating.rating, age_rating_in)))
      )
    );
  }

  if (age_rating_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(mediaAgeRating)
            .where(and(eq(mediaAgeRating.media_id, media.id), inArray(mediaAgeRating.rating, age_rating_not_in)))
        )
      )
    );
  }

  // Views
  if (views_total_greater !== undefined) conditions.push(gte(media.views_total, views_total_greater));
  if (views_total_lesser !== undefined) conditions.push(lte(media.views_total, views_total_lesser));

  if (views_hour_greater !== undefined) conditions.push(gte(media.views_hour, views_hour_greater));
  if (views_hour_lesser !== undefined) conditions.push(lte(media.views_hour, views_hour_lesser));

  if (views_today_greater !== undefined) conditions.push(gte(media.views_today, views_today_greater));
  if (views_today_lesser !== undefined) conditions.push(lte(media.views_today, views_today_lesser));

  if (views_week_greater !== undefined) conditions.push(gte(media.views_week, views_week_greater));
  if (views_week_lesser !== undefined) conditions.push(lte(media.views_week, views_week_lesser));

  if (views_month_greater !== undefined) conditions.push(gte(media.views_month, views_month_greater));
  if (views_month_lesser !== undefined) conditions.push(lte(media.views_month, views_month_lesser));

  // Type and source filters
  if (type) conditions.push(eq(media.type, type));
  if (source) conditions.push(eq(media.source, source));
  if (source_in?.length) conditions.push(inArray(media.source, source_in));
  if (country) conditions.push(eq(media.country, country));

  // Boolean filters
  if (is_licensed !== undefined) conditions.push(eq(media.is_licensed, is_licensed));
  if (is_adult !== undefined) conditions.push(eq(media.is_adult, is_adult));

  // Airing schedule
  if (has_next_episode !== undefined) {
    if (has_next_episode) {
      conditions.push(
        exists(db.select().from(mediaNextAiringEpisode).where(eq(mediaNextAiringEpisode.media_id, media.id)))
      );
    } else {
      conditions.push(
        notExists(db.select().from(mediaNextAiringEpisode).where(eq(mediaNextAiringEpisode.media_id, media.id)))
      );
    }
  }

  if (airing_at_greater !== undefined) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaAiringSchedule)
          .where(
            and(eq(mediaAiringSchedule.media_id, media.id), gte(mediaAiringSchedule.airing_at, airing_at_greater))
          )
      )
    );
  }

  if (airing_at_lesser !== undefined) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaAiringSchedule)
          .where(
            and(eq(mediaAiringSchedule.media_id, media.id), lte(mediaAiringSchedule.airing_at, airing_at_lesser))
          )
      )
    );
  }

  // Genre filters
  if (genres) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaToGenre)
          .innerJoin(mediaGenre, eq(mediaGenre.id, mediaToGenre.B))
          .where(and(eq(mediaToGenre.A, media.id), eq(mediaGenre.name, genres)))
      )
    );
  }

  if (genres_in?.length) {
    conditions.push(
      exists(
        db
          .select({ id: mediaToGenre.A })
          .from(mediaToGenre)
          .innerJoin(mediaGenre, eq(mediaGenre.id, mediaToGenre.B))
          .where(and(eq(mediaToGenre.A, media.id), inArray(mediaGenre.name, genres_in)))
          .groupBy(mediaToGenre.A)
          .having(sql`count(distinct ${mediaGenre.name}) = ${genres_in.length}`)
      )
    );
  }

  if (genres_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(mediaToGenre)
            .innerJoin(mediaGenre, eq(mediaGenre.id, mediaToGenre.B))
            .where(and(eq(mediaToGenre.A, media.id), inArray(mediaGenre.name, genres_not_in)))
        )
      )
    );
  }

  // Tag filters
  if (tags) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaToTag)
          .innerJoin(mediaTag, eq(mediaTag.id, mediaToTag.tag_id))
          .where(and(eq(mediaToTag.media_id, media.id), eq(mediaTag.name, tags)))
      )
    );
  }

  if (tags_in?.length) {
    conditions.push(
      exists(
        db
          .select({ id: mediaToTag.id })
          .from(mediaToTag)
          .innerJoin(mediaTag, eq(mediaTag.id, mediaToTag.tag_id))
          .where(and(eq(mediaToTag.media_id, media.id), inArray(mediaTag.name, tags_in)))
          .groupBy(mediaToTag.id)
          .having(sql`count(distinct ${mediaTag.name}) = ${tags_in.length}`)
      )
    );
  }

  if (tags_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(mediaToTag)
            .innerJoin(mediaTag, eq(mediaTag.id, mediaToTag.tag_id))
            .where(and(eq(mediaToTag.media_id, media.id), inArray(mediaTag.name, tags_not_in)))
        )
      )
    );
  }

  // Studio filters
  if (studios) {
    conditions.push(
      exists(
        db
          .select()
          .from(mediaToStudio)
          .innerJoin(mediaStudio, eq(mediaStudio.id, mediaToStudio.studio_id))
          .where(
            and(
              eq(mediaToStudio.media_id, media.id),
              eq(mediaStudio.name, studios),
              studio_is_main !== undefined && studio_is_main !== null
                ? eq(mediaToStudio.is_main, studio_is_main)
                : undefined
            )
          )
      )
    );
  }

  if (studios_in?.length) {
    conditions.push(
      exists(
        db
          .select({ id: mediaToStudio.id })
          .from(mediaToStudio)
          .innerJoin(mediaStudio, eq(mediaStudio.id, mediaToStudio.studio_id))
          .where(
            and(
              eq(mediaToStudio.media_id, media.id),
              inArray(mediaStudio.name, studios_in),
              studio_is_main !== undefined && studio_is_main !== null
                ? eq(mediaToStudio.is_main, studio_is_main)
                : undefined
            )
          )
          .groupBy(mediaToStudio.id)
          .having(sql`count(distinct ${mediaStudio.name}) = ${studios_in.length}`)
      )
    );
  }

  if (studios_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(mediaToStudio)
            .innerJoin(mediaStudio, eq(mediaStudio.id, mediaToStudio.studio_id))
            .where(
              and(
                eq(mediaToStudio.media_id, media.id),
                inArray(mediaStudio.name, studios_not_in),
                studio_is_main !== undefined && studio_is_main !== null
                  ? eq(mediaToStudio.is_main, studio_is_main)
                  : undefined
              )
            )
        )
      )
    );
  }

  // Score filters
  if (score_greater !== undefined) conditions.push(gte(media.score, score_greater));
  if (score_lesser !== undefined) conditions.push(lte(media.score, score_lesser));

  // Popularity filters
  if (popularity_greater !== undefined) conditions.push(gte(media.popularity, popularity_greater));
  if (popularity_lesser !== undefined) conditions.push(lte(media.popularity, popularity_lesser));

  // Episode filters
  if (episodes_greater !== undefined) conditions.push(gte(media.episodes_total, episodes_greater));
  if (episodes_lesser !== undefined) conditions.push(lte(media.episodes_total, episodes_lesser));

  // Duration filters
  if (duration_greater !== undefined) conditions.push(gte(media.duration, duration_greater));
  if (duration_lesser !== undefined) conditions.push(lte(media.duration, duration_lesser));

  // Date filters
  if (start_date_greater) {
    const [year, month, day] = start_date_greater.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(mediaStartDate)
          .where(
            and(
              eq(mediaStartDate.media_id, media.id),
              or(
                gt(mediaStartDate.year, year!),
                and(eq(mediaStartDate.year, year!), gt(mediaStartDate.month, month!)),
                and(eq(mediaStartDate.year, year!), eq(mediaStartDate.month, month!), gt(mediaStartDate.day, day!))
              )
            )
          )
      )
    );
  }

  if (start_date_lesser) {
    const [year, month, day] = start_date_lesser.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(mediaStartDate)
          .where(
            and(
              eq(mediaStartDate.media_id, media.id),
              or(
                lt(mediaStartDate.year, year!),
                and(eq(mediaStartDate.year, year!), lt(mediaStartDate.month, month!)),
                and(eq(mediaStartDate.year, year!), eq(mediaStartDate.month, month!), lt(mediaStartDate.day, day!))
              )
            )
          )
      )
    );
  }

  if (start_date_like) {
    const [year, month, day] = start_date_like.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(mediaStartDate)
          .where(
            and(
              eq(mediaStartDate.media_id, media.id),
              eq(mediaStartDate.year, year!),
              eq(mediaStartDate.month, month!),
              eq(mediaStartDate.day, day!)
            )
          )
      )
    );
  }

  if (end_date_greater) {
    const [year, month, day] = end_date_greater.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(mediaEndDate)
          .where(
            and(
              eq(mediaEndDate.media_id, media.id),
              or(
                gt(mediaEndDate.year, year!),
                and(eq(mediaEndDate.year, year!), gt(mediaEndDate.month, month!)),
                and(eq(mediaEndDate.year, year!), eq(mediaEndDate.month, month!), gt(mediaEndDate.day, day!))
              )
            )
          )
      )
    );
  }

  if (end_date_lesser) {
    const [year, month, day] = end_date_lesser.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(mediaEndDate)
          .where(
            and(
              eq(mediaEndDate.media_id, media.id),
              or(
                lt(mediaEndDate.year, year!),
                and(eq(mediaEndDate.year, year!), lt(mediaEndDate.month, month!)),
                and(eq(mediaEndDate.year, year!), eq(mediaEndDate.month, month!), lt(mediaEndDate.day, day!))
              )
            )
          )
      )
    );
  }

  if (end_date_like) {
    const [year, month, day] = end_date_like.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(mediaEndDate)
          .where(
            and(
              eq(mediaEndDate.media_id, media.id),
              eq(mediaEndDate.year, year!),
              eq(mediaEndDate.month, month!),
              eq(mediaEndDate.day, day!)
            )
          )
      )
    );
  }

  if (franchise) {
    conditions.push(eq(media.franchise, franchise));
  }

  const orderBy: SQL[] = [];

  sort.forEach((s) => {
    switch (s) {
      case 'ID_DESC':
        orderBy.push(desc(media.id));
        break;
      case 'ID_ASC':
        orderBy.push(asc(media.id));
        break;
      case 'TITLE_ROMAJI':
        orderBy.push(asc(mediaTitle.romaji));
        break;
      case 'TITLE_ROMAJI_DESC':
        orderBy.push(desc(mediaTitle.romaji));
        break;
      case 'TITLE_ENGLISH':
        orderBy.push(asc(mediaTitle.english));
        break;
      case 'TITLE_ENGLISH_DESC':
        orderBy.push(desc(mediaTitle.english));
        break;
      case 'TITLE_NATIVE':
        orderBy.push(asc(mediaTitle.native));
        break;
      case 'TITLE_NATIVE_DESC':
        orderBy.push(desc(mediaTitle.native));
        break;
      case 'SCORE_DESC':
        orderBy.push(sql`${media.score} DESC NULLS LAST`);
        break;
      case 'SCORE_ASC':
        orderBy.push(sql`${media.score} ASC NULLS LAST`);
        break;
      case 'POPULARITY_DESC':
        orderBy.push(sql`${media.popularity} DESC NULLS LAST`);
        break;
      case 'POPULARITY_ASC':
        orderBy.push(sql`${media.popularity} ASC NULLS LAST`);
        break;
      case 'TRENDING_DESC':
        orderBy.push(sql`${media.trending} DESC NULLS LAST`);
        break;
      case 'TRENDING_ASC':
        orderBy.push(sql`${media.trending} ASC NULLS LAST`);
        break;
      case 'FAVORITES_DESC':
        orderBy.push(sql`${media.favorites} DESC NULLS LAST`);
        break;
      case 'FAVORITES_ASC':
        orderBy.push(sql`${media.favorites} ASC NULLS LAST`);
        break;
      case 'START_DATE_DESC':
        orderBy.push(sql`${mediaStartDate.year} DESC NULLS LAST`);
        orderBy.push(sql`${mediaStartDate.month} DESC NULLS LAST`);
        orderBy.push(sql`${mediaStartDate.day} DESC NULLS LAST`);
        break;
      case 'START_DATE_ASC':
        orderBy.push(sql`${mediaStartDate.year} ASC NULLS LAST`);
        orderBy.push(sql`${mediaStartDate.month} ASC NULLS LAST`);
        orderBy.push(sql`${mediaStartDate.day} ASC NULLS LAST`);
        break;
      case 'END_DATE_DESC':
        orderBy.push(sql`${mediaEndDate.year} DESC NULLS LAST`);
        orderBy.push(sql`${mediaEndDate.month} DESC NULLS LAST`);
        orderBy.push(sql`${mediaEndDate.day} DESC NULLS LAST`);
        break;
      case 'END_DATE_ASC':
        orderBy.push(sql`${mediaEndDate.year} ASC NULLS LAST`);
        orderBy.push(sql`${mediaEndDate.month} ASC NULLS LAST`);
        orderBy.push(sql`${mediaEndDate.day} ASC NULLS LAST`);
        break;
      case 'UPDATED_AT_DESC':
        orderBy.push(desc(media.updated_at));
        break;
      case 'UPDATED_AT_ASC':
        orderBy.push(asc(media.updated_at));
        break;
      case 'AIR_WEEK_DESC':
        orderBy.push(sql`${media.air_week} DESC NULLS LAST`);
        break;
      case 'AIR_WEEK_ASC':
        orderBy.push(sql`${media.air_week} ASC NULLS LAST`);
        break;
      case 'EPISODES_DESC':
        orderBy.push(sql`${media.episodes_total} DESC NULLS LAST`);
        break;
      case 'EPISODES_ASC':
        orderBy.push(sql`${media.episodes_total} ASC NULLS LAST`);
        break;
      case 'DURATION_DESC':
        orderBy.push(sql`${media.duration} DESC NULLS LAST`);
        break;
      case 'DURATION_ASC':
        orderBy.push(sql`${media.duration} ASC NULLS LAST`);
        break;
      case 'LATEST_EPISODE_DESC':
        orderBy.push(sql`${mediaLatestAiringEpisode.airing_at} DESC NULLS LAST`);
        break;
      case 'LATEST_EPISODE_ASC':
        orderBy.push(sql`${mediaLatestAiringEpisode.airing_at} ASC NULLS LAST`);
        break;
      case 'NEXT_EPISODE_DESC':
        orderBy.push(sql`${mediaNextAiringEpisode.airing_at} DESC NULLS LAST`);
        break;
      case 'NEXT_EPISODE_ASC':
        orderBy.push(sql`${mediaNextAiringEpisode.airing_at} ASC NULLS LAST`);
        break;
      case 'LAST_EPISODE_DESC':
        orderBy.push(sql`${mediaLastAiringEpisode.airing_at} DESC NULLS LAST`);
        break;
      case 'LAST_EPISODE_ASC':
        orderBy.push(sql`${mediaLastAiringEpisode.airing_at} ASC NULLS LAST`);
        break;
      case 'SEASON_YEAR_DESC':
        orderBy.push(sql`${media.season_year} DESC NULLS LAST`);
        break;
      case 'SEASON_YEAR_ASC':
        orderBy.push(sql`${media.season_year} ASC NULLS LAST`);
        break;
      case 'FORMAT_ASC':
        orderBy.push(sql`${media.format} ASC NULLS LAST`);
        break;
      case 'FORMAT_DESC':
        orderBy.push(sql`${media.format} DESC NULLS LAST`);
        break;
      case 'TYPE_ASC':
        orderBy.push(sql`${media.type} ASC NULLS LAST`);
        break;
      case 'TYPE_DESC':
        orderBy.push(sql`${media.type} DESC NULLS LAST`);
        break;
      case 'STATUS_ASC':
        orderBy.push(sql`${media.status} ASC NULLS LAST`);
        break;
      case 'STATUS_DESC':
        orderBy.push(sql`${media.status} DESC NULLS LAST`);
        break;
      case 'VIEWS_TOTAL_DESC':
        orderBy.push(sql`${media.views_total} DESC NULLS LAST`);
        break;
      case 'VIEWS_TOTAL_ASC':
        orderBy.push(sql`${media.views_total} ASC NULLS LAST`);
        break;
      case 'VIEWS_HOUR_DESC':
        orderBy.push(sql`${media.views_hour} DESC NULLS LAST`);
        break;
      case 'VIEWS_HOUR_ASC':
        orderBy.push(sql`${media.views_hour} ASC NULLS LAST`);
        break;
      case 'VIEWS_TODAY_DESC':
        orderBy.push(sql`${media.views_today} DESC NULLS LAST`);
        break;
      case 'VIEWS_TODAY_ASC':
        orderBy.push(sql`${media.views_today} ASC NULLS LAST`);
        break;
      case 'VIEWS_WEEK_DESC':
        orderBy.push(sql`${media.views_week} DESC NULLS LAST`);
        break;
      case 'VIEWS_WEEK_ASC':
        orderBy.push(sql`${media.views_week} ASC NULLS LAST`);
        break;
      case 'VIEWS_MONTH_DESC':
        orderBy.push(sql`${media.views_month} DESC NULLS LAST`);
        break;
      case 'VIEWS_MONTH_ASC':
        orderBy.push(sql`${media.views_month} ASC NULLS LAST`);
        break;
      case 'SEARCH_DESC':
        if (embedding) {
          orderBy.push(sql`${mediaEmbedding.embedding} <=> ${JSON.stringify(embedding)}::vector ASC NULLS LAST`);
        } else {
          orderBy.push(asc(media.id));
        }
        break;
      case 'SEARCH_ASC':
        if (embedding) {
          orderBy.push(sql`${mediaEmbedding.embedding} <=> ${JSON.stringify(embedding)}::vector DESC NULLS LAST`);
        } else {
          orderBy.push(asc(media.id));
        }
        break;
    }
  });

  return {
    where: conditions.length ? and(...conditions) : undefined,
    orderBy,
    take: per_page,
    skip,
    page
  };
};

const getMediaPage = async (args: MediaArgs) => {
  const { where, orderBy, skip, take, page } = await filterMedia(args);

  const query = db
    .select({
      media: media,
      total: sql<number>`count(*) OVER()`
    })
    .from(media)
    .leftJoin(mediaTitle, eq(mediaTitle.media_id, media.id))
    .leftJoin(mediaStartDate, eq(mediaStartDate.media_id, media.id))
    .leftJoin(mediaEndDate, eq(mediaEndDate.media_id, media.id))
    .leftJoin(mediaLatestAiringEpisode, eq(mediaLatestAiringEpisode.media_id, media.id))
    .leftJoin(mediaNextAiringEpisode, eq(mediaNextAiringEpisode.media_id, media.id))
    .leftJoin(mediaLastAiringEpisode, eq(mediaLastAiringEpisode.media_id, media.id))
    .leftJoin(mediaEmbedding, eq(mediaEmbedding.media_id, media.id))
    .$dynamic();

  if (where) query.where(where);
  if (orderBy.length) query.orderBy(...orderBy);

  const data = await query.limit(take).offset(skip);

  const total = data[0]?.total || 0;
  const last_page = Math.ceil(total / take);

  return {
    data: data.map((d) => d.media),
    page_info: {
      total,
      per_page: take,
      current_page: page,
      last_page,
      has_next_page: page < last_page
    }
  };
};

export const resolvers = {
  Query: {
    media: async (_: any, { id }: { id: number }) => {
      const release = await db.query.media.findFirst({
        where: { id }
      });

      if (release) {
        return release;
      }

      return null;
    },

    media_page: async (_: any, args: MediaArgs) => {
      return getMediaPage(args);
    },

    genres: async () => {
      return db.select().from(mediaGenre).orderBy(asc(mediaGenre.name));
    },

    tags: async (_: any, args: { search?: string; category?: string; is_adult?: boolean }) => {
      const conditions: SQL[] = [];

      if (args.search) {
        conditions.push(
          or(
            sql`lower(${mediaTag.name}) like ${`%${args.search.toLowerCase()}%`}`,
            sql`lower(${mediaTag.description}) like ${`%${args.search.toLowerCase()}%`}`
          )!
        );
      }
      if (args.category) conditions.push(eq(mediaTag.category, args.category));
      if (args.is_adult !== undefined) conditions.push(eq(mediaTag.is_adult, args.is_adult));

      return db
        .select()
        .from(mediaTag)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(asc(mediaTag.name));
    },

    studios: async (_: any, args: { search?: string }) => {
      const where = args.search
        ? sql`lower(${mediaStudio.name}) like ${`%${args.search.toLowerCase()}%`}`
        : undefined;

      return db.select().from(mediaStudio).where(where).orderBy(asc(mediaStudio.name)).limit(50);
    }
  },

  Media: {
    poster: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.poster.load(parent.id);
    },

    title: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.title.load(parent.id);
    },

    start_date: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.startDate.load(parent.id);
    },

    end_date: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.endDate.load(parent.id);
    },

    broadcast: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.broadcast.load(parent.id);
    },

    age_rating: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.ageRating.load(parent.id);
    },

    genres: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.genres.load(parent.id);
    },

    airing_schedule: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.airingSchedule.load(parent.id);
    },

    latest_airing_episode: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.latestAiringEpisode.load(parent.id);
    },

    next_airing_episode: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.nextAiringEpisode.load(parent.id);
    },

    last_airing_episode: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.lastAiringEpisode.load(parent.id);
    },

    characters: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterConnections.load(parent.id);
    },

    studios: async (parent: any, args: { only_main?: boolean }, { loaders }: { loaders: Loaders }) => {
      return loaders.studioConnections
        .load(parent.id)
        .then((sl) => sl.filter((s) => !args.only_main || s.is_main));
    },

    tags: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.tagConnections.load(parent.id);
    },

    score_distribution: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.scoreDistribution.load(parent.id);
    },

    status_distribution: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.statusDistribution.load(parent.id);
    },

    local_score_distribution: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.localScoreDistribution.load(parent.id);
    },

    local_status_distribution: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.localStatusDistribution.load(parent.id);
    },

    links: async (parent: any, args: LinkArgs, { loaders }: { loaders: Loaders }) => {
      const ll = await loaders.links.load(parent.id);

      return ll.filter(
        (l) =>
          (!args.type || l.type === args.type) &&
          (!args.label || l.label?.toLowerCase().includes(args.label!.toLowerCase()))
      );
    },

    alt_titles: async (parent: any, args: AltTitleArgs, { loaders }: { loaders: Loaders }) => {
      const tl = await loaders.altTitles.load(parent.id);

      return tl.filter(
        (t) => (!args.source || t.source === args.source) && (!args.language || t.language == args.language)
      );
    },

    alt_descriptions: async (parent: any, args: AltDescriptionArgs, { loaders }: { loaders: Loaders }) => {
      const dl = await loaders.altDescriptions.load(parent.id);

      return dl.filter(
        (d) => (!args.source || d.source === args.source) && (!args.language || d.language == args.language)
      );
    },

    images: async (parent: any, args: ImageArgs, { loaders }: { loaders: Loaders }) => {
      const il = await loaders.images.load(parent.id);

      return il
        .filter((i) => (!args.source || i.source === args.source) && (!args.type || i.type === args.type))
        .sort((a, b) => a.created_at! - b.created_at!)
        .filter((i, index, self) => index === self.findIndex((t) => t.source === i.source && t.type === i.type));
    },

    videos: async (parent: any, args: VideoArgs, { loaders }: { loaders: Loaders }) => {
      const vl = await loaders.videos.load(parent.id);

      return vl.filter((v) => (!args.source || v.source === args.source) && (!args.type || v.type === args.type));
    },

    screenshots: async (parent: any, args: ScreenshotArgs, { loaders }: { loaders: Loaders }) => {
      const sl = await loaders.screenshots.load(parent.id);

      return sl.filter(
        (s) =>
          (!args.source || s.source === args.source) &&
          (args.order_greater === undefined || s.order >= args.order_greater!) &&
          (args.order_lesser === undefined || s.order <= args.order_lesser!)
      );
    },

    artworks: async (parent: any, args: ArtworksArgs, { loaders }: { loaders: Loaders }) => {
      const al = await loaders.artworks.load(parent.id);

      return al.filter(
        (a) =>
          (!args.iso_639_1 || a.iso_639_1 === args.iso_639_1) &&
          (!args.source || a.source === args.source) &&
          (!args.type || a.type === args.type) &&
          (!args.include_adult || a.is_adult === false)
      );
    },

    translations: async (parent: any, args: TranslationsArgs, { loaders }: { loaders: Loaders }) => {
      const tl = await loaders.translations.load(parent.id);

      return tl.filter(
        (t) => (!args.iso_639_1 || t.iso_639_1 === args.iso_639_1) && (!args.source || t.source === args.source)
      );
    },

    chronology: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.chronology.load(parent.id);
    },

    recommendations: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.recommendations.load(parent.id);
    },

    recommendations_ai: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.recommendations_ai.load(parent.id);
    },

    connected: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      if (!parent.franchise) {
        return [];
      }

      return loaders.connected.load(parent.franchise);
    },

    relations: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.relations.load(parent.id);
    },

    episodes: async (parent: any, args: EpisodeArgs, { loaders }: { loaders: Loaders }) => {
      const el = await loaders.episodes.load(parent.id);

      return el.filter(
        (e) =>
          (args.number_greater === undefined || e.number >= args.number_greater!) &&
          (args.number_lesser === undefined || e.number <= args.number_lesser!) &&
          (!args.air_date_greater ||
            (e.air_date && new Date(e.air_date).getTime() >= new Date(args.air_date_greater).getTime())) &&
          (!args.air_date_lesser ||
            (e.air_date && new Date(e.air_date).getTime() <= new Date(args.air_date_lesser).getTime()))
      );
    }
  },

  CharacterConnection: {
    character: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.character.load(parent.character_id);
    },
    voice_actors: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceActors.load(parent.id);
    }
  },

  StudioConnection: {
    studio: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.studio.load(parent.studio_id);
    }
  },

  TagConnection: {
    tag: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.tag.load(parent.tag_id);
    }
  },

  MediaCharacter: {
    date_of_birth: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterBirthDate.load(parent.id);
    },
    name: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterName.load(parent.id);
    },
    image: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterImage.load(parent.id);
    }
  },

  VoiceActor: {
    date_of_birth: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceBirthDate.load(parent.id);
    },
    date_of_death: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceDeathDate.load(parent.id);
    },
    name: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceName.load(parent.id);
    },
    image: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceImage.load(parent.id);
    }
  },

  MediaRelation: {
    media: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.mediaInfo.load(parent.related_id);
    }
  },

  Episode: {
    image: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.episodeImage.load(parent.id);
    }
  }
};
