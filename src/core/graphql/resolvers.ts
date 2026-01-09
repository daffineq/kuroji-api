import { prisma, Prisma } from 'src/lib/prisma';
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

const filterAnime = (
  args: AnimeArgs
): {
  where: Prisma.AnimeWhereInput;
  orderBy: Prisma.AnimeOrderByWithRelationInput[];
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
    minimum_tag_rank,
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
  const where: Prisma.AnimeWhereInput = {};

  if (search) {
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

    if (tokens.length > 0) {
      where.AND = tokens.map((token) => ({
        OR: [
          { title: { romaji: { contains: token, mode: 'insensitive' } } },
          { title: { english: { contains: token, mode: 'insensitive' } } },
          { title: { native: { contains: token, mode: 'insensitive' } } },
          { synonyms: { hasSome: tokens } },
          { meta: { titles: { some: { title: { contains: token, mode: 'insensitive' } } } } }
        ]
      }));
    }
  }

  // ID filters

  if (id) where.id = id;
  if (id_in && id_in.length) where.id = { in: id_in };
  if (id_not) where.id = { ...(where.id as any), not: id_not };
  if (id_not_in && id_not_in.length) where.id = { ...(where.id as any), notIn: id_not_in };

  if (id_mal) where.id_mal = id_mal;
  if (id_mal_in && id_mal_in.length) where.id_mal = { in: id_mal_in };
  if (id_mal_not) where.id_mal = { ...(where.id_mal as any), not: id_mal_not };
  if (id_mal_not_in && id_mal_not_in.length) where.id_mal = { ...(where.id_mal as any), notIn: id_mal_not_in };

  // Season filters
  if (season) where.season = season;
  if (season_year) where.season_year = season_year;
  if (season_year_greater) {
    where.season_year = { ...(where.season_year as any), gte: season_year_greater };
  }
  if (season_year_lesser) {
    where.season_year = { ...(where.season_year as any), lte: season_year_lesser };
  }

  // Format filters
  if (format) where.format = format;
  if (format_in && format_in.length > 0) {
    where.format = { in: format_in };
  }
  if (format_not_in && format_not_in.length > 0) {
    where.format = { ...(where.format as any), notIn: format_not_in };
  }

  // Status filters
  if (status) where.status = status;
  if (status_in && status_in.length > 0) {
    where.status = { in: status_in };
  }
  if (status_not_in && status_not_in.length > 0) {
    where.status = { ...(where.status as any), notIn: status_not_in };
  }

  // Type and source filters
  if (type) where.type = type;
  if (source) where.source = source;
  if (source_in && source_in.length > 0) {
    where.source = { in: source_in };
  }
  if (country_of_origin) where.country_of_origin = country_of_origin;

  // Boolean filters
  if (is_licensed !== undefined) where.is_licensed = is_licensed;
  if (is_adult !== undefined) where.is_adult = is_adult;
  if (has_next_episode !== undefined) {
    if (has_next_episode) {
      where.next_airing_episode = { not: null };
    } else {
      where.next_airing_episode = null;
    }
  }

  // Genre filters
  if (genres && genres.length > 0) {
    where.genres = {
      some: { name: { in: genres } }
    };
  }
  if (genres_in && genres_in.length > 0) {
    where.genres = {
      some: { name: { in: genres_in } }
    };
  }
  if (genres_not_in && genres_not_in.length > 0) {
    where.genres = {
      none: { name: { in: genres_not_in } }
    };
  }

  // Tag filters
  if (tags && tags.length > 0) {
    where.tags = {
      some: {
        tag: { name: { in: tags } },
        ...(minimum_tag_rank ? { rank: { gte: minimum_tag_rank } } : {})
      }
    };
  }
  if (tags_in && tags_in.length > 0) {
    where.tags = {
      some: {
        tag: { name: { in: tags_in } },
        ...(minimum_tag_rank ? { rank: { gte: minimum_tag_rank } } : {})
      }
    };
  }
  if (tags_not_in && tags_not_in.length > 0) {
    where.tags = {
      ...(where.tags as any),
      none: {
        tag: { name: { in: tags_not_in } }
      }
    };
  }

  // Studio filters
  if (studios && studios.length > 0) {
    where.studios = {
      some: {
        studio: { name: { in: studios } }
      }
    };
  }
  if (studios_in && studios_in.length > 0) {
    where.studios = {
      some: {
        studio: { name: { in: studios_in } }
      }
    };
  }

  // Score filters
  if (score_greater !== undefined) {
    where.score = { gte: score_greater };
  }
  if (score_lesser !== undefined) {
    where.score = { ...(where.score as any), lte: score_lesser };
  }

  // Popularity filters
  if (popularity_greater !== undefined) {
    where.popularity = { gte: popularity_greater };
  }
  if (popularity_lesser !== undefined) {
    where.popularity = { ...(where.popularity as any), lte: popularity_lesser };
  }

  // Episode filters
  if (episodes_greater !== undefined) {
    where.episodes = { gte: episodes_greater };
  }
  if (episodes_lesser !== undefined) {
    where.episodes = { ...(where.episodes as any), lte: episodes_lesser };
  }

  // Duration filters
  if (duration_greater !== undefined) {
    where.duration = { gte: duration_greater };
  }
  if (duration_lesser !== undefined) {
    where.duration = { ...(where.duration as any), lte: duration_lesser };
  }

  // Date filters (format: YYYY, YYYY-MM, or YYYY-MM-DD)
  if (start_date_greater) {
    const parts = start_date_greater.split('-').map(Number);
    where.start_date = {
      OR: [
        { year: { gt: parts[0] } },
        {
          AND: [{ year: parts[0] }, parts[1] ? { month: { gte: parts[1] } } : {}]
        }
      ]
    };
  }
  if (start_date_lesser) {
    const parts = start_date_lesser.split('-').map(Number);
    where.start_date = {
      ...(where.start_date as any),
      OR: [
        { year: { lt: parts[0] } },
        {
          AND: [{ year: parts[0] }, parts[1] ? { month: { lte: parts[1] } } : {}]
        }
      ]
    };
  }
  if (start_date_like) {
    const parts = start_date_like.split('-').map(Number);
    where.start_date = {
      year: parts[0],
      ...(parts[1] ? { month: parts[1] } : {}),
      ...(parts[2] ? { day: parts[2] } : {})
    };
  }

  if (end_date_greater) {
    const parts = end_date_greater.split('-').map(Number);
    where.end_date = {
      OR: [
        { year: { gt: parts[0] } },
        {
          AND: [{ year: parts[0] }, parts[1] ? { month: { gte: parts[1] } } : {}]
        }
      ]
    };
  }
  if (end_date_lesser) {
    const parts = end_date_lesser.split('-').map(Number);
    where.end_date = {
      ...(where.end_date as any),
      OR: [
        { year: { lt: parts[0] } },
        {
          AND: [{ year: parts[0] }, parts[1] ? { month: { lte: parts[1] } } : {}]
        }
      ]
    };
  }
  if (end_date_like) {
    const parts = end_date_like.split('-').map(Number);
    where.end_date = {
      year: parts[0],
      ...(parts[1] ? { month: parts[1] } : {}),
      ...(parts[2] ? { day: parts[2] } : {})
    };
  }

  if (franchise) {
    where.meta = {
      franchise
    };
  }

  const orderBy: Prisma.AnimeOrderByWithRelationInput[] = [];

  sort.forEach((s) => {
    switch (s) {
      // ID Sorting
      case 'ID_DESC':
        orderBy.push({ id: 'desc' });
        break;
      case 'ID_ASC':
        orderBy.push({ id: 'asc' });
        break;

      // Title Sorting
      case 'TITLE_ROMAJI':
        orderBy.push({ title: { romaji: 'asc' } });
        break;
      case 'TITLE_ROMAJI_DESC':
        orderBy.push({ title: { romaji: 'desc' } });
        break;
      case 'TITLE_ENGLISH':
        orderBy.push({ title: { english: 'asc' } });
        break;
      case 'TITLE_ENGLISH_DESC':
        orderBy.push({ title: { english: 'desc' } });
        break;
      case 'TITLE_NATIVE':
        orderBy.push({ title: { native: 'asc' } });
        break;
      case 'TITLE_NATIVE_DESC':
        orderBy.push({ title: { native: 'desc' } });
        break;

      // Score & Stats Sorting
      case 'SCORE_DESC':
        orderBy.push({ score: { sort: 'desc', nulls: 'last' } });
        break;
      case 'SCORE_ASC':
        orderBy.push({ score: { sort: 'asc', nulls: 'last' } });
        break;
      case 'POPULARITY_DESC':
        orderBy.push({ popularity: { sort: 'desc', nulls: 'last' } });
        break;
      case 'POPULARITY_ASC':
        orderBy.push({ popularity: { sort: 'asc', nulls: 'last' } });
        break;
      case 'TRENDING_DESC':
        orderBy.push({ trending: { sort: 'desc', nulls: 'last' } });
        break;
      case 'TRENDING_ASC':
        orderBy.push({ trending: { sort: 'asc', nulls: 'last' } });
        break;
      case 'FAVORITES_DESC':
        orderBy.push({ favorites: { sort: 'desc', nulls: 'last' } });
        break;
      case 'FAVORITES_ASC':
        orderBy.push({ favorites: { sort: 'asc', nulls: 'last' } });
        break;

      // Date Sorting
      case 'START_DATE_DESC':
        orderBy.push({
          start_date: {
            year: { sort: 'desc', nulls: 'last' }
          }
        });
        orderBy.push({
          start_date: {
            month: { sort: 'desc', nulls: 'last' }
          }
        });
        orderBy.push({
          start_date: {
            day: { sort: 'desc', nulls: 'last' }
          }
        });
        break;
      case 'START_DATE_ASC':
        orderBy.push({
          start_date: {
            year: { sort: 'asc', nulls: 'last' }
          }
        });
        orderBy.push({
          start_date: {
            month: { sort: 'asc', nulls: 'last' }
          }
        });
        orderBy.push({
          start_date: {
            day: { sort: 'asc', nulls: 'last' }
          }
        });
        break;
      case 'END_DATE_DESC':
        orderBy.push({
          end_date: {
            year: { sort: 'desc', nulls: 'last' }
          }
        });
        orderBy.push({
          end_date: {
            month: { sort: 'desc', nulls: 'last' }
          }
        });
        orderBy.push({
          end_date: {
            day: { sort: 'desc', nulls: 'last' }
          }
        });
        break;
      case 'END_DATE_ASC':
        orderBy.push({
          end_date: {
            year: { sort: 'asc', nulls: 'last' }
          }
        });
        orderBy.push({
          end_date: {
            month: { sort: 'asc', nulls: 'last' }
          }
        });
        orderBy.push({
          end_date: {
            day: { sort: 'asc', nulls: 'last' }
          }
        });
        break;
      case 'UPDATED_AT_DESC':
        orderBy.push({ updated_at: 'desc' });
        break;
      case 'UPDATED_AT_ASC':
        orderBy.push({ updated_at: 'asc' });
        break;

      // Episode Sorting
      case 'EPISODES_DESC':
        orderBy.push({ episodes: { sort: 'desc', nulls: 'last' } });
        break;
      case 'EPISODES_ASC':
        orderBy.push({ episodes: { sort: 'asc', nulls: 'last' } });
        break;
      case 'DURATION_DESC':
        orderBy.push({ duration: { sort: 'desc', nulls: 'last' } });
        break;
      case 'DURATION_ASC':
        orderBy.push({ duration: { sort: 'asc', nulls: 'last' } });
        break;

      // Latest Episode Sorting
      case 'LATEST_EPISODE_DESC':
        orderBy.push({
          latest_airing_episode: { sort: 'desc', nulls: 'last' }
        });
        break;
      case 'LATEST_EPISODE_ASC':
        orderBy.push({
          latest_airing_episode: { sort: 'asc', nulls: 'last' }
        });
        break;

      // Next Episode Sorting
      case 'NEXT_EPISODE_DESC':
        orderBy.push({
          next_airing_episode: { sort: 'desc', nulls: 'last' }
        });
        break;
      case 'NEXT_EPISODE_ASC':
        orderBy.push({
          next_airing_episode: { sort: 'asc', nulls: 'last' }
        });
        break;

      // Last Episode Sorting
      case 'LAST_EPISODE_DESC':
        orderBy.push({
          last_airing_episode: { sort: 'desc', nulls: 'last' }
        });
        break;
      case 'LAST_EPISODE_ASC':
        orderBy.push({
          last_airing_episode: { sort: 'asc', nulls: 'last' }
        });
        break;

      // Season Sorting
      case 'SEASON_YEAR_DESC':
        orderBy.push({ season_year: { sort: 'desc', nulls: 'last' } });
        break;
      case 'SEASON_YEAR_ASC':
        orderBy.push({ season_year: { sort: 'asc', nulls: 'last' } });
        break;

      // Format & Type Sorting
      case 'FORMAT_ASC':
        orderBy.push({ format: { sort: 'asc', nulls: 'last' } });
        break;
      case 'FORMAT_DESC':
        orderBy.push({ format: { sort: 'desc', nulls: 'last' } });
        break;
      case 'TYPE_ASC':
        orderBy.push({ type: { sort: 'asc', nulls: 'last' } });
        break;
      case 'TYPE_DESC':
        orderBy.push({ type: { sort: 'desc', nulls: 'last' } });
        break;

      // Status Sorting
      case 'STATUS_ASC':
        orderBy.push({ status: { sort: 'asc', nulls: 'last' } });
        break;
      case 'STATUS_DESC':
        orderBy.push({ status: { sort: 'desc', nulls: 'last' } });
        break;
    }
  });

  return {
    where,
    orderBy,
    take: per_page,
    skip,
    page
  };
};

