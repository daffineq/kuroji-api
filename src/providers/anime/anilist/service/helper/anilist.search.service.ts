import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../filter/FilterDto.js';
import { AnilistFilterService } from './anilist.filter.service.js';
import { ApiResponse } from '../../../../../shared/ApiResponse.js';
import {
  BasicAnilist,
  Franchise,
  FranchiseResponse,
  SearcnResponse,
} from '../../types/types.js';
import { convertAnilistToBasic } from '../../utils/anilist-helper.js';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MediaSort } from '../../filter/Filter.js';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { hashFilter, hashFilters } from '../../../../../utils/utils.js';
import Config from '../../../../../configs/config.js';
import { undefinedToNull } from '../../../../../shared/interceptor.js';
import { TagFilterDto } from '../../filter/TagFilterDto.js';
import { getImage } from '../../../tmdb/types/types.js';
import { TmdbService } from '../../../tmdb/service/tmdb.service.js';

@Injectable()
export class AnilistSearchService {
  constructor(
    private readonly filter: AnilistFilterService,
    private readonly tmdbService: TmdbService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getAnilists(filter: FilterDto): Promise<ApiResponse<BasicAnilist[]>> {
    const response = await this.filter.getAnilistByFilter(filter);

    const basicAnilist = response.data.map((anilist) =>
      convertAnilistToBasic(anilist),
    );

    return { pageInfo: response.pageInfo, data: basicAnilist } as ApiResponse<
      BasicAnilist[]
    >;
  }

  async getAnilistsBatched(
    filters: Record<string, any>,
  ): Promise<Record<string, ApiResponse<BasicAnilist[]>>> {
    const key = `filter:batched:${hashFilters(filters)}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached) as Record<
          string,
          ApiResponse<BasicAnilist[]>
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

        const data = await this.getAnilists(filter);
        return [key, data] as [string, ApiResponse<BasicAnilist[]>];
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

  async getTags(filter: TagFilterDto) {
    return this.filter.getAnilistTagByFilter(filter);
  }

  async searchAnilist(
    q: string,
    franchises: number = 3,
    page: number,
    perPage: number,
  ): Promise<SearcnResponse<BasicAnilist[]>> {
    const searchKey = `search:${q}:${page}:${perPage}:${franchises}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(searchKey);
      if (cached) {
        return JSON.parse(cached) as SearcnResponse<BasicAnilist[]>;
      }
    }

    const mainSearchPromise = this.getAnilists(
      new FilterDto({
        query: q,
        page: page,
        perPage: perPage,
        sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC],
      }),
    );

    let page1Promise: Promise<ApiResponse<BasicAnilist[]>> | null = null;
    if (page !== 1) {
      page1Promise = this.getAnilists(
        new FilterDto({
          query: q,
          page: 1,
          perPage: 20,
          sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC],
        }),
      );
    }

    const [response, page1Response] = await Promise.all([
      mainSearchPromise,
      page1Promise,
    ]);

    const dataForFranchise = page === 1 ? response.data : page1Response?.data;

    const firstBasicFranchise = dataForFranchise?.find(
      (b) => b.shikimori?.franchise && b.shikimori.franchise.trim().length > 0,
    );

    let franchise: FranchiseResponse<BasicAnilist[]> | null = null;
    if (firstBasicFranchise?.shikimori?.franchise) {
      try {
        franchise = await this.getFranchise(
          firstBasicFranchise.shikimori.franchise,
          new FilterDto({
            perPage: franchises,
            page: 1,
            sort: [MediaSort.POPULARITY_DESC, MediaSort.TRENDING_DESC],
          }),
        );
      } catch (e) {
        console.log(e);
      }
    }

    const result = {
      pageInfo: response.pageInfo,
      franchise,
      data: response.data,
    } as SearcnResponse<BasicAnilist[]>;

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

  async getFranchise(
    franchiseName: string,
    filter: FilterDto,
  ): Promise<FranchiseResponse<BasicAnilist[]>> {
    if (franchiseName.trim().length === 0) {
      throw new Error('Franchise name cannot be empty');
    }

    const franchiseKey = `franchise:${franchiseName}:${hashFilter(filter)}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(franchiseKey);
      if (cached) {
        return JSON.parse(cached) as FranchiseResponse<BasicAnilist[]>;
      }
    }

    const mainFranchisePromise = this.getAnilists({
      ...filter,
      franchise: franchiseName,
    });

    let page1Promise: Promise<ApiResponse<BasicAnilist[]>> | null = null;
    if (filter.page !== 1) {
      page1Promise = this.getAnilists({
        ...filter,
        franchise: franchiseName,
        page: 1,
        perPage: 20,
        sort: [
          MediaSort.POPULARITY_DESC,
          MediaSort.FAVOURITES_DESC,
          MediaSort.SCORE_DESC,
        ],
      });
    }

    const [franchises, page1Franchises] = await Promise.all([
      mainFranchisePromise,
      page1Promise,
    ]);

    const dataForBestFranchise =
      filter.page === 1 ? franchises.data : page1Franchises?.data || [];

    const firstFranchise =
      dataForBestFranchise.length > 0 ? dataForBestFranchise[0] : null;

    if (!firstFranchise) {
      return {
        pageInfo: franchises.pageInfo,
        franchise: {},
        data: [],
      } as FranchiseResponse<BasicAnilist[]>;
    }

    let franchise: Franchise | null = null;
    try {
      const tmdbFirst = (await Promise.race([
        this.tmdbService.getTmdbByAnilist(firstFranchise.id),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TMDB timeout')), 2000),
        ),
      ])) as any;

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

    const response: FranchiseResponse<BasicAnilist[]> = {
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
}
