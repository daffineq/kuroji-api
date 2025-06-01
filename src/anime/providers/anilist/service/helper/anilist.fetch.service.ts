import { Injectable } from '@nestjs/common';
import { UrlConfig } from '../../../../../configs/url.config'
import AnilistQL from '../../graphql/AnilistQL'
import AnilistQueryBuilder from '../../graphql/query/AnilistQueryBuilder'
import { CustomHttpService } from '../../../../../http/http.service'
import { MediaType } from '../../filter/Filter'
import { Jikan, MoreInfoResponse, VideosResponse } from '../../../../../configs/jikan.config'
import { AnilistResponse } from '../../types/types'

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

    const query = AnilistQL.getQuery(queryBuilder)

    return await this.customHttpService.getGraphQL<AnilistResponse>(
      UrlConfig.ANILIST_GRAPHQL,
      query,
      queryBuilder.build(),
    )
  }

  async fetchMoreInfo(id: number): Promise<MoreInfoResponse> {
    return await this.customHttpService.getResponse(Jikan.getMoreInfo(id));
  }

  async fetchVideos(id: number): Promise<VideosResponse> {
    return await this.customHttpService.getResponse(Jikan.getVideos(id));
  }
}
