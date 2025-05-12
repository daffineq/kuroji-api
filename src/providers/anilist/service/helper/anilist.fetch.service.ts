import { Injectable } from '@nestjs/common';
import { UrlConfig } from '../../../../configs/url.config'
import AnilistQL from '../../graphql/AnilistQL'
import AnilistQueryBuilder from '../../graphql/query/AnilistQueryBuilder'
import { CustomHttpService } from '../../../../http/http.service'
import { AnilistResponse, MoreInfoResponse } from '../../model/AnilistModels'
import { MediaType } from '../../filter/Filter'

@Injectable()
export class AnilistFetchService {
  constructor(private readonly customHttpService: CustomHttpService) {}

  async fetchAnilistFromGraphQL(
    id: number,
    isMal: boolean = false,
  ): Promise<AnilistResponse> {
    const queryBuilder = new AnilistQueryBuilder()

    if (isMal) {
      queryBuilder.setIdMal(id).setPerPage(1);
    } else {
      queryBuilder.setId(id).setPerPage(1);
    }

    queryBuilder.setType(MediaType.ANIME);

    const query = AnilistQL.getQuery()

    return await this.customHttpService.getGraphQL<AnilistResponse>(
      UrlConfig.ANILIST_GRAPHQL,
      query,
      queryBuilder.build(),
    )
  }

  async fetchMoreInfo(id: number): Promise<MoreInfoResponse> {
    try {
      const url = `${UrlConfig.JIKAN}anime/${id}/moreinfo`
      return this.customHttpService.getResponse(url)
    } catch (error) {
      return { data: {} }
    }
  }
}
