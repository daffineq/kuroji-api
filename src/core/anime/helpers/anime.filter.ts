import { Prisma } from '@prisma/client';
import { FilterDto } from './anime.filter.dto';
import anime from '../anime';
import { MediaSort } from '../providers/anilist/types';

class AnimeFilter {
  async filter<T extends Prisma.AnimeDefaultArgs>(query: FilterDto, args?: T) {
    const where: Prisma.AnimeWhereInput = {};
    const orderBy: Prisma.AnimeOrderByWithRelationInput[] = [];

    // Handle sorting
    if (query.sort && query.sort.length > 0) {
      for (const sortField of query.sort) {
        switch (sortField) {
          case MediaSort.ID:
            orderBy.push({ id: 'asc' });
            break;
          case MediaSort.ID_DESC:
            orderBy.push({ id: 'desc' });
            break;
          case MediaSort.TITLE_ROMAJI:
            orderBy.push({ title: { romaji: 'asc' } });
            break;
          case MediaSort.TITLE_ROMAJI_DESC:
            orderBy.push({ title: { romaji: 'desc' } });
            break;
          case MediaSort.TITLE_ENGLISH:
            orderBy.push({ title: { english: 'asc' } });
            break;
          case MediaSort.TITLE_ENGLISH_DESC:
            orderBy.push({ title: { english: 'desc' } });
            break;
          case MediaSort.TITLE_NATIVE:
            orderBy.push({ title: { native: 'asc' } });
            break;
          case MediaSort.TITLE_NATIVE_DESC:
            orderBy.push({ title: { native: 'desc' } });
            break;
          case MediaSort.TYPE:
            orderBy.push({ type: 'asc' });
            break;
          case MediaSort.TYPE_DESC:
            orderBy.push({ type: 'desc' });
            break;
          case MediaSort.FORMAT:
            orderBy.push({ format: 'asc' });
            break;
          case MediaSort.FORMAT_DESC:
            orderBy.push({ format: 'desc' });
            break;
          case MediaSort.START_DATE:
            orderBy.push({ startDate: { year: 'asc' } });
            break;
          case MediaSort.START_DATE_DESC:
            orderBy.push({ startDate: { year: 'desc' } });
            break;
          case MediaSort.END_DATE:
            orderBy.push({ endDate: { year: 'asc' } });
            break;
          case MediaSort.END_DATE_DESC:
            orderBy.push({ endDate: { year: 'desc' } });
            break;
          case MediaSort.SCORE:
            orderBy.push({ score: 'asc' });
            break;
          case MediaSort.SCORE_DESC:
            orderBy.push({ score: 'desc' });
            break;
          case MediaSort.POPULARITY:
            orderBy.push({ popularity: 'asc' });
            break;
          case MediaSort.POPULARITY_DESC:
            orderBy.push({ popularity: 'desc' });
            break;
          case MediaSort.TRENDING:
            orderBy.push({ trending: 'asc' });
            break;
          case MediaSort.TRENDING_DESC:
            orderBy.push({ trending: 'desc' });
            break;
          case MediaSort.EPISODES:
            orderBy.push({ episodes: 'asc' });
            break;
          case MediaSort.EPISODES_DESC:
            orderBy.push({ episodes: 'desc' });
            break;
          case MediaSort.DURATION:
            orderBy.push({ duration: 'asc' });
            break;
          case MediaSort.DURATION_DESC:
            orderBy.push({ duration: 'desc' });
            break;
          case MediaSort.STATUS:
            orderBy.push({ status: 'asc' });
            break;
          case MediaSort.STATUS_DESC:
            orderBy.push({ status: 'desc' });
            break;
          case MediaSort.UPDATED_AT:
            orderBy.push({ updatedAt: 'asc' });
            break;
          case MediaSort.UPDATED_AT_DESC:
            orderBy.push({ updatedAt: 'desc' });
            break;
          case MediaSort.FAVOURITES:
            orderBy.push({ favorites: 'asc' });
            break;
          case MediaSort.FAVOURITES_DESC:
            orderBy.push({ favorites: 'desc' });
            break;
          case MediaSort.LATEST_EPISODE:
            orderBy.push({ latestAiringEpisode: { airingAt: 'asc' } });
            break;
          case MediaSort.LATEST_EPISODE_DESC:
            orderBy.push({ latestAiringEpisode: { airingAt: 'desc' } });
            break;
          case MediaSort.NEXT_EPISODE:
            orderBy.push({ nextAiringEpisode: { airingAt: 'asc' } });
            break;
          case MediaSort.NEXT_EPISODE_DESC:
            orderBy.push({ nextAiringEpisode: { airingAt: 'desc' } });
            break;
          case MediaSort.LAST_EPISODE:
            orderBy.push({ lastAiringEpisode: { airingAt: 'asc' } });
            break;
          case MediaSort.LAST_EPISODE_DESC:
            orderBy.push({ lastAiringEpisode: { airingAt: 'desc' } });
            break;
        }
      }
    }

    const map: Record<string, (value: any) => void> = {
      // ID filters
      id: (v) => (where.id = v),
      idMal: (v) => (where.idMal = v),
      idNot: (v) => (where.id = { not: v }),
      idMalNot: (v) => (where.idMal = { not: v }),
      idIn: (v) => (where.id = { in: v }),
      idMalIn: (v) => (where.idMal = { in: v }),
      idNotIn: (v) => (where.id = { notIn: v }),
      idMalNotIn: (v) => (where.idMal = { notIn: v }),

      // Format filters
      format: (v) => (where.format = v),
      formatNot: (v) => (where.format = { not: v }),
      formatIn: (v) => (where.format = { in: v }),
      formatNotIn: (v) => (where.format = { notIn: v }),

      // Country filters (maps to countryOfOrigin)
      country: (v) => (where.countryOfOrigin = v),
      countryNot: (v) => (where.countryOfOrigin = { not: v }),
      countryIn: (v) => (where.countryOfOrigin = { in: v }),
      countryNotIn: (v) => (where.countryOfOrigin = { notIn: v }),

      // Type and Status filters
      type: (v) => (where.type = v),
      status: (v) => (where.status = v),
      statusNot: (v) => (where.status = { not: v }),
      statusIn: (v) => (where.status = { in: v }),
      statusNotIn: (v) => (where.status = { notIn: v }),

      // Season filters
      season: (v) => (where.season = v),
      seasonYear: (v) => (where.seasonYear = v),
      seasonYearGreater: (v) => (where.seasonYear = { gt: v }),
      seasonYearLesser: (v) => (where.seasonYear = { lt: v }),

      // Source filters
      sourceIn: (v) => (where.source = { in: v }),

      // Boolean flags
      isAdult: (v) => (where.isAdult = v),
      nsfw: (v) => (where.isAdult = v), // nsfw maps to isAdult for now
      isLicensed: (v) => (where.isLicensed = v),

      // Popularity filters
      popularityGreater: (v) => (where.popularity = { gt: v }),
      popularityLesser: (v) => (where.popularity = { lt: v }),
      popularityNot: (v) => (where.popularity = { not: v }),

      // Score filters
      scoreGreater: (v) => (where.score = { gt: v }),
      scoreLesser: (v) => (where.score = { lt: v }),
      scoreNot: (v) => (where.score = { not: v }),

      // Duration filters
      durationGreater: (v) => (where.duration = { gt: v }),
      durationLesser: (v) => (where.duration = { lt: v }),

      // Episodes filters
      episodesGreater: (v) => (where.episodes = { gt: v }),
      episodesLesser: (v) => (where.episodes = { lt: v }),

      // Genre filters
      genreIn: (v) => (where.genres = { some: { name: { in: v } } }),
      genreNotIn: (v) => (where.NOT = { genres: { some: { name: { in: v } } } }),

      // Tag filters
      tagIn: (v) => (where.tags = { some: { tag: { name: { in: v } } } }),
      tagNotIn: (v) => (where.NOT = { tags: { some: { tag: { name: { in: v } } } } }),
      tagCategoryIn: (v) => (where.tags = { some: { tag: { category: { in: v } } } }),
      tagCategoryNotIn: (v) => (where.NOT = { tags: { some: { tag: { category: { in: v } } } } }),

      // Studio filters
      studioIn: (v) => (where.studios = { some: { studio: { name: { in: v } } } }),

      // Character filters
      characterIn: (v) => (where.characters = { some: { character: { name: { full: { in: v } } } } }),

      // Voice actor filters
      voiceActorIn: (v) => (where.characters = { some: { voiceActors: { some: { name: { full: { in: v } } } } } }),

      // Airing schedule filters
      airingAtGreater: (v) => (where.airingSchedule = { some: { airingAt: { gt: v } } }),
      airingAtLesser: (v) => (where.airingSchedule = { some: { airingAt: { lt: v } } }),

      // Date filters
      startDateGreater: (v) => {
        const date = this.parseDate(v);
        if (date.year) {
          where.startDate = {
            OR: [
              { year: { gt: date.year } },
              {
                AND: [
                  { year: date.year },
                  date.month ? { month: { gt: date.month } } : {},
                  date.month && date.day ? { day: { gt: date.day } } : {}
                ].filter(Boolean)
              }
            ]
          };
        }
      },

      startDateLesser: (v) => {
        const date = this.parseDate(v);
        if (date.year) {
          where.startDate = {
            OR: [
              { year: { lt: date.year } },
              {
                AND: [
                  { year: date.year },
                  date.month ? { month: { lt: date.month } } : {},
                  date.month && date.day ? { day: { lt: date.day } } : {}
                ].filter(Boolean)
              }
            ]
          };
        }
      },

      startDateLike: (v) => {
        const date = this.parseDate(v);
        const conditions: any = {};
        if (date.year) conditions.year = date.year;
        if (date.month) conditions.month = date.month;
        if (date.day) conditions.day = date.day;
        where.startDate = conditions;
      },

      endDateGreater: (v) => {
        const date = this.parseDate(v);
        if (date.year) {
          where.endDate = {
            OR: [
              { year: { gt: date.year } },
              {
                AND: [
                  { year: date.year },
                  date.month ? { month: { gt: date.month } } : {},
                  date.month && date.day ? { day: { gt: date.day } } : {}
                ].filter(Boolean)
              }
            ]
          };
        }
      },

      endDateLesser: (v) => {
        const date = this.parseDate(v);
        if (date.year) {
          where.endDate = {
            OR: [
              { year: { lt: date.year } },
              {
                AND: [
                  { year: date.year },
                  date.month ? { month: { lt: date.month } } : {},
                  date.month && date.day ? { day: { lt: date.day } } : {}
                ].filter(Boolean)
              }
            ]
          };
        }
      },

      endDateLike: (v) => {
        const date = this.parseDate(v);
        const conditions: any = {};
        if (date.year) conditions.year = date.year;
        if (date.month) conditions.month = date.month;
        if (date.day) conditions.day = date.day;
        where.endDate = conditions;
      },

      query: (v) => {
        where.OR = [
          { title: { romaji: { contains: v, mode: 'insensitive' } } },
          { title: { english: { contains: v, mode: 'insensitive' } } },
          { title: { native: { contains: v, mode: 'insensitive' } } },
          { synonyms: { has: v } },
          { description: { contains: v, mode: 'insensitive' } },
          { mappings: { titles: { some: { title: { contains: v, mode: 'insensitive' } } } } }
        ];
      },

      ageRating: (v) => (where.mappings = { rating: { in: v } }),
      franchise: (v) => (where.mappings = { franchise: { equals: v } })
    };

    for (const [key, value] of Object.entries(query)) {
      if (value != null && map[key] && key !== 'perPage' && key !== 'page' && key !== 'sort') {
        map[key](value);
      }
    }

    return anime.many({
      where,
      orderBy: orderBy.length > 0 ? orderBy : [{ score: 'desc' }],
      take: query.perPage,
      skip: query.perPage * (query.page - 1),
      ...args
    });
  }

  private parseDate(dateString: string): { year?: number; month?: number; day?: number } {
    const parts = dateString.split('-');
    const result: { year?: number; month?: number; day?: number } = {};

    if (parts[0]) {
      const year = parseInt(parts[0]);
      if (!isNaN(year)) result.year = year;
    }

    if (parts[1]) {
      const month = parseInt(parts[1]);
      if (!isNaN(month) && month >= 1 && month <= 12) result.month = month;
    }

    if (parts[2]) {
      const day = parseInt(parts[2]);
      if (!isNaN(day) && day >= 1 && day <= 31) result.day = day;
    }

    return result;
  }
}

const animeFilter = new AnimeFilter();

export default animeFilter;
