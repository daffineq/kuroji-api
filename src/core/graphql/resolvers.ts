import prisma from 'src/lib/prisma';
import type { Prisma } from '.prisma/client';
import anime from '../anime/anime';

interface AnimeFilters {
  page?: number;
  perPage?: number;
  search?: string;
  season?: string;
  seasonYear?: number;
  seasonYearGreater?: number;
  seasonYearLesser?: number;
  format?: string;
  formatIn?: string[];
  formatNotIn?: string[];
  status?: string;
  statusIn?: string[];
  statusNotIn?: string[];
  type?: string;
  source?: string;
  sourceIn?: string[];
  countryOfOrigin?: string;
  isLicensed?: boolean;
  isAdult?: boolean;
  genres?: string[];
  genresIn?: string[];
  genresNotIn?: string[];
  tags?: string[];
  tagsIn?: string[];
  tagsNotIn?: string[];
  minimumTagRank?: number;
  studios?: string[];
  studiosIn?: string[];
  scoreGreater?: number;
  scoreLesser?: number;
  popularityGreater?: number;
  popularityLesser?: number;
  episodesGreater?: number;
  episodesLesser?: number;
  durationGreater?: number;
  durationLesser?: number;
  startDateGreater?: string;
  startDateLesser?: string;
  endDateGreater?: string;
  endDateLesser?: string;
  startDateLike?: string;
  endDateLike?: string;
  hasNextEpisode?: boolean;
  franchise?: string;
  sort?: string[];
}

interface CharacterArgs {
  page?: number;
  perPage?: number;
}

