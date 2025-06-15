import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../filter/FilterDto';
import { AnilistFilterService } from './anilist.filter.service';
import { AnilistAddService } from './anilist.add.service';
import { ApiResponse } from '../../../../../shared/ApiResponse';
import {
  AnilistResponse,
  BasicAnilist,
  SearcnResponse,
} from '../../types/types';
import { convertAnilistToBasic } from '../../utils/anilist-helper';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MediaSort } from '../../filter/Filter';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { hashFilters } from '../../../../../utils/utils';
import Config from '../../../../../configs/config';

@Injectable()
export class AnilistSearchService {
  constructor(
    private readonly filter: AnilistFilterService,
    @Inject(forwardRef(() => AnilistAddService))
    private readonly add: AnilistAddService,
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

    const results = await Promise.all(
      Object.entries(filters).map(async ([key, filterData]) => {
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
      await this.redis.set(key, JSON.stringify(obj), 'EX', Config.REDIS_TIME);
    }

    return obj;
  }

  async searchAnilist(
    q: string,
    page: number,
    perPage: number,
  ): Promise<SearcnResponse<BasicAnilist[]>> {
    const response = await this.filter.getAnilistByFilter(
      new FilterDto({ query: q, page: page, perPage: perPage }),
    );

    const response1 = await this.filter.getAnilistByFilter(
      new FilterDto({ query: q, page: 1 }),
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

    const franchise = await this.add.getFranchise(
      firstBasicFranchise?.shikimori?.franchise || '',
      new FilterDto({ perPage: 3, page: 1, sort: [MediaSort.START_DATE] }),
    );

    return {
      pageInfo: response.pageInfo,
      franchise,
      data: basicAnilist,
    } as SearcnResponse<BasicAnilist[]>;
  }
}
