import { Anime, Crysoline, Tmdb, TmdbSeasons, TmdbUtils } from '../anime';
import {
  AnimeArgs,
  ArtworksArgs,
  CharacterArgs,
  ChronologyArgs,
  EpisodeArgs,
  formatEpisodeData,
  LinkArgs,
  RecommendationArgs,
  SourceArgs,
  SourcesArgs
} from './types';
import {
  db,
  anime,
  animeTitle,
  animeStartDate,
  animeEndDate,
  animeGenre,
  animeToGenre,
  animeToCharacter,
  animeStudio,
  animeToStudio,
  animeTag,
  animeToTag,
  animeChronology,
  animeRecommendation
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
  count,
  SQL,
  ilike,
  exists,
  notInArray,
  not,
  isNotNull,
  isNull
} from 'drizzle-orm';
import { Loaders } from './loaders';

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
    genres,
    genres_in,
    genres_not_in,
    tags,
    tags_in,
    tags_not_in,
    studios,
    studios_in,
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
    has_next_episode,
    franchise,
    sort = ['ID_DESC']
  } = args;

  const skip = (page - 1) * per_page;
  const conditions: SQL[] = [];

  // Search
  if (search) {
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

    if (tokens.length > 0) {
      const searchConditions = tokens.map((token) =>
        exists(
          db
            .select()
            .from(animeTitle)
            .where(
              and(
                eq(animeTitle.anime_id, anime.id),
                or(
                  ilike(animeTitle.romaji, `%${token}%`),
                  ilike(animeTitle.english, `%${token}%`),
                  ilike(animeTitle.native, `%${token}%`)
                )
              )
            )
        )
      );
      conditions.push(and(...searchConditions)!);
    }
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

  // Type and source filters
  if (type) conditions.push(eq(anime.type, type));
  if (source) conditions.push(eq(anime.source, source));
  if (source_in?.length) conditions.push(inArray(anime.source, source_in));
  if (country) conditions.push(eq(anime.country, country));

  // Boolean filters
  if (is_licensed !== undefined) conditions.push(eq(anime.is_licensed, is_licensed));
  if (is_adult !== undefined) conditions.push(eq(anime.is_adult, is_adult));
  if (has_next_episode !== undefined) {
    if (has_next_episode) {
      conditions.push(isNotNull(anime.next_airing_episode));
    } else {
      conditions.push(isNull(anime.next_airing_episode));
    }
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
      exists(
        db
          .select()
          .from(animeToGenre)
          .innerJoin(animeGenre, eq(animeGenre.id, animeToGenre.B))
          .where(and(eq(animeToGenre.A, anime.id), notInArray(animeGenre.name, genres_not_in)))
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
      exists(
        db
          .select()
          .from(animeToTag)
          .innerJoin(animeTag, eq(animeTag.id, animeToTag.tag_id))
          .where(and(eq(animeToTag.anime_id, anime.id), notInArray(animeTag.name, tags_not_in)))
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
          .where(and(eq(animeToStudio.anime_id, anime.id), eq(animeStudio.name, studios)))
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
          .where(and(eq(animeToStudio.anime_id, anime.id), inArray(animeStudio.name, studios_in)))
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
        orderBy.push(sql`${anime.latest_airing_episode} DESC NULLS LAST`);
        break;
      case 'LATEST_EPISODE_ASC':
        orderBy.push(sql`${anime.latest_airing_episode} ASC NULLS LAST`);
        break;
      case 'NEXT_EPISODE_DESC':
        orderBy.push(sql`${anime.next_airing_episode} DESC NULLS LAST`);
        break;
      case 'NEXT_EPISODE_ASC':
        orderBy.push(sql`${anime.next_airing_episode} ASC NULLS LAST`);
        break;
      case 'LAST_EPISODE_DESC':
        orderBy.push(sql`${anime.last_airing_episode} DESC NULLS LAST`);
        break;
      case 'LAST_EPISODE_ASC':
        orderBy.push(sql`${anime.last_airing_episode} ASC NULLS LAST`);
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
    .select()
    .from(anime)
    .leftJoin(animeTitle, eq(animeTitle.anime_id, anime.id))
    .leftJoin(animeStartDate, eq(animeStartDate.anime_id, anime.id))
    .leftJoin(animeEndDate, eq(animeEndDate.anime_id, anime.id))
    .$dynamic();

  if (where) query.where(where);
  if (orderBy.length) query.orderBy(...orderBy);

  const [data, totalResult] = await Promise.all([
    query.limit(take).offset(skip),
    db
      .select({ count: count() })
      .from(anime)
      .where(where || sql`true`)
  ]);

  const total = totalResult[0]?.count || 0;
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

      return Anime.fetchOrCreate(id);
    },

    animes: async (_: any, args: AnimeArgs) => {
      return getAnimePage(args);
    },

    character: async (_: any, { id }: { id: number }) => {
      return await db.query.animeCharacter.findFirst({
        where: { id },
        with: { name: true, image: true }
      });
    },

    studio: async (_: any, { id }: { id: number }) => {
      return await db.query.animeStudio.findFirst({ where: { id } });
    },

    tag: async (_: any, { id }: { id: number }) => {
      return await db.query.animeTag.findFirst({ where: { id } });
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
    },

    episode_info: async (_: any, args: EpisodeArgs) => {
      const [tmdbEpisodes, providerEpisodes] = await Promise.all([
        TmdbSeasons.getEpisodes(args.id).catch(() => []),
        Crysoline.episodes(args.id).catch(() => [])
      ]);

      const episode = tmdbEpisodes.find((e) => e.episode_number === args.number);

      if (!episode) return null;

      const providerEp = providerEpisodes.find((e) => e.number === args.number);

      const [translations, images] = await Promise.all([
        Tmdb.getEpisodeTranslations(episode?.show_id, episode?.season_number, episode?.episode_number),
        Tmdb.getEpisodeImages(episode?.show_id, episode?.season_number, episode?.episode_number)
      ]);

      const formattedImages = images.map((i) => ({
        height: i.height,
        width: i.width,
        iso_639_1: i.iso_639_1 ?? '',
        image: {
          small: TmdbUtils.getImage('w500', i.file_path),
          medium: TmdbUtils.getImage('w780', i.file_path),
          large: TmdbUtils.getImage('original', i.file_path)
        }
      }));

      const baseData = formatEpisodeData(episode);

      return {
        images: formattedImages,
        translations: translations,
        number: baseData.number,
        title: baseData.title ?? providerEp?.title ?? null,
        overview: baseData.overview ?? providerEp?.description ?? null,
        image: baseData.image ?? providerEp?.image ?? null,
        runtime: baseData.runtime ?? null,
        air_date: baseData.air_date ?? null,
        is_filler: providerEp?.is_filler ?? false,
        providers: providerEp?.providers ?? []
      };
    },

    chronology: async (_: any, args: ChronologyArgs) => {
      const chronologyEntries = await db
        .select()
        .from(animeChronology)
        .where(eq(animeChronology.parent_id, args.parent_id))
        .orderBy(asc(animeChronology.order));

      const animeIds = chronologyEntries.map((c) => c.related_id);

      if (animeIds.length === 0)
        return {
          data: [],
          page_info: {
            total: 0,
            per_page: args.per_page ?? 20,
            current_page: 1,
            last_page: 1,
            has_next_page: false
          }
        };

      args.id_mal_in = animeIds;

      return getAnimePage(args);
    },

    recommendations: async (_: any, args: RecommendationArgs) => {
      const recommendationEntries = await db
        .select()
        .from(animeRecommendation)
        .where(eq(animeRecommendation.parent_id, args.parent_id))
        .orderBy(asc(animeRecommendation.order));

      const animeIds = recommendationEntries.map((c) => c.related_id);

      if (animeIds.length === 0)
        return {
          data: [],
          page_info: {
            total: 0,
            per_page: args.per_page ?? 20,
            current_page: 1,
            last_page: 1,
            has_next_page: false
          }
        };

      args.id_in = animeIds;

      return getAnimePage(args);
    },

    characters: async (_: any, args: CharacterArgs) => {
      const { page = 1, per_page = 25, parent_id } = args;
      const skip = (page - 1) * per_page;

      const [connections, totalResult] = await Promise.all([
        db
          .select()
          .from(animeToCharacter)
          .where(eq(animeToCharacter.anime_id, parent_id))
          .orderBy(asc(animeToCharacter.role), asc(animeToCharacter.character_id))
          .limit(per_page)
          .offset(skip),
        db.select({ count: count() }).from(animeToCharacter).where(eq(animeToCharacter.anime_id, parent_id))
      ]);

      const total = totalResult[0]?.count || 0;

      const last_page = Math.ceil(total / per_page);

      return {
        connections,
        page_info: { total, per_page, current_page: page, last_page, has_next_page: page < last_page }
      };
    },

    sources: async (_: any, args: SourcesArgs) => {
      const sources = await Crysoline.sources(args.id, args.ep_id);

      if (!sources) return null;

      return {
        ...sources,
        headers: sources.headers
          ? Object.entries(sources.headers).map(([key, value]) => ({
              key,
              value: value != null ? String(value) : null
            }))
          : []
      };
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

    genres: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.genres.load(parent.id);
    },

    airing_schedule: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.airingSchedule.load(parent.id);
    },

    characters: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterConnections.load(parent.id);
    },

    studios: async (parent: any, args: { only_main?: boolean }, { loaders }: { loaders: Loaders }) => {
      return loaders.studioConnections
        .load(parent.id)
        .then((s) => (args.only_main ? s.filter((s: any) => s.is_main) : s));
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
      return loaders.links.load(parent.id).then((ll) => (args.type ? ll.filter((l) => l.type === args.type) : ll));
    },

    other_titles: async (parent: any, args: SourceArgs, { loaders }: { loaders: Loaders }) => {
      return loaders.otherTitles
        .load(parent.id)
        .then((tl) => (args.source ? tl.filter((t) => t.source === args.source) : tl));
    },

    other_descriptions: async (parent: any, args: SourceArgs, { loaders }: { loaders: Loaders }) => {
      return loaders.otherDescriptions
        .load(parent.id)
        .then((dl) => (args.source ? dl.filter((d) => d.source === args.source) : dl));
    },

    images: async (parent: any, args: SourceArgs, { loaders }: { loaders: Loaders }) => {
      return loaders.images
        .load(parent.id)
        .then((il) => (args.source ? il.filter((i) => i.source === args.source) : il));
    },

    videos: async (parent: any, args: SourceArgs, { loaders }: { loaders: Loaders }) => {
      return loaders.videos
        .load(parent.id)
        .then((vl) => (args.source ? vl.filter((v) => v.source === args.source) : vl));
    },

    screenshots: async (parent: any, args: SourceArgs, { loaders }: { loaders: Loaders }) => {
      return loaders.screenshots
        .load(parent.id)
        .then((sl) => (args.source ? sl.filter((s) => s.source === args.source) : sl));
    },

    artworks: async (parent: any, args: ArtworksArgs, { loaders }: { loaders: Loaders }) => {
      return loaders.artworks.load(parent.id).then((al) => {
        let filtered = al;

        if (args.iso_639_1) filtered.filter((a) => a.iso_639_1 === args.iso_639_1);

        if (args.source) filtered.filter((a) => a.source === args.source);

        return filtered;
      });
    },

    chronology: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.chronology.load(parent.id);
    },

    recommendations: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.recommendations.load(parent.id);
    },

    episodes: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.episodes.load(parent.id);
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
    name: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterName.load(parent.id);
    },
    image: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.characterImage.load(parent.id);
    }
  },

  VoiceActor: {
    name: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceName.load(parent.id);
    },
    image: async (parent: any, _: any, { loaders }: { loaders: Loaders }) => {
      return loaders.voiceImage.load(parent.id);
    }
  },

  Episode: {
    image: (parent: any) => parent.image || null
  }
};
