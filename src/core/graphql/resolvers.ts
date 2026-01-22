import { Anime, Crysoline, Episode, Tmdb, TmdbSeasons, TmdbUtils } from '../anime';
import {
  AnimeArgs,
  ArtworksArgs,
  CharacterArgs,
  ChronologyArgs,
  EpisodeArgs,
  formatEpisodeData,
  MergedEpisode,
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
  animeAiringSchedule,
  animeCharacter,
  animeCharacterName,
  animeCharacterImage,
  animeCharacterEdge,
  characterToVoiceActor,
  animeVoiceActor,
  animeVoiceName,
  animeVoiceImage,
  animeStudio,
  animeStudioEdge,
  animeTag,
  animeTagEdge,
  animeExternalLink,
  animeScoreDistribution,
  animeStatusDistribution,
  meta,
  metaMapping,
  metaToTitle,
  metaToDescription,
  metaToImage,
  metaToVideo,
  metaToScreenshot,
  metaToArtwork,
  metaChronology,
  metaTitle,
  metaDescription,
  metaImage,
  metaVideo,
  metaScreenshot,
  metaArtwork
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
  arrayContains,
  exists,
  notInArray,
  not,
  isNotNull,
  isNull
} from 'drizzle-orm';

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
    country_of_origin,
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
        or(
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
          ),
          arrayContains(anime.synonyms, [token])
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
  if (country_of_origin) conditions.push(eq(anime.country_of_origin, country_of_origin));

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
          .from(animeTagEdge)
          .innerJoin(animeTag, eq(animeTag.id, animeTagEdge.tag_id))
          .where(and(eq(animeTagEdge.anime_id, anime.id), eq(animeTag.name, tags)))
      )
    );
  }

  if (tags_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeTagEdge)
          .innerJoin(animeTag, eq(animeTag.id, animeTagEdge.tag_id))
          .where(and(eq(animeTagEdge.anime_id, anime.id), inArray(animeTag.name, tags_in)))
      )
    );
  }

  if (tags_not_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeTagEdge)
          .innerJoin(animeTag, eq(animeTag.id, animeTagEdge.tag_id))
          .where(and(eq(animeTagEdge.anime_id, anime.id), notInArray(animeTag.name, tags_not_in)))
      )
    );
  }

  // Studio filters
  if (studios) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeStudioEdge)
          .innerJoin(animeStudio, eq(animeStudio.id, animeStudioEdge.studio_id))
          .where(and(eq(animeStudioEdge.anime_id, anime.id), eq(animeStudio.name, studios)))
      )
    );
  }

  if (studios_in?.length) {
    conditions.push(
      exists(
        db
          .select()
          .from(animeStudioEdge)
          .innerJoin(animeStudio, eq(animeStudio.id, animeStudioEdge.studio_id))
          .where(and(eq(animeStudioEdge.anime_id, anime.id), inArray(animeStudio.name, studios_in)))
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
  if (episodes_greater !== undefined) conditions.push(gte(anime.episodes, episodes_greater));
  if (episodes_lesser !== undefined) conditions.push(lte(anime.episodes, episodes_lesser));

  // Duration filters
  if (duration_greater !== undefined) conditions.push(gte(anime.duration, duration_greater));
  if (duration_lesser !== undefined) conditions.push(lte(anime.duration, duration_lesser));

  // Date filters
  if (start_date_greater) {
    const parts = start_date_greater.split('-').map(Number);
    conditions.push(
      or(
        gt(sql`${animeStartDate.year}`, parts[0]),
        and(eq(animeStartDate.year, parts[0]!), parts[1] ? gte(animeStartDate.month, parts[1]) : sql`true`)
      )!
    );
  }
  if (start_date_lesser) {
    const parts = start_date_lesser.split('-').map(Number);
    conditions.push(
      or(
        lt(sql`${animeStartDate.year}`, parts[0]),
        and(eq(animeStartDate.year, parts[0]!), parts[1] ? lte(animeStartDate.month, parts[1]) : sql`true`)
      )!
    );
  }
  if (start_date_like) {
    const parts = start_date_like.split('-').map(Number);
    const dateConds = [eq(animeStartDate.year, parts[0]!)];
    if (parts[1]) dateConds.push(eq(animeStartDate.month, parts[1]));
    if (parts[2]) dateConds.push(eq(animeStartDate.day, parts[2]));
    conditions.push(and(...dateConds)!);
  }

  if (end_date_greater) {
    const parts = end_date_greater.split('-').map(Number);
    conditions.push(
      or(
        gt(sql`${animeEndDate.year}`, parts[0]),
        and(eq(animeEndDate.year, parts[0]!), parts[1] ? gte(animeEndDate.month, parts[1]) : sql`true`)
      )!
    );
  }
  if (end_date_lesser) {
    const parts = end_date_lesser.split('-').map(Number);
    conditions.push(
      or(
        lt(sql`${animeEndDate.year}`, parts[0]),
        and(eq(animeEndDate.year, parts[0]!), parts[1] ? lte(animeEndDate.month, parts[1]) : sql`true`)
      )!
    );
  }
  if (end_date_like) {
    const parts = end_date_like.split('-').map(Number);
    const dateConds = [eq(animeEndDate.year, parts[0]!)];
    if (parts[1]) dateConds.push(eq(animeEndDate.month, parts[1]));
    if (parts[2]) dateConds.push(eq(animeEndDate.day, parts[2]));
    conditions.push(and(...dateConds)!);
  }

  if (franchise) {
    conditions.push(
      exists(
        db
          .select()
          .from(meta)
          .where(and(eq(meta.anime_id, anime.id), eq(meta.franchise, franchise)))
      )
    );
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
        orderBy.push(sql`${anime.episodes} DESC NULLS LAST`);
        break;
      case 'EPISODES_ASC':
        orderBy.push(sql`${anime.episodes} ASC NULLS LAST`);
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

export const resolvers = {
  Query: {
    anime: async (_: any, { id }: { id: number }) => {
      const release = await db.query.anime.findFirst({
        where: {
          id
        }
      });

      if (release) {
        return release;
      }

      return Anime.fetchOrCreate(id);
    },

    animes: async (_: any, args: AnimeArgs) => {
      const { where, orderBy, skip, take, page } = filterAnime(args);

      const query = db.select().from(anime).$dynamic();

      if (where) {
        query.where(where);
      }

      if (orderBy.length) {
        query.orderBy(...orderBy);
      }

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
        data,
        page_info: {
          total,
          per_page: take,
          current_page: page,
          last_page,
          has_next_page: page < last_page
        }
      };
    },

    character: async (_: any, { id }: { id: number }) => {
      return await db.query.animeCharacter.findFirst({
        where: {
          id
        },
        with: {
          name: true,
          image: true
        }
      });
    },

    studio: async (_: any, { id }: { id: number }) => {
      return await db.query.animeStudio.findFirst({
        where: {
          id
        }
      });
    },

    tag: async (_: any, { id }: { id: number }) => {
      return await db.query.animeTag.findFirst({
        where: {
          id
        }
      });
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

      if (!episode) {
        return null;
      }

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
        translation: translations,
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
        .from(metaChronology)
        .where(eq(metaChronology.meta_id, args.parent_id))
        .orderBy(asc(metaChronology.order));

      const animeIds = chronologyEntries.map((c) => c.related_id);

      if (animeIds.length === 0) return [];

      args.id_mal_in = animeIds;

      const { where, orderBy, skip, take, page } = filterAnime(args);

      const query = db.select().from(anime).$dynamic();

      if (where) {
        query.where(where);
      }

      if (orderBy.length) {
        query.orderBy(...orderBy);
      }

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
        data,
        page_info: {
          total,
          per_page: take,
          current_page: page,
          last_page,
          has_next_page: page < last_page
        }
      };
    },

    sources: async (_: any, args: SourcesArgs) => {
      const sources = await Crysoline.sources(args.id, args.ep_id);

      if (!sources) {
        return null;
      }

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
    poster: async (parent: any) => {
      return await db.query.animePoster.findFirst({
        where: {
          anime_id: parent.id
        }
      });
    },

    title: async (parent: any) => {
      return await db.query.animeTitle.findFirst({
        where: {
          anime_id: parent.id
        }
      });
    },

    start_date: async (parent: any) => {
      return await db.query.animeStartDate.findFirst({
        where: {
          anime_id: parent.id
        }
      });
    },

    end_date: async (parent: any) => {
      return await db.query.animeEndDate.findFirst({
        where: {
          anime_id: parent.id
        }
      });
    },

    genres: async (parent: any) => {
      const result = await db
        .select({ genre: animeGenre })
        .from(animeToGenre)
        .innerJoin(animeGenre, eq(animeToGenre.B, animeGenre.id))
        .where(eq(animeToGenre.A, parent.id));

      return result.map((r) => r.genre);
    },

    characters: async (parent: any, args: CharacterArgs) => {
      const { page = 1, per_page = 25 } = args;
      const skip = (page - 1) * per_page;

      const [edges, totalResult] = await Promise.all([
        db
          .select({
            edge: animeCharacterEdge,
            character: animeCharacter,
            characterName: animeCharacterName,
            characterImage: animeCharacterImage
          })
          .from(animeCharacterEdge)
          .innerJoin(animeCharacter, eq(animeCharacterEdge.character_id, animeCharacter.id))
          .leftJoin(animeCharacterName, eq(animeCharacter.id, animeCharacterName.character_id))
          .leftJoin(animeCharacterImage, eq(animeCharacter.id, animeCharacterImage.character_id))
          .where(eq(animeCharacterEdge.anime_id, parent.id))
          .limit(per_page)
          .offset(skip),
        db.select({ count: count() }).from(animeCharacterEdge).where(eq(animeCharacterEdge.anime_id, parent.id))
      ]);

      const total = totalResult[0]?.count || 0;

      const edgesWithVoiceActors = await Promise.all(
        edges.map(async (e) => {
          const voiceActorResults = await db
            .select({
              voiceActor: animeVoiceActor,
              voiceName: animeVoiceName,
              voiceImage: animeVoiceImage
            })
            .from(characterToVoiceActor)
            .innerJoin(animeVoiceActor, eq(characterToVoiceActor.B, animeVoiceActor.id))
            .leftJoin(animeVoiceName, eq(animeVoiceActor.id, animeVoiceName.voice_actor_id))
            .leftJoin(animeVoiceImage, eq(animeVoiceActor.id, animeVoiceImage.voice_actor_id))
            .where(eq(characterToVoiceActor.A, e.edge.id));

          return {
            ...e.edge,
            character: {
              ...e.character,
              name: e.characterName,
              image: e.characterImage
            },
            voice_actors: voiceActorResults.map((v) => ({
              ...v.voiceActor,
              name: v.voiceName,
              image: v.voiceImage
            }))
          };
        })
      );

      const last_page = Math.ceil(total / per_page);

      return {
        edges: edgesWithVoiceActors,
        page_info: {
          total,
          per_page,
          current_page: page,
          last_page,
          has_next_page: page < last_page
        }
      };
    },

    studios: async (parent: any, args: { only_main?: boolean }) => {
      const conditions = [eq(animeStudioEdge.anime_id, parent.id)];
      if (args.only_main) {
        conditions.push(eq(animeStudioEdge.is_main, true));
      }

      const result = await db
        .select({
          edge: animeStudioEdge,
          studio: animeStudio
        })
        .from(animeStudioEdge)
        .innerJoin(animeStudio, eq(animeStudioEdge.studio_id, animeStudio.id))
        .where(and(...conditions));

      return result.map((r) => ({ ...r.edge, studio: r.studio }));
    },

    tags: async (parent: any) => {
      const result = await db
        .select({
          edge: animeTagEdge,
          tag: animeTag
        })
        .from(animeTagEdge)
        .innerJoin(animeTag, eq(animeTagEdge.tag_id, animeTag.id))
        .where(eq(animeTagEdge.anime_id, parent.id));

      return result.map((r) => ({ ...r.edge, tag: r.tag }));
    },

    external_links: async (parent: any) => {
      return await db.select().from(animeExternalLink).where(eq(animeExternalLink.anime_id, parent.id));
    },

    score_distribution: async (parent: any) => {
      return await db.select().from(animeScoreDistribution).where(eq(animeScoreDistribution.anime_id, parent.id));
    },

    status_distribution: async (parent: any) => {
      return await db
        .select()
        .from(animeStatusDistribution)
        .where(eq(animeStatusDistribution.anime_id, parent.id));
    },

    airing_schedule: async (parent: any) => {
      return await db.select().from(animeAiringSchedule).where(eq(animeAiringSchedule.anime_id, parent.id));
    },

    meta: async (parent: any) => {
      return await db.query.meta.findFirst({
        where: {
          id: parent.id
        }
      });
    }
  },

  CharacterEdge: {
    character: (parent: any) => parent.character,
    voice_actors: (parent: any) => parent.voice_actors
  },

  StudioEdge: {
    studio: (parent: any) => parent.studio
  },

  TagEdge: {
    tag: (parent: any) => parent.tag
  },

  AnimeCharacter: {
    name: (parent: any) => parent.name || null,
    image: (parent: any) => parent.image || null
  },

  VoiceActor: {
    name: (parent: any) => parent.name || null,
    image: (parent: any) => parent.image || null
  },

  Meta: {
    titles: async (parent: any) => {
      const result = await db
        .select({ title: metaTitle })
        .from(metaToTitle)
        .innerJoin(metaTitle, eq(metaToTitle.B, metaTitle.id))
        .where(eq(metaToTitle.A, parent.id));

      return result.map((r) => r.title);
    },

    descriptions: async (parent: any) => {
      const result = await db
        .select({ description: metaDescription })
        .from(metaToDescription)
        .innerJoin(metaDescription, eq(metaToDescription.B, metaDescription.id))
        .where(eq(metaToDescription.A, parent.id));

      return result.map((r) => r.description);
    },

    images: async (parent: any) => {
      const result = await db
        .select({ image: metaImage })
        .from(metaToImage)
        .innerJoin(metaImage, eq(metaToImage.B, metaImage.id))
        .where(eq(metaToImage.A, parent.id));

      return result.map((r) => r.image);
    },

    mappings: async (parent: any) => {
      return await db.select().from(metaMapping).where(eq(metaMapping.meta_id, parent.id));
    },

    episodes: async (parent: any) => {
      const providerEpisodes = await Crysoline.episodes(parent.id).catch(() => []);

      const tmdbEpisodes = await TmdbSeasons.getEpisodes(parent.id).catch(() => []);

      const tmdbEpisodesFormatted: MergedEpisode[] = tmdbEpisodes.map((e) => ({
        ...formatEpisodeData(e),
        is_filler: false,
        providers: []
      }));

      const providerMap = new Map<number, Episode>();
      for (const ep of providerEpisodes) {
        if (ep.number !== null && ep.number !== undefined) {
          providerMap.set(ep.number, ep);
        }
      }

      const merged: MergedEpisode[] = tmdbEpisodesFormatted.map((tmdbEp) => {
        const providerEp = providerMap.get(tmdbEp.number);

        if (providerEp) {
          providerMap.delete(tmdbEp.number);
        }

        return {
          number: tmdbEp.number,
          title: tmdbEp.title ?? providerEp?.title ?? null,
          overview: tmdbEp.overview ?? providerEp?.description ?? null,
          image: tmdbEp.image ?? providerEp?.image ?? null,
          runtime: tmdbEp.runtime ?? null,
          air_date: tmdbEp.air_date ?? null,
          is_filler: providerEp?.is_filler ?? false,
          providers: providerEp?.providers ?? []
        };
      });

      for (const [_, providerEp] of providerMap) {
        merged.push({
          number: providerEp.number!,
          title: providerEp.title ?? null,
          overview: providerEp.description ?? null,
          image: providerEp.image ?? null,
          runtime: null,
          air_date: null,
          is_filler: providerEp?.is_filler ?? false,
          providers: providerEp.providers
        });
      }

      return merged.sort((a, b) => a.number - b.number);
    },

    videos: async (parent: any) => {
      const result = await db
        .select({ video: metaVideo })
        .from(metaToVideo)
        .innerJoin(metaVideo, eq(metaToVideo.B, metaVideo.id))
        .where(eq(metaToVideo.A, parent.id));

      return result.map((r) => r.video);
    },

    screenshots: async (parent: any) => {
      const result = await db
        .select({ screenshot: metaScreenshot })
        .from(metaToScreenshot)
        .innerJoin(metaScreenshot, eq(metaToScreenshot.B, metaScreenshot.id))
        .where(eq(metaToScreenshot.A, parent.id));

      return result.map((r) => r.screenshot);
    },

    artworks: async (parent: any, args: ArtworksArgs) => {
      const { page, per_page, iso_639_1 } = args;

      const conditions = [eq(metaToArtwork.A, parent.id)];
      if (iso_639_1) {
        conditions.push(eq(metaArtwork.iso_639_1, iso_639_1));
      }

      const query = db
        .select({ artwork: metaArtwork })
        .from(metaToArtwork)
        .innerJoin(metaArtwork, eq(metaToArtwork.B, metaArtwork.id))
        .where(and(...conditions))
        .$dynamic();

      if (page && per_page) {
        query.limit(per_page).offset((page - 1) * per_page);
      }

      const result = await query;
      return result.map((r) => r.artwork);
    },

    chronology: async (parent: any) => {
      const chronologyEntries = await db
        .select()
        .from(metaChronology)
        .where(eq(metaChronology.meta_id, parent.id))
        .orderBy(asc(metaChronology.order));

      const animeIds = chronologyEntries.map((c) => c.related_id);

      if (animeIds.length === 0) return [];

      return await db.select().from(anime).where(inArray(anime.id_mal, animeIds));
    }
  },

  Episode: {
    image: (parent: any) => parent.image || null
  }
};
