import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { SearcnResponse, FranchiseResponse } from '../../model/AnilistModels'
import { BasicAnilist } from '../../model/BasicAnilist'
import { FilterDto } from '../../filter/FilterDto'
import { AnilistFilterService } from './anilist.filter.service'
import { AnilistAddService } from './anilist.add.service'
import { AnilistHelper } from '../../utils/anilist-helper'

@Injectable()
export class AnilistSearchService {
  constructor(
    private readonly filter: AnilistFilterService,
    @Inject(forwardRef(() => AnilistAddService))
    private readonly add: AnilistAddService,
    private readonly helper: AnilistHelper,
  ) {}

  async getAnilists(
    filter: FilterDto
  ): Promise<SearcnResponse<BasicAnilist[]>> {
    const response = await this.filter.getAnilistByFilter(filter);

    const basicAnilist = response.data.map((anilist) =>
      this.helper.convertAnilistToBasic(anilist),
    );

    return { pageInfo: response.pageInfo, data: basicAnilist } as SearcnResponse<BasicAnilist[]>;
  }

  async searchAnilist(q: string): Promise<SearcnResponse<BasicAnilist[]>> {
    const response = await this.filter.getAnilistByFilter(new FilterDto({ query: q }))

    const basicAnilist = response.data.map((anilist) =>
      this.helper.convertAnilistToBasic(anilist),
    )

    const firstBasicFranchise = basicAnilist.find(b =>
      !!b.shikimori?.franchise && b.shikimori.franchise.trim().length > 0
    )

    const franchise = await this.add.getFranchise(firstBasicFranchise?.shikimori?.franchise || '', new FilterDto({perPage: 3, page: 1})) as FranchiseResponse<BasicAnilist[]>

    return {
      pageInfo: response.pageInfo,
      franchise: {
        franchise: franchise.franchise || {},
        data: franchise.data || [],
      }, data: basicAnilist
    } as SearcnResponse<BasicAnilist[]>
  }
}