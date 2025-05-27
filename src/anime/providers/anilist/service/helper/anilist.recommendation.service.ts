import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../../prisma.service'
import { ApiResponse } from '../../../../../api/ApiResponse'
import { BasicAnilist } from '../../model/BasicAnilist'
import { AnilistService } from '../anilist.service'
import { getPageInfo } from '../../../../../shared/utils'
import { getAnilistInclude, mapToBasic } from '../../utils/anilist-helper'

@Injectable()
export class AnilistRecommendationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistService,
  ) {}

  async getRecommendations(
    id: number,
    page: number,
    perPage: number
  ): Promise<ApiResponse<BasicAnilist[]>> {
    // 1. Get the source anime
    const source = await this.anilist.getAnilist(id, true)
    if (!source) {
      return {
        pageInfo: getPageInfo(0, perPage, page),
        data: [],
      }
    }

    // 2. Use genres and tags for similarity
    const genres = source.genres ?? []
    const tags = (source.tags ?? []).map((t: any) => t.name).filter(Boolean)

    // 3. Query for similar anime, prefer those with most genre/tag overlap and high popularity
    const where: any = {
      id: { not: id },
      isAdult: false,
      OR: [
        { genres: { hasSome: genres } },
        { tags: { some: { name: { in: tags } } } },
      ],
    }

    // 4. Count total for pagination
    const total = await this.prisma.anilist.count({ where })

    // 5. Find recommendations, order by genre/tag overlap and popularity
    const recs = await this.prisma.anilist.findMany({
      where,
      orderBy: [
        { popularity: 'desc' },
        { meanScore: 'desc' },
      ],
      skip: (page - 1) * perPage,
      take: perPage,
      include: getAnilistInclude(),
    })

    // 6. Map to BasicAnilist
    const data: BasicAnilist[] = mapToBasic(recs)

    return {
      pageInfo: getPageInfo(total, perPage, page),
      data,
    }
  }
}