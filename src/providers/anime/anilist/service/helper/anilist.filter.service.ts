import { Injectable } from '@nestjs/common';
import { AnilistTag, Prisma } from '@prisma/client';
import { FilterDto } from '../../filter/FilterDto.js';
import { PrismaService } from '../../../../../prisma.service.js';
import { firstUpperList, getPageInfo } from '../../../../../utils/utils.js';
import { Language, MediaSort } from '../../filter/Filter.js';
import { NestedSort, SortDirection } from '../../types/types.js';
import { TagFilterDto } from '../../filter/TagFilterDto.js';
import { ApiResponse } from '../../../../../shared/responses.js';

@Injectable()
export class AnilistFilterService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnilistByFilter<T extends Prisma.AnilistSelect>(
    filter: FilterDto,
    select?: T,
  ): Promise<ApiResponse<Prisma.AnilistGetPayload<{ select: T }>[]>> {
    const conditions: any[] = [];

    // ========== Basic Filters ==========
    const basicFields = [
      ['id', filter.id],
      ['idMal', filter.idMal],
      ['type', filter.type],
      ['format', filter.format],
      ['countryOfOrigin', filter.country],
      ['status', filter.status],
      ['season', filter.season],
      ['isAdult', filter.isAdult],
      ['isLicensed', filter.isLicensed],
      ['seasonYear', filter.seasonYear],
    ];
    for (const [key, value] of basicFields) {
      if (value !== undefined) conditions.push({ [key as any]: value });
    }

    if (filter.nsfw === false) {
      conditions.push({
        shikimori: {
          rating: { not: 'rx' },
        },
      });
    }

    if (filter.franchise) {
      conditions.push({
        shikimori: {
          franchise: filter.franchise,
        },
      });
    }

    // ========== Language Filter ==========
    if (filter.language) {
      switch (filter.language) {
        case Language.SUB:
          conditions.push({
            zoro: {
              episodes: {
                every: {
                  isDubbed: false,
                  isSubbed: true,
                },
              },
            },
          });
          break;
        case Language.DUB:
          conditions.push({
            zoro: {
              episodes: {
                some: {
                  isDubbed: true,
                },
              },
            },
          });
          break;
        case Language.BOTH:
          conditions.push({
            zoro: {
              episodes: {
                some: {
                  isDubbed: true,
                  isSubbed: true,
                },
              },
            },
          });
          break;
        case Language.ALL:
          conditions.push({
            zoro: {
              episodes: {
                some: {
                  OR: [{ isDubbed: true }, { isSubbed: true }],
                },
              },
            },
          });
          break;
        case Language.RAW:
          conditions.push({
            zoro: {
              episodes: {
                every: {
                  isDubbed: false,
                  isSubbed: false,
                },
              },
            },
          });
          break;
      }
    }

    // ========== Array Filters ==========
    if (filter.genreIn)
      conditions.push({ genres: { hasEvery: firstUpperList(filter.genreIn) } });
    if (filter.genreNotIn)
      conditions.push({
        genres: { hasNone: firstUpperList(filter.genreNotIn) },
      });
    if (filter.idIn) conditions.push({ id: { in: filter.idIn } });
    if (filter.idNotIn) conditions.push({ id: { notIn: filter.idNotIn } });
    if (filter.idNot != null) conditions.push({ id: { not: filter.idNot } });
    if (filter.idMalIn) conditions.push({ idMal: { in: filter.idMalIn } });
    if (filter.idMalNotIn)
      conditions.push({ idMal: { notIn: filter.idMalNotIn } });
    if (filter.idMalNot != null)
      conditions.push({ idMal: { not: filter.idMalNot } });

    if (filter.studioIn) {
      conditions.push({
        studios: {
          some: {
            studio: {
              name: { in: filter.studioIn },
            },
          },
        },
      });
    }

    if (filter.characterIn) {
      conditions.push({
        characters: {
          some: {
            character: {
              name: {
                full: { in: filter.characterIn },
              },
            },
          },
        },
      });
    }

    if (filter.voiceActorIn) {
      conditions.push({
        characters: {
          some: {
            voiceActors: {
              some: {
                name: {
                  full: { in: filter.voiceActorIn },
                },
              },
            },
          },
        },
      });
    }

    // ========== Numeric Filters ==========
    const numericFields = [
      ['duration', 'gt', filter.durationGreater],
      ['duration', 'lt', filter.durationLesser],
      ['episodes', 'gt', filter.episodesGreater],
      ['episodes', 'lt', filter.episodesLesser],
      ['seasonYear', 'gt', filter.seasonYearGreater],
      ['seasonYear', 'lt', filter.seasonYearLesser],
      ['popularity', 'gt', filter.popularityGreater],
      ['popularity', 'lt', filter.popularityLesser],
      ['popularity', 'not', filter.popularityNot],
      ['score', 'gt', filter.scoreGreater],
      ['score', 'lt', filter.scoreLesser],
      ['score', 'not', filter.scoreNot],
    ];
    for (const [field, op, val] of numericFields) {
      if (val != null)
        conditions.push({ [field as any]: { [op as any]: val } });
    }

    // ========== Enum Filters ==========
    const enumFilters = [
      ['format', 'in', filter.formatIn],
      ['format', 'notIn', filter.formatNotIn],
      ['format', 'not', filter.formatNot],
      ['countryOfOrigin', 'in', filter.countryIn],
      ['countryOfOrigin', 'notIn', filter.countryNotIn],
      ['countryOfOrigin', 'not', filter.countryNot],
      ['status', 'in', filter.statusIn],
      ['status', 'notIn', filter.statusNotIn],
      ['status', 'not', filter.statusNot],
      ['source', 'in', filter.sourceIn],
    ];
    for (const [field, op, val] of enumFilters) {
      if (val) conditions.push({ [field as any]: { [op as any]: val } });
    }

    if (filter.ageRating) {
      conditions.push({
        shikimori: {
          rating: { in: filter.ageRating },
        },
      });
    }

    // ========== Tags Filters ==========
    if (filter.tagIn) {
      conditions.push({
        tags: {
          some: {
            tag: {
              name: { in: filter.tagIn },
            },
          },
        },
      });
    }
    if (filter.tagNotIn) {
      conditions.push({
        NOT: {
          tags: {
            some: {
              tag: {
                name: { in: filter.tagNotIn },
              },
            },
          },
        },
      } as any);
    }
    if (filter.tagCategoryIn) {
      conditions.push({
        tags: {
          some: {
            tag: {
              category: { in: filter.tagCategoryIn },
            },
          },
        },
      });
    }
    if (filter.tagCategoryNotIn) {
      conditions.push({
        NOT: {
          tags: {
            some: {
              tag: {
                category: { in: filter.tagCategoryNotIn },
              },
            },
          },
        },
      } as any);
    }

    // ========== Date Filters ==========
    const handleDate = (
      field: string,
      value?: string,
      onlyYear: boolean = false,
      operator: 'gt' | 'lt' = 'gt',
    ) => {
      if (!value) return null;

      const comp = operator === 'gt' ? 'gt' : 'lt';
      const eq = 'equals';

      if (onlyYear) {
        return {
          OR: [{ [field]: { year: { [comp]: +value } } }],
        };
      }

      const [year, month, day] = value.split('.').map(Number);
      return {
        OR: [
          { [field]: { year: { [comp]: year } } },
          {
            AND: [
              { [field]: { year: { [eq]: year } } },
              { [field]: { month: { [comp]: month } } },
            ],
          },
          {
            AND: [
              { [field]: { year: { [eq]: year } } },
              { [field]: { month: { [eq]: month } } },
              { [field]: { day: { [comp]: day } } },
            ],
          },
        ],
      };
    };

    const startDateCond = handleDate('startDate', filter.startDateGreater);
    if (startDateCond) conditions.push(startDateCond);

    const endDateCond = handleDate('endDate', filter.endDateGreater);
    if (endDateCond) conditions.push(endDateCond);

    const startDateLesserCond = handleDate(
      'startDate',
      filter.startDateLesser,
      false,
      'lt',
    );
    if (startDateLesserCond) conditions.push(startDateLesserCond);

    const endDateLesserCond = handleDate(
      'endDate',
      filter.endDateLesser,
      false,
      'lt',
    );
    if (endDateLesserCond) conditions.push(endDateLesserCond);

    const startDateLikeCond = handleDate(
      'startDate',
      filter.startDateLike,
      true,
    );
    if (startDateLikeCond) conditions.push(startDateLikeCond);

    const endDateLikeCond = handleDate('endDate', filter.endDateLike, true);
    if (endDateLikeCond) conditions.push(endDateLikeCond);

    if (filter.airingAtGreater) {
      conditions.push({
        airingSchedule: {
          some: {
            airingAt: {
              gte: filter.airingAtGreater,
            },
          },
        },
      });
    }

    if (filter.airingAtLesser) {
      conditions.push({
        airingSchedule: {
          some: {
            airingAt: {
              lt: filter.airingAtLesser,
            },
          },
        },
      });
    }

    // ========== Query Search ==========
    if (filter.query?.trim()) {
      const q = filter.query.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);

      const tokenConditions = tokens.map((t) => ({
        OR: [
          { title: { romaji: { contains: t, mode: 'insensitive' } } },
          { title: { english: { contains: t, mode: 'insensitive' } } },
          { title: { native: { contains: t, mode: 'insensitive' } } },
          { shikimori: { russian: { contains: t, mode: 'insensitive' } } },
          {
            shikimori: { licenseNameRu: { contains: t, mode: 'insensitive' } },
          },
          {
            anizip: {
              titles: {
                some: {
                  OR: tokens.map((token) => ({
                    name: {
                      contains: token,
                      mode: 'insensitive',
                    },
                  })),
                },
              },
            },
          },
        ],
      }));

      if (tokenConditions.length) {
        conditions.push({ AND: tokenConditions });
      }
    }

    // ========== Sorting & Null Filtering ==========
    const { orderBy, sortConditions } = this.getSortOrderAndConditions(
      filter.sort,
    );

    // Add sort-related conditions to filter out nulls when needed
    conditions.push(...sortConditions);

    const whereCondition = { AND: conditions };

    // ========== Pagination ==========
    const perPage = filter.perPage;
    const currentPage = filter.page;
    const skip = (currentPage - 1) * perPage;

    // ========== Query DB ==========
    const [data, total] = await Promise.all([
      this.prisma.anilist.findMany({
        where: whereCondition,
        select,
        take: perPage,
        skip,
        orderBy,
      }),
      this.prisma.anilist.count({ where: whereCondition }),
    ]);

    // ========== Pagination Info ==========
    const pageInfo = getPageInfo(total, perPage, currentPage);

    return {
      pageInfo,
      data: data as Prisma.AnilistGetPayload<{ select: T }>[],
    };
  }

  async getAnilistTagByFilter(
    filter: TagFilterDto,
  ): Promise<ApiResponse<AnilistTag[]>> {
    const conditions: any[] = [];

    // ======= Basic Filters =======
    const basicFields = [
      ['id', filter.id],
      ['name', filter.name],
      ['description', filter.description],
      ['category', filter.category],
      ['isGeneralSpoiler', filter.isGeneralSpoiler],
      ['isAdult', filter.isAdult],
    ];

    for (const [key, value] of basicFields) {
      if (value !== undefined) conditions.push({ [key as any]: value });
    }

    // ======= Array Filters =======
    if (filter.idIn) conditions.push({ id: { in: filter.idIn } });
    if (filter.idNotIn) conditions.push({ id: { notIn: filter.idNotIn } });
    if (filter.idNot !== undefined)
      conditions.push({ id: { not: filter.idNot } });

    if (filter.nameIn) conditions.push({ name: { in: filter.nameIn } });
    if (filter.nameNotIn)
      conditions.push({ name: { notIn: filter.nameNotIn } });
    if (filter.nameLike)
      conditions.push({
        name: { contains: filter.nameLike, mode: 'insensitive' },
      });

    if (filter.categoryIn)
      conditions.push({ category: { in: filter.categoryIn } });
    if (filter.categoryNotIn)
      conditions.push({ category: { notIn: filter.categoryNotIn } });

    // ======= Query Search =======
    if (filter.query) {
      const q = filter.query;
      conditions.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    const whereCondition = { AND: conditions };

    // ======= Sorting =======
    const orderBy: any[] = [];

    if (filter.sort?.length) {
      filter.sort.forEach((sortField) => {
        let direction: 'asc' | 'desc' = 'asc';
        const parts = sortField.split('_');
        const lastPart = parts[parts.length - 1].toLowerCase();

        if (lastPart === 'asc' || lastPart === 'desc') {
          direction = lastPart;
          parts.pop();
        }

        const field = parts.join('_');

        if (['id', 'name', 'category'].includes(field)) {
          orderBy.push({ [field]: direction });
        }
      });
    }

    // ======= Pagination =======
    const perPage = filter.perPage ?? 15;
    const currentPage = filter.page ?? 1;
    const skip = (currentPage - 1) * perPage;

    // ======= Query Prisma =======
    const [data, total] = await Promise.all([
      this.prisma.anilistTag.findMany({
        where: whereCondition,
        take: perPage,
        skip,
        orderBy,
      }),
      this.prisma.anilistTag.count({ where: whereCondition }),
    ]);

    const pageInfo = getPageInfo(total, perPage, currentPage);

    return { pageInfo, data };
  }

  private getSortOrderAndConditions(sort?: string[]): {
    orderBy: NestedSort[];
    sortConditions: any[];
  } {
    const orderByArray: NestedSort[] = [];
    const sortConditions: any[] = [];

    if (!sort?.length) {
      return {
        orderBy: [{ id: 'asc' }],
        sortConditions: [],
      };
    }

    sort.forEach((sortField) => {
      const parts = sortField.split('_');
      let direction: SortDirection = 'asc';

      const lastPart = parts[parts.length - 1].toLowerCase();
      if (lastPart === 'asc' || lastPart === 'desc') {
        direction = lastPart;
        parts.pop();
      }

      const field = parts.join('_');

      switch (field) {
        case MediaSort.START_DATE:
          orderByArray.push({ startDate: { year: direction } });
          orderByArray.push({ startDate: { month: direction } });
          orderByArray.push({ startDate: { day: direction } });
          sortConditions.push({
            startDate: { isNot: null },
          });
          break;

        case MediaSort.END_DATE:
          orderByArray.push({ endDate: { year: direction } });
          sortConditions.push({
            endDate: { isNot: null },
          });
          break;

        case MediaSort.UPDATED_AT:
          orderByArray.push({ zoro: { updatedAt: direction } });
          sortConditions.push({
            zoro: { isNot: null },
          });
          break;

        case MediaSort.LATEST_EPISODE:
          orderByArray.push({
            latestAiringEpisode: {
              airingAt: direction,
            },
          });
          sortConditions.push({
            latestAiringEpisode: { isNot: null },
          });
          break;

        case MediaSort.NEXT_EPISODE:
          orderByArray.push({
            nextAiringEpisode: {
              airingAt: direction,
            },
          });
          sortConditions.push({
            nextAiringEpisode: { isNot: null },
          });
          break;

        case MediaSort.LAST_EPISODE:
          orderByArray.push({
            lastAiringEpisode: {
              airingAt: direction,
            },
          });
          sortConditions.push({
            lastAiringEpisode: { isNot: null },
          });
          break;

        default:
          // Handle nested fields
          if (parts.length > 1) {
            let nested: NestedSort = { [parts.pop()!]: direction };
            while (parts.length) {
              nested = { [parts.pop()!]: nested };
            }
            orderByArray.push(nested);
          } else {
            orderByArray.push({ [field]: direction });
          }
          break;
      }
    });

    orderByArray.push({ id: 'asc' });

    return { orderBy: orderByArray, sortConditions };
  }
}
