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
    const source = await this.anilist.getAnilist(id, true)
    if (!source) {
      throw new Error('Anime not found')
    }

    const genres = source.genres ?? []
    const tags = (source.tags ?? []).map((t: any) => t.name).filter(Boolean)
    const studios = (source.studios ?? []).map((s: any) => s.studio?.name).filter(Boolean)
    const format = source.format

    const candidates = await this.prisma.anilist.findMany({
      where: {
        id: { not: id },
        isAdult: false,
        OR: [
          { genres: { hasSome: genres } },
          { tags: { some: { name: { in: tags } } } },
          { studios: { some: { studio: { name: { in: studios } } } } },
          { format: format },
        ],
      },
      include: getAnilistInclude(),
      take: 200,
    })

    function temperature(candidate: any): number {
      let score = 0

      // Genre overlap (weighted)
      const genreOverlap = candidate.genres?.filter((g: string) => genres.includes(g)).length || 0
      score += genreOverlap * 5

      // Tag overlap (weighted)
      const candidateTags = (candidate.tags ?? []).map((t: any) => t.name).filter(Boolean)
      const tagOverlap = candidateTags.filter((t: string) => tags.includes(t)).length
      score += tagOverlap * 3

      // Studio overlap (weighted)
      const candidateStudios = (candidate.studios ?? []).map((s: any) => s.studio?.name).filter(Boolean)
      const studioOverlap = candidateStudios.filter((s: string) => studios.includes(s)).length
      score += studioOverlap * 4

      // Format match
      if (candidate.format === format && format) score += 2

      // Popularity and meanScore (normalized, minor boost)
      score += (candidate.popularity || 0) / 10000
      score += (candidate.meanScore || 0) / 10

      return score
    }

    const sorted = candidates
      .map(c => ({ c, temp: temperature(c) }))
      .sort((a, b) => b.temp - a.temp)
      .map(x => x.c)

    const total = sorted.length
    const paged = sorted.slice((page - 1) * perPage, page * perPage)

    const data: BasicAnilist[] = mapToBasic(paged)

    return {
      pageInfo: getPageInfo(total, perPage, page),
      data,
    }
  }
}