export const resolvers = {
  Query: {
    anime: async (_: any, { id }: { id: number }) => {
      const release = await prisma.anime.findUnique({
        where: { id }
      });

      if (release) {
        return release;
      }

      return Anime.fetchOrCreate(id);
    },

    animes: async (_: any, args: AnimeArgs) => {
      const { where, orderBy, skip, take, page } = filterAnime(args);

      const [data, total] = await Promise.all([
        prisma.anime.findMany({
          where,
          orderBy,
          skip,
          take
        }),
        prisma.anime.count({ where })
      ]);

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
      return await prisma.animeCharacter.findUnique({
        where: { id },
        include: {
          name: true,
          image: true
        }
      });
    },

    studio: async (_: any, { id }: { id: number }) => {
      return await prisma.animeStudio.findUnique({
        where: { id }
      });
    },

    tag: async (_: any, { id }: { id: number }) => {
      return await prisma.animeTag.findUnique({
        where: { id }
      });
    },

    genres: async () => {
      return await prisma.animeGenre.findMany({
        orderBy: { name: 'asc' }
      });
    },

    tags: async (_: any, args: { search?: string; category?: string; is_adult?: boolean }) => {
      const where: Prisma.AnimeTagWhereInput = {};

      if (args.search) {
        where.OR = [
          { name: { contains: args.search, mode: 'insensitive' } },
          { description: { contains: args.search, mode: 'insensitive' } }
        ];
      }
      if (args.category) where.category = args.category;
      if (args.is_adult !== undefined) where.is_adult = args.is_adult;

      return await prisma.animeTag.findMany({
        where,
        orderBy: { name: 'asc' }
      });
    },

    studios: async (_: any, args: { search?: string }) => {
      const where: Prisma.AnimeStudioWhereInput = {};

      if (args.search) {
        where.name = { contains: args.search, mode: 'insensitive' };
      }

      return await prisma.animeStudio.findMany({
        where,
        orderBy: { name: 'asc' },
        take: 50
      });
    },

    episode_info: async (_: any, args: EpisodeArgs) => {
      const [tmdbEpisodes, providerEpisodes] = await Promise.all([
        TmdbSeasons.getEpisodes(args.id),
        Crysoline.episodes(args.id)
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
        providers: providerEp?.providers ?? []
      };
    },

    chronology: async (_: any, args: ChronologyArgs) => {
      const chronologyEntries = await prisma.chronology.findMany({
        where: { meta_id: args.parent_id },
        orderBy: { order: 'asc' }
      });

      const animeIds = chronologyEntries.map((c) => c.related_id);

      if (animeIds.length === 0) return [];

      args.id_mal_in = animeIds;

      const { where, orderBy, skip, take, page } = filterAnime(args);

      const [data, total] = await Promise.all([
        prisma.anime.findMany({
          where,
          orderBy,
          skip,
          take
        }),
        prisma.anime.count({ where })
      ]);

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
      return prisma.animePoster.findUnique({
        where: { anime_id: parent.id }
      });
    },

    title: async (parent: any) => {
      return prisma.animeTitle.findUnique({
        where: { anime_id: parent.id }
      });
    },

    start_date: async (parent: any) => {
      return prisma.animeStartDate.findUnique({
        where: { anime_id: parent.id }
      });
    },

    end_date: async (parent: any) => {
      return prisma.animeEndDate.findUnique({
        where: { anime_id: parent.id }
      });
    },

    genres: async (parent: any) => {
      return prisma.animeGenre.findMany({
        where: { anime: { some: { id: parent.id } } }
      });
    },

    characters: async (parent: any, args: CharacterArgs) => {
      const { page = 1, per_page = 25 } = args;
      const skip = (page - 1) * per_page;

      const [edges, total] = await Promise.all([
        prisma.animeCharacterEdge.findMany({
          where: { anime_id: parent.id },
          skip,
          take: per_page,
          include: {
            character: {
              include: {
                name: true,
                image: true
              }
            },
            voice_actors: {
              include: {
                name: true,
                image: true
              }
            }
          }
        }),
        prisma.animeCharacterEdge.count({
          where: { anime_id: parent.id }
        })
      ]);

      const last_page = Math.ceil(total / per_page);

      return {
        edges,
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
      const where: any = { anime_id: parent.id };

      if (args.only_main) {
        where.is_main = true;
      }

      return prisma.animeStudioEdge.findMany({
        where,
        include: {
          studio: true
        }
      });
    },

    tags: async (parent: any) => {
      return prisma.animeTagEdge.findMany({
        where: { anime_id: parent.id },
        include: {
          tag: true
        }
      });
    },

    external_links: async (parent: any) => {
      return prisma.animeExternalLink.findMany({
        where: { anime_id: parent.id }
      });
    },

    score_distribution: async (parent: any) => {
      return prisma.animeScoreDistribution.findMany({
        where: { anime_id: parent.id }
      });
    },

    status_distribution: async (parent: any) => {
      return prisma.animeStatusDistribution.findMany({
        where: { anime_id: parent.id }
      });
    },

    airing_schedule: async (parent: any) => {
      return prisma.animeAiringSchedule.findMany({
        where: { anime_id: parent.id }
      });
    },

    meta: async (parent: any) => {
      return prisma.meta.findUnique({
        where: { id: parent.id }
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
      return prisma.title.findMany({
        where: {
          parent: {
            some: {
              id: parent.id
            }
          }
        }
      });
    },

    descriptions: async (parent: any) => {
      return prisma.description.findMany({
        where: {
          parent: {
            some: {
              id: parent.id
            }
          }
        }
      });
    },

    images: async (parent: any) => {
      return prisma.image.findMany({
        where: {
          parent: {
            some: {
              id: parent.id
            }
          }
        }
      });
    },

    mappings: async (parent: any) => {
      return prisma.mapping.findMany({
        where: { meta_id: parent.id }
      });
    },

    episodes: async (parent: any) => {
      const providerEpisodes = await Crysoline.episodes(parent.id);

      const tmdbEpisodes = await TmdbSeasons.getEpisodes(parent.id);

      const tmdbEpisodesFormatted: MergedEpisode[] = tmdbEpisodes.map((e) => ({
        ...formatEpisodeData(e),
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
          providers: providerEp.providers
        });
      }

      return merged.sort((a, b) => a.number - b.number);
    },

    videos: async (parent: any) => {
      return prisma.video.findMany({
        where: {
          parent: {
            some: {
              id: parent.id
            }
          }
        }
      });
    },

    screenshots: async (parent: any) => {
      return prisma.screenshot.findMany({
        where: {
          parent: {
            some: {
              id: parent.id
            }
          }
        }
      });
    },

    artworks: async (parent: any, args: ArtworksArgs) => {
      const { page, per_page, iso_639_1 } = args;
      return prisma.artwork.findMany({
        where: {
          parent: { some: { id: parent.id } },
          ...(iso_639_1 ? { iso_639_1 } : {})
        },
        ...(page && per_page
          ? {
              skip: (page - 1) * per_page,
              take: per_page
            }
          : {})
      });
    },

    chronology: async (parent: any) => {
      const chronologyEntries = await prisma.chronology.findMany({
        where: { meta_id: parent.id },
        orderBy: { order: 'asc' }
      });

      const animeIds = chronologyEntries.map((c) => c.related_id);

      if (animeIds.length === 0) return [];

      return prisma.anime.findMany({
        where: {
          id_mal: { in: animeIds }
        }
      });
    }
  },

  Episode: {
    image: (parent: any) => parent.image || null
  }
};
