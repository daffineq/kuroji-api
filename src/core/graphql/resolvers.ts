import {
  AnimeArgs,
  ArtworksArgs,
  EpisodeArgs,
  ImageArgs,
  LinkArgs,
  OtherDescriptionArgs,
  OtherTitleArgs,
  ScreenshotArgs,
  TranslationsArgs,
  VideoArgs
} from './types';
import {
  db,
  anime,
  animeTitle,
  animeStartDate,
  animeEndDate,
  animeGenre,
  animeToGenre,
  animeStudio,
  animeToStudio,
  animeTag,
  animeToTag,
  animeLatestAiringEpisode,
  animeNextAiringEpisode,
  animeLastAiringEpisode,
  animeAiringSchedule,
  animeAgeRating
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

const filterAnime = (
  args: AnimeArgs
): {
  where: SQL | undefined;
  orderBy: SQL[];
  take: number;
  skip: number;
  page: number;
} => {
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
    sort = ['ID_DESC']
  } = args;

  if (per_page > 50) {
    throw new GraphQLError('per_page exceeds the limit of 50', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
  }

  const skip = (page - 1) * per_page;
  const conditions: SQL[] = [];

  // Search
  if (search) {
    conditions.push(
      and(
        exists(
          db
            .select()
            .from(animeTitle)
            .where(
              and(
                eq(animeTitle.anime_id, anime.id),
                sql`${animeTitle.search_vector} @@ plainto_tsquery('english', ${search})`
              )
            )
        )
      )!
    );
  }

  // ID filters
  if (id) conditions.push(eq(anime.id, id));
  if (id_in?.length) conditions.push(inArray(anime.id, id_in));
  if (id_not) conditions.push(not(eq(anime.id, id_not)));
  if (id_not_in?.length) conditions.push(notInArray(anime.id, id_not_in));

  if (id_mal) conditions.push(eq(anime.id_mal, id_mal));
  if (id_mal_in?.length) conditions.push(inArray(anime.id_mal, id_mal_in));
  if (id_mal_not) conditions.push(not(eq(anime.id_mal, id_mal_not)));
  if (id_mal_not_in?.length) conditions.push(notInArray(anime.id_mal, id_mal_not_in));

  // Season filters
  if (season) conditions.push(eq(anime.season, season));
  if (season_year) conditions.push(eq(anime.season_year, season_year));
  if (season_year_greater) conditions.push(gte(anime.season_year, season_year_greater));
  if (season_year_lesser) conditions.push(lte(anime.season_year, season_year_lesser));

  // Format filters
  if (format) conditions.push(eq(anime.format, format));
  if (format_in?.length) conditions.push(inArray(anime.format, format_in));
  if (format_not_in?.length) conditions.push(notInArray(anime.format, format_not_in));

  // Status filters
  if (status) conditions.push(eq(anime.status, status));
  if (status_in?.length) conditions.push(inArray(anime.status, status_in));
  if (status_not_in?.length) conditions.push(notInArray(anime.status, status_not_in));

  // Air week filters
  if (air_week) conditions.push(eq(anime.air_week, air_week));
  if (air_week_in?.length) conditions.push(inArray(anime.air_week, air_week_in));
  if (air_week_not_in?.length) conditions.push(notInArray(anime.air_week, air_week_not_in));

  // Age rating filters
  if (age_rating) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeAgeRating)
          .where(and(eq(animeAgeRating.anime_id, anime.id), eq(animeAgeRating.rating, age_rating)))
      )
    );
  }

  if (age_rating_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeAgeRating)
          .where(and(eq(animeAgeRating.anime_id, anime.id), inArray(animeAgeRating.rating, age_rating_in)))
      )
    );
  }

  if (age_rating_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(animeAgeRating)
            .where(and(eq(animeAgeRating.anime_id, anime.id), inArray(animeAgeRating.rating, age_rating_not_in)))
        )
      )
    );
  }

  // Type and source filters
  if (type) conditions.push(eq(anime.type, type));
  if (source) conditions.push(eq(anime.source, source));
  if (source_in?.length) conditions.push(inArray(anime.source, source_in));
  if (country) conditions.push(eq(anime.country, country));

  // Boolean filters
  if (is_licensed !== undefined) conditions.push(eq(anime.is_licensed, is_licensed));
  if (is_adult !== undefined) conditions.push(eq(anime.is_adult, is_adult));

  // Airing schedule
  if (has_next_episode !== undefined) {
    if (has_next_episode) {
      conditions.push(
        exists(db.select().from(animeNextAiringEpisode).where(eq(animeNextAiringEpisode.anime_id, anime.id)))
      );
    } else {
      conditions.push(
        notExists(db.select().from(animeNextAiringEpisode).where(eq(animeNextAiringEpisode.anime_id, anime.id)))
      );
    }
  }

  if (airing_at_greater !== undefined) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeAiringSchedule)
          .where(
            and(eq(animeAiringSchedule.anime_id, anime.id), gte(animeAiringSchedule.airing_at, airing_at_greater))
          )
      )
    );
  }

  if (airing_at_lesser !== undefined) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeAiringSchedule)
          .where(
            and(eq(animeAiringSchedule.anime_id, anime.id), lte(animeAiringSchedule.airing_at, airing_at_lesser))
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
          .from(animeToGenre)
          .innerJoin(animeGenre, eq(animeGenre.id, animeToGenre.B))
          .where(and(eq(animeToGenre.A, anime.id), eq(animeGenre.name, genres)))
      )
    );
  }

  if (genres_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeToGenre)
          .innerJoin(animeGenre, eq(animeGenre.id, animeToGenre.B))
          .where(and(eq(animeToGenre.A, anime.id), inArray(animeGenre.name, genres_in)))
      )
    );
  }

  if (genres_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(animeToGenre)
            .innerJoin(animeGenre, eq(animeGenre.id, animeToGenre.B))
            .where(and(eq(animeToGenre.A, anime.id), inArray(animeGenre.name, genres_not_in)))
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
          .from(animeToTag)
          .innerJoin(animeTag, eq(animeTag.id, animeToTag.tag_id))
          .where(and(eq(animeToTag.anime_id, anime.id), eq(animeTag.name, tags)))
      )
    );
  }

  if (tags_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeToTag)
          .innerJoin(animeTag, eq(animeTag.id, animeToTag.tag_id))
          .where(and(eq(animeToTag.anime_id, anime.id), inArray(animeTag.name, tags_in)))
      )
    );
  }

  if (tags_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(animeToTag)
            .innerJoin(animeTag, eq(animeTag.id, animeToTag.tag_id))
            .where(and(eq(animeToTag.anime_id, anime.id), inArray(animeTag.name, tags_not_in)))
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
          .from(animeToStudio)
          .innerJoin(animeStudio, eq(animeStudio.id, animeToStudio.studio_id))
          .where(
            and(
              eq(animeToStudio.anime_id, anime.id),
              eq(animeStudio.name, studios),
              studio_is_main !== undefined && studio_is_main !== null
                ? eq(animeToStudio.is_main, studio_is_main)
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
          .select()
          .from(animeToStudio)
          .innerJoin(animeStudio, eq(animeStudio.id, animeToStudio.studio_id))
          .where(
            and(
              eq(animeToStudio.anime_id, anime.id),
              inArray(animeStudio.name, studios_in),
              studio_is_main !== undefined && studio_is_main !== null
                ? eq(animeToStudio.is_main, studio_is_main)
                : undefined
            )
          )
      )
    );
  }

  if (studios_not_in?.length) {
    conditions.push(
      not(
        exists(
          db
            .select()
            .from(animeToStudio)
            .innerJoin(animeStudio, eq(animeStudio.id, animeToStudio.studio_id))
            .where(
              and(
                eq(animeToStudio.anime_id, anime.id),
                inArray(animeStudio.name, studios_not_in),
                studio_is_main !== undefined && studio_is_main !== null
                  ? eq(animeToStudio.is_main, studio_is_main)
                  : undefined
              )
            )
        )
      )
    );
  }

  // Score filters
  if (score_greater !== undefined) conditions.push(gte(anime.score, score_greater));
  if (score_lesser !== undefined) conditions.push(lte(anime.score, score_lesser));

  // Popularity filters
  if (popularity_greater !== undefined) conditions.push(gte(anime.popularity, popularity_greater));
  if (popularity_lesser !== undefined) conditions.push(lte(anime.popularity, popularity_lesser));

  // Episode filters
  if (episodes_greater !== undefined) conditions.push(gte(anime.episodes_total, episodes_greater));
  if (episodes_lesser !== undefined) conditions.push(lte(anime.episodes_total, episodes_lesser));

  // Duration filters
  if (duration_greater !== undefined) conditions.push(gte(anime.duration, duration_greater));
  if (duration_lesser !== undefined) conditions.push(lte(anime.duration, duration_lesser));

  // Date filters
  if (start_date_greater) {
    const [year, month, day] = start_date_greater.split('-').map(Number);

    conditions.push(
      exists(
        db
          .select()
          .from(animeStartDate)
          .where(
            and(
              eq(animeStartDate.anime_id, anime.id),
              or(
                gt(animeStartDate.year, year!),
                and(eq(animeStartDate.year, year!), gt(animeStartDate.month, month!)),
                and(eq(animeStartDate.year, year!), eq(animeStartDate.month, month!), gt(animeStartDate.day, day!))
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
          .from(animeStartDate)
          .where(
            and(
              eq(animeStartDate.anime_id, anime.id),
              or(
                lt(animeStartDate.year, year!),
                and(eq(animeStartDate.year, year!), lt(animeStartDate.month, month!)),
                and(eq(animeStartDate.year, year!), eq(animeStartDate.month, month!), lt(animeStartDate.day, day!))
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
          .from(animeStartDate)
          .where(
            and(
              eq(animeStartDate.anime_id, anime.id),
              eq(animeStartDate.year, year!),
              eq(animeStartDate.month, month!),
              eq(animeStartDate.day, day!)
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
          .from(animeEndDate)
          .where(
            and(
              eq(animeEndDate.anime_id, anime.id),
              or(
                gt(animeEndDate.year, year!),
                and(eq(animeEndDate.year, year!), gt(animeEndDate.month, month!)),
                and(eq(animeEndDate.year, year!), eq(animeEndDate.month, month!), gt(animeEndDate.day, day!))
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
          .from(animeEndDate)
          .where(
            and(
              eq(animeEndDate.anime_id, anime.id),
              or(
                lt(animeEndDate.year, year!),
                and(eq(animeEndDate.year, year!), lt(animeEndDate.month, month!)),
                and(eq(animeEndDate.year, year!), eq(animeEndDate.month, month!), lt(animeEndDate.day, day!))
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
          .from(animeEndDate)
          .where(
            and(
              eq(animeEndDate.anime_id, anime.id),
              eq(animeEndDate.year, year!),
              eq(animeEndDate.month, month!),
              eq(animeEndDate.day, day!)
            )
          )
      )
    );
  }

  if (franchise) {
    conditions.push(eq(anime.franchise, franchise));
  }

  const orderBy: SQL[] = [];

  sort.forEach((s) => {
    switch (s) {
      case 'ID_DESC':
        orderBy.push(desc(anime.id));
        break;
      case 'ID_ASC':
        orderBy.push(asc(anime.id));
        break;
      case 'TITLE_ROMAJI':
        orderBy.push(asc(animeTitle.romaji));
        break;
      case 'TITLE_ROMAJI_DESC':
        orderBy.push(desc(animeTitle.romaji));
        break;
      case 'TITLE_ENGLISH':
        orderBy.push(asc(animeTitle.english));
        break;
      case 'TITLE_ENGLISH_DESC':
        orderBy.push(desc(animeTitle.english));
        break;
      case 'TITLE_NATIVE':
        orderBy.push(asc(animeTitle.native));
        break;
      case 'TITLE_NATIVE_DESC':
        orderBy.push(desc(animeTitle.native));
        break;
      case 'SCORE_DESC':
        orderBy.push(sql`${anime.score} DESC NULLS LAST`);
        break;
      case 'SCORE_ASC':
        orderBy.push(sql`${anime.score} ASC NULLS LAST`);
        break;
      case 'POPULARITY_DESC':
        orderBy.push(sql`${anime.popularity} DESC NULLS LAST`);
        break;
      case 'POPULARITY_ASC':
        orderBy.push(sql`${anime.popularity} ASC NULLS LAST`);
        break;
      case 'TRENDING_DESC':
        orderBy.push(sql`${anime.trending} DESC NULLS LAST`);
        break;
      case 'TRENDING_ASC':
        orderBy.push(sql`${anime.trending} ASC NULLS LAST`);
        break;
      case 'FAVORITES_DESC':
        orderBy.push(sql`${anime.favorites} DESC NULLS LAST`);
        break;
      case 'FAVORITES_ASC':
        orderBy.push(sql`${anime.favorites} ASC NULLS LAST`);
        break;
      case 'START_DATE_DESC':
        orderBy.push(sql`${animeStartDate.year} DESC NULLS LAST`);
        orderBy.push(sql`${animeStartDate.month} DESC NULLS LAST`);
        orderBy.push(sql`${animeStartDate.day} DESC NULLS LAST`);
        break;
      case 'START_DATE_ASC':
        orderBy.push(sql`${animeStartDate.year} ASC NULLS LAST`);
        orderBy.push(sql`${animeStartDate.month} ASC NULLS LAST`);
        orderBy.push(sql`${animeStartDate.day} ASC NULLS LAST`);
        break;
      case 'END_DATE_DESC':
        orderBy.push(sql`${animeEndDate.year} DESC NULLS LAST`);
        orderBy.push(sql`${animeEndDate.month} DESC NULLS LAST`);
        orderBy.push(sql`${animeEndDate.day} DESC NULLS LAST`);
        break;
      case 'END_DATE_ASC':
        orderBy.push(sql`${animeEndDate.year} ASC NULLS LAST`);
        orderBy.push(sql`${animeEndDate.month} ASC NULLS LAST`);
        orderBy.push(sql`${animeEndDate.day} ASC NULLS LAST`);
        break;
      case 'UPDATED_AT_DESC':
        orderBy.push(desc(anime.updated_at));
        break;
      case 'UPDATED_AT_ASC':
        orderBy.push(asc(anime.updated_at));
        break;
      case 'AIR_WEEK_DESC':
        orderBy.push(sql`${anime.air_week} DESC NULLS LAST`);
        break;
      case 'AIR_WEEK_ASC':
        orderBy.push(sql`${anime.air_week} ASC NULLS LAST`);
        break;
      case 'EPISODES_DESC':
        orderBy.push(sql`${anime.episodes_total} DESC NULLS LAST`);
        break;
      case 'EPISODES_ASC':
        orderBy.push(sql`${anime.episodes_total} ASC NULLS LAST`);
        break;
      case 'DURATION_DESC':
        orderBy.push(sql`${anime.duration} DESC NULLS LAST`);
        break;
      case 'DURATION_ASC':
        orderBy.push(sql`${anime.duration} ASC NULLS LAST`);
        break;
      case 'LATEST_EPISODE_DESC':
        orderBy.push(sql`${animeLatestAiringEpisode.airing_at} DESC NULLS LAST`);
        break;
      case 'LATEST_EPISODE_ASC':
        orderBy.push(sql`${animeLatestAiringEpisode.airing_at} ASC NULLS LAST`);
        break;
      case 'NEXT_EPISODE_DESC':
        orderBy.push(sql`${animeNextAiringEpisode.airing_at} DESC NULLS LAST`);
        break;
      case 'NEXT_EPISODE_ASC':
        orderBy.push(sql`${animeNextAiringEpisode.airing_at} ASC NULLS LAST`);
        break;
      case 'LAST_EPISODE_DESC':
        orderBy.push(sql`${animeLastAiringEpisode.airing_at} DESC NULLS LAST`);
        break;
      case 'LAST_EPISODE_ASC':
        orderBy.push(sql`${animeLastAiringEpisode.airing_at} ASC NULLS LAST`);
        break;
      case 'SEASON_YEAR_DESC':
        orderBy.push(sql`${anime.season_year} DESC NULLS LAST`);
        break;
      case 'SEASON_YEAR_ASC':
        orderBy.push(sql`${anime.season_year} ASC NULLS LAST`);
        break;
      case 'FORMAT_ASC':
        orderBy.push(sql`${anime.format} ASC NULLS LAST`);
        break;
      case 'FORMAT_DESC':
        orderBy.push(sql`${anime.format} DESC NULLS LAST`);
        break;
      case 'TYPE_ASC':
        orderBy.push(sql`${anime.type} ASC NULLS LAST`);
        break;
      case 'TYPE_DESC':
        orderBy.push(sql`${anime.type} DESC NULLS LAST`);
        break;
      case 'STATUS_ASC':
        orderBy.push(sql`${anime.status} ASC NULLS LAST`);
        break;
      case 'STATUS_DESC':
        orderBy.push(sql`${anime.status} DESC NULLS LAST`);
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

const getAnimePage = async (args: AnimeArgs) => {
  const { where, orderBy, skip, take, page } = filterAnime(args);

  const query = db
    .select({ anime: anime, total: sql<number>`count(*) OVER()` })
    .from(anime)
    .leftJoin(animeTitle, eq(animeTitle.anime_id, anime.id))
    .leftJoin(animeStartDate, eq(animeStartDate.anime_id, anime.id))
    .leftJoin(animeEndDate, eq(animeEndDate.anime_id, anime.id))
    .leftJoin(animeLatestAiringEpisode, eq(animeLatestAiringEpisode.anime_id, anime.id))
    .leftJoin(animeNextAiringEpisode, eq(animeNextAiringEpisode.anime_id, anime.id))
    .leftJoin(animeLastAiringEpisode, eq(animeLastAiringEpisode.anime_id, anime.id))
    .$dynamic();

  if (where) query.where(where);
  if (orderBy.length) query.orderBy(...orderBy);

  const data = await query.limit(take).offset(skip);

  const total = data[0]?.total || 0;
  const last_page = Math.ceil(total / take);

  return {
    data: data.map((d) => d.anime),
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
    anime: async (_: any, { id }: { id: number }) => {
      const release = await db.query.anime.findFirst({
        where: { id }
      });

      if (release) {
        return release;
      }

      return null;
    },

    animes: async (_: any, args: AnimeArgs) => {
      return getAnimePage(args);
    },

    genres: async () => {
      return await db.select().from(animeGenre).orderBy(asc(animeGenre.name));
    },

    tags: async (_: any, args: { search?: string; category?: string; is_adult?: boolean }) => {
      const conditions: SQL[] = [];

      if (args.search) {
        conditions.push(
          or(
            sql`lower(${animeTag.name}) like ${`%${args.search.toLowerCase()}%`}`,
            sql`lower(${animeTag.description}) like ${`%${args.search.toLowerCase()}%`}`
          )!
        );
      }
      if (args.category) conditions.push(eq(animeTag.category, args.category));
      if (args.is_adult !== undefined) conditions.push(eq(animeTag.is_adult, args.is_adult));

      return await db
        .select()
        .from(animeTag)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(asc(animeTag.name));
    },

    studios: async (_: any, args: { search?: string }) => {
      const where = args.search
        ? sql`lower(${animeStudio.name}) like ${`%${args.search.toLowerCase()}%`}`
        : undefined;

      return await db.select().from(animeStudio).where(where).orderBy(asc(animeStudio.name)).limit(50);
    }
  },

  Anime: {
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

    links: async (parent: any, args: LinkArgs, { loaders }: { loaders: Loaders }) => {
      const ll = await loaders.links.load(parent.id);

      return ll.filter(
        (l) =>
          (!args.type || l.type === args.type) &&
          (!args.label || l.label?.toLowerCase().includes(args.label!.toLowerCase()))
      );
    },

    other_titles: async (parent: any, args: OtherTitleArgs, { loaders }: { loaders: Loaders }) => {
      const tl = await loaders.otherTitles.load(parent.id);

      return tl.filter(
        (t) => (!args.source || t.source === args.source) && (!args.language || t.language == args.language)
      );
    },

    other_descriptions: async (parent: any, args: OtherDescriptionArgs, { loaders }: { loaders: Loaders }) => {
      const dl = await loaders.otherDescriptions.load(parent.id);

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

    connected: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      if (!parent.franchise) {
        return [];
      }

      return loaders.connected.load(parent.franchise);
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

  AnimeCharacter: {
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

  Episode: {
    image: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.episodeImage.load(parent.id);
    }
  }
};