export const resolvers = {
  Query: {
    anime: async (_: any, { id }: { id: number }) => {
      const include: Prisma.AnimeInclude = {
        title: true,
        poster: true,
        startDate: true,
        endDate: true,
        genres: true,
        latestAiringEpisode: true,
        nextAiringEpisode: true,
        lastAiringEpisode: true,
        airingSchedule: true,
        characters: {
          include: {
            character: {
              include: {
                name: true,
                image: true
              }
            },
            voiceActors: {
              include: {
                name: true,
                image: true
              }
            }
          }
        },
        studios: {
          include: {
            studio: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        rankings: true,
        externalLinks: true,
        scoreDistribution: true,
        statusDistribution: true,
        meta: {
          include: {
            titles: true,
            descriptions: true,
            images: true,
            mappings: true,
            episodes: {
              include: {
                thumbnail: true
              }
            },
            videos: true,
            screenshots: true,
            artworks: true
          }
        }
      };

      const release = await prisma.anime.findUnique({
        where: { id },
        include
      });

      if (release) {
        return release;
      }

      return anime.fetchOrCreate(id, { include });
    },

    animeByMalId: async (_: any, { malId }: { malId: number }) => {
      return await prisma.anime.findUnique({
        where: { idMal: malId },
        include: {
          title: true,
          poster: true,
          startDate: true,
          endDate: true,
          genres: true,
          latestAiringEpisode: true,
          nextAiringEpisode: true,
          lastAiringEpisode: true,
          airingSchedule: true,
          characters: {
            include: {
              character: {
                include: {
                  name: true,
                  image: true
                }
              },
              voiceActors: {
                include: {
                  name: true,
                  image: true
                }
              }
            }
          },
          studios: {
            include: {
              studio: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          rankings: true,
          externalLinks: true,
          scoreDistribution: true,
          statusDistribution: true,
          meta: {
            include: {
              titles: true,
              descriptions: true,
              images: true,
              mappings: true,
              episodes: {
                include: {
                  thumbnail: true
                }
              },
              videos: true,
              screenshots: true,
              artworks: true
            }
          }
        }
      });
    },

    animes: async (_: any, args: AnimeFilters) => {
      const {
        page = 1,
        perPage = 20,
        search,
        season,
        seasonYear,
        seasonYearGreater,
        seasonYearLesser,
        format,
        formatIn,
        formatNotIn,
        status,
        statusIn,
        statusNotIn,
        type,
        source,
        sourceIn,
        countryOfOrigin,
        isLicensed,
        isAdult,
        genres,
        genresIn,
        genresNotIn,
        tags,
        tagsIn,
        tagsNotIn,
        minimumTagRank,
        studios,
        studiosIn,
        scoreGreater,
        scoreLesser,
        popularityGreater,
        popularityLesser,
        episodesGreater,
        episodesLesser,
        durationGreater,
        durationLesser,
        startDateGreater,
        startDateLesser,
        endDateGreater,
        endDateLesser,
        startDateLike,
        endDateLike,
        hasNextEpisode,
        franchise,
        sort = ['ID_DESC']
      } = args;

      function normalizeSearch(input: string) {
        return input
          .trim()
          .split(/\s+/)
          .map((token) => token.replace(/[^\p{L}\p{N}]+/gu, ''))
          .filter((x) => x.length > 0)
          .join(' | ');
      }

      const skip = (page - 1) * perPage;
      const where: Prisma.AnimeWhereInput = {};

      if (search) {
        const normalized = normalizeSearch(search);

        const searchConditions: any[] = [];

        searchConditions.push(
          { title: { romaji: { search: normalized } } },
          { title: { english: { search: normalized } } },
          { title: { native: { search: normalized } } },
          { meta: { titles: { some: { title: { search: normalized } } } } },
          { tags: { some: { tag: { name: { search: normalized } } } } },
          { synonyms: { has: search } }
        );

        where.OR = searchConditions;
      }

      // Season filters
      if (season) where.season = season;
      if (seasonYear) where.seasonYear = seasonYear;
      if (seasonYearGreater) {
        where.seasonYear = { ...(where.seasonYear as any), gte: seasonYearGreater };
      }
      if (seasonYearLesser) {
        where.seasonYear = { ...(where.seasonYear as any), lte: seasonYearLesser };
      }

      // Format filters
      if (format) where.format = format;
      if (formatIn && formatIn.length > 0) {
        where.format = { in: formatIn };
      }
      if (formatNotIn && formatNotIn.length > 0) {
        where.format = { ...(where.format as any), notIn: formatNotIn };
      }

      // Status filters
      if (status) where.status = status;
      if (statusIn && statusIn.length > 0) {
        where.status = { in: statusIn };
      }
      if (statusNotIn && statusNotIn.length > 0) {
        where.status = { ...(where.status as any), notIn: statusNotIn };
      }

      // Type and source filters
      if (type) where.type = type;
      if (source) where.source = source;
      if (sourceIn && sourceIn.length > 0) {
        where.source = { in: sourceIn };
      }
      if (countryOfOrigin) where.countryOfOrigin = countryOfOrigin;

      // Boolean filters
      if (isLicensed !== undefined) where.isLicensed = isLicensed;
      if (isAdult !== undefined) where.isAdult = isAdult;
      if (hasNextEpisode !== undefined) {
        if (hasNextEpisode) {
          where.nextAiringEpisode = { isNot: null };
        } else {
          where.nextAiringEpisode = null;
        }
      }

      // Genre filters
      if (genres && genres.length > 0) {
        where.genres = {
          some: { name: { in: genres } }
        };
      }
      if (genresIn && genresIn.length > 0) {
        where.genres = {
          some: { name: { in: genresIn } }
        };
      }
      if (genresNotIn && genresNotIn.length > 0) {
        where.genres = {
          none: { name: { in: genresNotIn } }
        };
      }

      // Tag filters
      if (tags && tags.length > 0) {
        where.tags = {
          some: {
            tag: { name: { in: tags } },
            ...(minimumTagRank ? { rank: { gte: minimumTagRank } } : {})
          }
        };
      }
      if (tagsIn && tagsIn.length > 0) {
        where.tags = {
          some: {
            tag: { name: { in: tagsIn } },
            ...(minimumTagRank ? { rank: { gte: minimumTagRank } } : {})
          }
        };
      }
      if (tagsNotIn && tagsNotIn.length > 0) {
        where.tags = {
          ...(where.tags as any),
          none: {
            tag: { name: { in: tagsNotIn } }
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
      if (studiosIn && studiosIn.length > 0) {
        where.studios = {
          some: {
            studio: { name: { in: studiosIn } }
          }
        };
      }

      // Score filters
      if (scoreGreater !== undefined) {
        where.score = { gte: scoreGreater };
      }
      if (scoreLesser !== undefined) {
        where.score = { ...(where.score as any), lte: scoreLesser };
      }

      // Popularity filters
      if (popularityGreater !== undefined) {
        where.popularity = { gte: popularityGreater };
      }
      if (popularityLesser !== undefined) {
        where.popularity = { ...(where.popularity as any), lte: popularityLesser };
      }

      // Episode filters
      if (episodesGreater !== undefined) {
        where.episodes = { gte: episodesGreater };
      }
      if (episodesLesser !== undefined) {
        where.episodes = { ...(where.episodes as any), lte: episodesLesser };
      }

      // Duration filters
      if (durationGreater !== undefined) {
        where.duration = { gte: durationGreater };
      }
      if (durationLesser !== undefined) {
        where.duration = { ...(where.duration as any), lte: durationLesser };
      }

      // Date filters (format: YYYY, YYYY-MM, or YYYY-MM-DD)
      if (startDateGreater) {
        const parts = startDateGreater.split('-').map(Number);
        where.startDate = {
          OR: [
            { year: { gt: parts[0] } },
            {
              AND: [{ year: parts[0] }, parts[1] ? { month: { gte: parts[1] } } : {}]
            }
          ]
        };
      }
      if (startDateLesser) {
        const parts = startDateLesser.split('-').map(Number);
        where.startDate = {
          ...(where.startDate as any),
          OR: [
            { year: { lt: parts[0] } },
            {
              AND: [{ year: parts[0] }, parts[1] ? { month: { lte: parts[1] } } : {}]
            }
          ]
        };
      }
      if (startDateLike) {
        const parts = startDateLike.split('-').map(Number);
        where.startDate = {
          year: parts[0],
          ...(parts[1] ? { month: parts[1] } : {}),
          ...(parts[2] ? { day: parts[2] } : {})
        };
      }

      if (endDateGreater) {
        const parts = endDateGreater.split('-').map(Number);
        where.endDate = {
          OR: [
            { year: { gt: parts[0] } },
            {
              AND: [{ year: parts[0] }, parts[1] ? { month: { gte: parts[1] } } : {}]
            }
          ]
        };
      }
      if (endDateLesser) {
        const parts = endDateLesser.split('-').map(Number);
        where.endDate = {
          ...(where.endDate as any),
          OR: [
            { year: { lt: parts[0] } },
            {
              AND: [{ year: parts[0] }, parts[1] ? { month: { lte: parts[1] } } : {}]
            }
          ]
        };
      }
      if (endDateLike) {
        const parts = endDateLike.split('-').map(Number);
        where.endDate = {
          year: parts[0],
          ...(parts[1] ? { month: parts[1] } : {}),
          ...(parts[2] ? { day: parts[2] } : {})
        };
      }

      if (franchise) {
        where.meta = {
          franchise: { equals: franchise }
        };
      }

      const orderBy: Prisma.AnimeOrderByWithRelationInput[] = [];

      sort.forEach((s) => {
        switch (s) {
          case 'ID_DESC':
            orderBy.push({ id: 'desc' });
            break;
          case 'ID_ASC':
            orderBy.push({ id: 'asc' });
            break;
          case 'TITLE_ROMAJI':
            orderBy.push({ title: { romaji: 'asc' } });
            break;
          case 'TITLE_ENGLISH':
            orderBy.push({ title: { english: 'asc' } });
            break;
          case 'SCORE_DESC':
            orderBy.push({ score: 'desc' });
            break;
          case 'POPULARITY_DESC':
            orderBy.push({ popularity: 'desc' });
            break;
          case 'TRENDING_DESC':
            orderBy.push({ trending: 'desc' });
            break;
          case 'FAVORITES_DESC':
            orderBy.push({ favorites: 'desc' });
            break;
          case 'UPDATED_AT_DESC':
            orderBy.push({ updatedAt: 'desc' });
            break;
          case 'START_DATE_DESC':
            orderBy.push({ startDate: { year: 'desc' } });
            break;
          case 'END_DATE_DESC':
            orderBy.push({ endDate: { year: 'desc' } });
            break;
        }
      });

      const [data, total] = await Promise.all([
        prisma.anime.findMany({
          where,
          orderBy,
          skip,
          take: perPage,
          include: {
            title: true,
            poster: true,
            startDate: true,
            endDate: true,
            genres: true
          }
        }),
        prisma.anime.count({ where })
      ]);

      const lastPage = Math.ceil(total / perPage);

      return {
        data,
        pageInfo: {
          total,
          perPage,
          currentPage: page,
          lastPage,
          hasNextPage: page < lastPage
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

    tags: async (_: any, args: { search?: string; category?: string; isAdult?: boolean }) => {
      const where: Prisma.AnimeTagWhereInput = {};

      if (args.search) {
        where.OR = [
          { name: { contains: args.search, mode: 'insensitive' } },
          { description: { contains: args.search, mode: 'insensitive' } }
        ];
      }
      if (args.category) where.category = args.category;
      if (args.isAdult !== undefined) where.isAdult = args.isAdult;

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
    }
  },

  Anime: {
    startDate: (parent: any) => parent.startDate || null,
    endDate: (parent: any) => parent.endDate || null,

    characters: async (parent: any, args: CharacterArgs) => {
      const { page = 1, perPage = 25 } = args;
      const skip = (page - 1) * perPage;

      const [edges, total] = await Promise.all([
        prisma.animeCharacterEdge.findMany({
          where: { animeId: parent.id },
          skip,
          take: perPage,
          include: {
            character: {
              include: {
                name: true,
                image: true
              }
            },
            voiceActors: {
              include: {
                name: true,
                image: true
              }
            }
          }
        }),
        prisma.animeCharacterEdge.count({
          where: { animeId: parent.id }
        })
      ]);

      const lastPage = Math.ceil(total / perPage);

      return {
        edges,
        pageInfo: {
          total,
          perPage,
          currentPage: page,
          lastPage,
          hasNextPage: page < lastPage
        }
      };
    },

    studios: async (parent: any, args: { onlyMain?: boolean }) => {
      const where: any = { animeId: parent.id };

      if (args.onlyMain) {
        where.isMain = true;
      }

      return await prisma.animeStudioEdge.findMany({
        where,
        include: {
          studio: true
        }
      });
    },

    tags: async (parent: any) => {
      return await prisma.animeTagEdge.findMany({
        where: { animeId: parent.id },
        include: {
          tag: true
        }
      });
    },

    rankings: async (parent: any) => {
      return await prisma.animeRanking.findMany({
        where: { animeId: parent.id }
      });
    },

    externalLinks: async (parent: any) => {
      return await prisma.animeExternalLink.findMany({
        where: { animeId: parent.id }
      });
    },

    scoreDistribution: async (parent: any) => {
      return await prisma.animeScoreDistribution.findMany({
        where: { animeId: parent.id }
      });
    },

    statusDistribution: async (parent: any) => {
      return await prisma.animeStatusDistribution.findMany({
        where: { animeId: parent.id }
      });
    },

    airingSchedule: async (parent: any) => {
      return await prisma.animeAiringSchedule.findMany({
        where: { animeId: parent.id }
      });
    },

    latestAiringEpisode: async (parent: any) => {
      return await prisma.animeLatestEpisode.findUnique({
        where: { animeId: parent.id }
      });
    },

    nextAiringEpisode: async (parent: any) => {
      return await prisma.animeNextEpisode.findUnique({
        where: { animeId: parent.id }
      });
    },

    lastAiringEpisode: async (parent: any) => {
      return await prisma.animeLastEpisode.findUnique({
        where: { animeId: parent.id }
      });
    },

    meta: async (parent: any) => {
      return await prisma.meta.findUnique({
        where: { id: parent.id },
        include: {
          titles: true,
          descriptions: true,
          images: true,
          mappings: true,
          episodes: {
            include: {
              thumbnail: true
            }
          },
          videos: true,
          screenshots: true,
          artworks: true
        }
      });
    }
  },

  CharacterEdge: {
    character: (parent: any) => parent.character,
    voiceActors: (parent: any) => parent.voiceActors
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
    episodes: async (parent: any) => {
      return await prisma.episode.findMany({
        where: {
          parent: {
            some: {
              id: parent.id
            }
          }
        },
        include: {
          thumbnail: true
        }
      });
    }
  },

  Episode: {
    thumbnail: (parent: any) => parent.thumbnail || null
  }
};
