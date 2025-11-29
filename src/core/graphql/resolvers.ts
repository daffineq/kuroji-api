import prisma from 'src/lib/prisma';
import type { Prisma } from '@prisma/client';

interface AnimeFilters {
  page?: number;
  perPage?: number;
  search?: string;
  season?: string;
  seasonYear?: number;
  format?: string;
  status?: string;
  genres?: string[];
  isAdult?: boolean;
  sort?: string[];
}

interface CharacterArgs {
  page?: number;
  perPage?: number;
}

export const resolvers = {
  Query: {
    anime: async (_: any, { id }: { id: number }) => {
      return await prisma.anime.findUnique({
        where: { id },
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
          mappings: {
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
        format,
        status,
        genres,
        isAdult,
        sort = ['ID_DESC']
      } = args;

      const skip = (page - 1) * perPage;

      const where: Prisma.AnimeWhereInput = {};

      if (search) {
        where.OR = [
          { title: { romaji: { contains: search, mode: 'insensitive' } } },
          { title: { english: { contains: search, mode: 'insensitive' } } },
          { title: { native: { contains: search, mode: 'insensitive' } } },
          { synonyms: { has: search } }
        ];
      }

      if (season) where.season = season;
      if (seasonYear) where.seasonYear = seasonYear;
      if (format) where.format = format;
      if (status) where.status = status;
      if (isAdult !== undefined) where.isAdult = isAdult;

      if (genres && genres.length > 0) {
        where.genres = {
          some: {
            name: { in: genres }
          }
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

    studios: async (parent: any) => {
      return await prisma.animeStudioEdge.findMany({
        where: { animeId: parent.id },
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

    mappings: async (parent: any) => {
      return await prisma.mappings.findUnique({
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

  Mappings: {
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
