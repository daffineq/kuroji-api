import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../filter/FilterDto.js';
import { AnilistFilterService } from './anilist.filter.service.js';
import { AnilistAddService } from './anilist.add.service.js';
import { ApiResponse } from '../../../../../shared/ApiResponse.js';
import { BasicAnilist, Franchise, FranchiseResponse, SearcnResponse } from '../../types/types.js';
import { convertAnilistToBasic } from '../../utils/anilist-helper.js';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MediaSort } from '../../filter/Filter.js';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { hashFilters } from '../../../../../utils/utils.js';
import Config from '../../../../../configs/config.js';
import { undefinedToNull } from '../../../../../shared/interceptor.js';
import { TagFilterDto } from '../../filter/TagFilterDto.js';
import { getImage } from '../../../tmdb/types/types.js'
import { TmdbService } from '../../../tmdb/service/tmdb.service.js'

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
    const response = await this.filter.getAnilistByFilter(
      new FilterDto({ query: q, page: page, perPage: perPage, sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC] }),
    );

    const response1 = await this.filter.getAnilistByFilter(
      new FilterDto({ query: q, page: 1, sort: [MediaSort.TRENDING_DESC, MediaSort.POPULARITY_DESC]}),
    );

    const basicAnilist = response.data.map((anilist) =>
      convertAnilistToBasic(anilist),
    );

    const basicAnilist1 = response1.data.map((anilist) =>
      convertAnilistToBasic(anilist),
    );

    const firstBasicFranchise = basicAnilist1.find(
      (b) => b.shikimori?.franchise && b.shikimori.franchise.trim().length > 0,
    );

    const franchise = await this.getFranchise(
      firstBasicFranchise?.shikimori?.franchise || '',
      new FilterDto({ perPage: franchises, page: 1, sort: [MediaSort.START_DATE] }),
    );

    return {
      pageInfo: response.pageInfo,
      franchise,
      data: basicAnilist,
    } as SearcnResponse<BasicAnilist[]>;
  }

  async getFranchise(
    franchiseName: string,
    filter: FilterDto,
  ): Promise<FranchiseResponse<BasicAnilist[]>> {
    const baseFilter = { ...filter, franchise: franchiseName }
    const franchises = await this.getAnilists(baseFilter)

    const firstPageFilter = {
      ...baseFilter,
      page: 1,
      sort: [
        MediaSort.POPULARITY_DESC,
        MediaSort.FAVOURITES_DESC,
        MediaSort.SCORE_DESC,
      ],
    }
    const franchises1Page = await this.getAnilists(firstPageFilter)

    const firstFranchise = franchises1Page.data.reduce(
      (best, item) => {
        const popularity = item.popularity ?? 0
        const favourites = item.favourites ?? 0
        const score = item.score ?? 0

        const combinedScore = popularity + favourites + score * 10

        const bestPopularity = best ? (best.popularity ?? 0) : 0
        const bestFavourites = best ? (best.favourites ?? 0) : 0
        const bestScore = best ? (best.score ?? 0) : 0
        const bestCombined = bestPopularity + bestFavourites + bestScore * 10

        return combinedScore > bestCombined ? item : best
      },
      null as BasicAnilist | null,
    )

    if (!firstFranchise) {
      return {
        pageInfo: franchises.pageInfo,
        franchise: {},
        data: [],
      } as FranchiseResponse<BasicAnilist[]>
    }

    const tmdbFirst = await this.tmdbService
      .getTmdbByAnilist(firstFranchise.id)
      .catch(() => null)

    let franchise: Franchise | null = null

    if (tmdbFirst) {
      franchise = {
        cover: getImage(tmdbFirst.poster_path),
        banner: getImage(tmdbFirst.backdrop_path),
        title: tmdbFirst.name,
        franchise: franchiseName,
        description: tmdbFirst.overview,
      }
    }

    const response: FranchiseResponse<BasicAnilist[]> = {
      pageInfo: franchises.pageInfo,
      franchise,
      data: franchises.data,
    }
    return response
  }
}
