import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../filter/FilterDto.js';
import { AnilistFilterService } from './anilist.filter.service.js';
import {
  Franchise,
  FranchiseResponse,
  SearchResponse,
} from '../../types/types.js';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MediaSort } from '../../filter/Filter.js';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import {
  hashFilter,
  hashFilters,
  hashSelect,
} from '../../../../../utils/utils.js';
import Config from '../../../../../configs/config.js';
import { undefinedToNull } from '../../../../../shared/interceptor.js';
import { getImage } from '../../../tmdb/types/types.js';
import { TmdbService } from '../../../tmdb/service/tmdb.service.js';
import { Prisma } from '@prisma/client';
import { TagFilterDto } from '../../filter/TagFilterDto.js';
import { ApiResponse } from '../../../../../shared/responses.js';

@Injectable()
export class AnilistSearchService {
  constructor(
    private readonly filter: AnilistFilterService,
    private readonly tmdbService: TmdbService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getAnilists<T extends Prisma.AnilistSelect>(
    filter: FilterDto,
    select?: T,
  ): Promise<ApiResponse<Prisma.AnilistGetPayload<{ select: T }>[]>> {
    return await this.filter.getAnilistByFilter(filter, select);
  }

  async getAnilistsBatched<T extends Prisma.AnilistSelect>(
    filters: Record<string, any>,
    select?: T,
  ): Promise<
    Record<string, ApiResponse<Prisma.AnilistGetPayload<{ select: T }>[]>>
  > {
    const key = `filter:batched:${hashFilters(filters)}:${hashSelect(select)}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached) as Record<
          string,
          ApiResponse<Prisma.AnilistGetPayload<{ select: T }>[]>
        >;
      }
    }

    const entries = Object.entries(filters);

    if (entries.length > Config.MAX_FILTER_BATCHES) {
      throw new Error(
        `Too many filter batches! Max allowed is ${Config.MAX_FILTER_BATCHES}, but got ${entries.length}`,
      );
    }

    const results = await Promise.all(
      entries.map(async ([key, filterData]) => {
        const filter = plainToClass(FilterDto, filterData);

        const errors = await validate(filter);
        if (errors.length > 0) {
          throw new Error(
            `Validation failed for ${key}: ${JSON.stringify(errors)}`,
          );
        }

        const data = await this.getAnilists(filter, select);
        return [key, data];
      }),
    );

    const obj = Object.fromEntries(results);

    if (Config.REDIS) {
      await this.redis.set(
        key,
        JSON.stringify(undefinedToNull(obj)),
        'EX',
        Config.REDIS_TIME,
      );
    }

    return obj;
  }

  async searchAnilist<T extends Prisma.AnilistSelect>(
    q: string,
    franchises: number = 3,
    page: number,
    perPage: number,
    select?: T,
  ): Promise<SearchResponse<Prisma.AnilistGetPayload<{ select: T }>[]>> {
    const searchKey = `search:${q}:${page}:${perPage}:${franchises}:${hashSelect(select)}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(searchKey);
      if (cached) {
        return JSON.parse(cached) as SearchResponse<
          Prisma.AnilistGetPayload<{ select: T }>[]
        >;
      }
    }

    const mainSearchPromise = this.getAnilists(
      new FilterDto({
        query: q,
        page: page,
        perPage: perPage,
        sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC],
      }),
      select,
    );

    const franchiseSelect = {
      ...select,
      id: true,
      shikimori: {
        select: {
          franchise: true,
        },
      },
    };

    const page1Promise = this.getAnilists(
      new FilterDto({
        query: q,
        page: 1,
        perPage: 20,
        sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC],
      }),
      franchiseSelect,
    );

    const [response, page1Response] = await Promise.all([
      mainSearchPromise,
      page1Promise,
    ]);

    const dataForFranchise = page1Response?.data;

    const firstBasicFranchise = dataForFranchise?.find(
      (b) => b.shikimori?.franchise && b.shikimori.franchise.trim().length > 0,
    );

    let franchise: FranchiseResponse<
      Prisma.AnilistGetPayload<{ select: T }>[]
    > | null = null;
    if (firstBasicFranchise?.shikimori?.franchise) {
      try {
        franchise = await this.getFranchise(
          firstBasicFranchise.shikimori.franchise,
          new FilterDto({
            perPage: franchises,
            page: 1,
            sort: [MediaSort.POPULARITY_DESC, MediaSort.TRENDING_DESC],
          }),
          select,
        );
      } catch (e) {
        console.log(e);
      }
    }

    const result: SearchResponse<Prisma.AnilistGetPayload<{ select: T }>[]> = {
      pageInfo: response.pageInfo,
      franchise,
      data: response.data,
    };

    if (Config.REDIS) {
      await this.redis.set(
        searchKey,
        JSON.stringify(undefinedToNull(result)),
        'EX',
        Config.REDIS_TIME,
      );
    }

    return result;
  }

  async getFranchise<T extends Prisma.AnilistSelect>(
    franchiseName: string,
    filter: FilterDto,
    select?: T,
  ): Promise<FranchiseResponse<Prisma.AnilistGetPayload<{ select: T }>[]>> {
    if (franchiseName.trim().length === 0) {
      throw new Error('Franchise name cannot be empty');
    }

    const franchiseKey = `franchise:${franchiseName}:${hashFilter(filter)}:${hashSelect(select)}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(franchiseKey);
      if (cached) {
        return JSON.parse(cached) as FranchiseResponse<
          Prisma.AnilistGetPayload<{ select: T }>[]
        >;
      }
    }

    const mainFranchisePromise = this.getAnilists(
      { ...filter, franchise: franchiseName },
      select,
    );

    const tmdbSelect = {
      id: true,
    };

    const page1Promise = this.getAnilists(
      {
        ...filter,
        franchise: franchiseName,
        page: 1,
        perPage: 20,
        sort: [
          MediaSort.POPULARITY_DESC,
          MediaSort.FAVOURITES_DESC,
          MediaSort.SCORE_DESC,
        ],
      },
      tmdbSelect,
    );

    const [franchises, page1Franchises] = await Promise.all([
      mainFranchisePromise,
      page1Promise,
    ]);

    if (!page1Franchises) throw new Error('Page 1 franchises not found');

    const firstFranchise =
      page1Franchises?.data.length > 0 ? page1Franchises.data[0] : null;
    if (!firstFranchise) throw new Error('Franchise not found');

    let franchise: Franchise | null = null;
    try {
      const tmdbFirst = await this.tmdbService.getInfoByAnilist(
        firstFranchise.id,
      );

      if (tmdbFirst) {
        franchise = {
          cover: getImage(tmdbFirst.poster_path),
          banner: getImage(tmdbFirst.backdrop_path),
          title: tmdbFirst.name,
          franchise: franchiseName,
          description: tmdbFirst.overview,
        };
      }
    } catch (error) {
      console.warn(
        `TMDB fetch failed for franchise ${franchiseName}:`,
        error.message,
      );
    }

    const response: FranchiseResponse<
      Prisma.AnilistGetPayload<{ select: T }>[]
    > = {
      pageInfo: franchises.pageInfo,
      franchise,
      data: franchises.data,
    };

    if (Config.REDIS) {
      await this.redis.set(
        franchiseKey,
        JSON.stringify(undefinedToNull(response)),
        'EX',
        Config.REDIS_TIME,
      );
    }

    return response;
  }

  async getTags(filter: TagFilterDto) {
    return this.filter.getAnilistTagByFilter(filter);
  }
}
