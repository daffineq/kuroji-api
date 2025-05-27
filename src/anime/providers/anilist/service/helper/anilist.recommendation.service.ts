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

      // Genre overlap (percentage of source genres present in candidate)
      const candidateGenres = candidate.genres ?? []
      const genreOverlap = candidateGenres.filter((g: string) => genres.includes(g))
      const genrePrecision = genreOverlap.length / (candidateGenres.length || 1)
      const genreRecall = genreOverlap.length / (genres.length || 1)
      // F1 score for genre match
      const genreF1 = (2 * genrePrecision * genreRecall) / (genrePrecision + genreRecall || 1)
      score += genreF1 * 40 // Strong weight for genre match

      // Tag overlap (percentage, F1)
      const candidateTags = (candidate.tags ?? []).map((t: any) => t.name).filter(Boolean)
      const tagOverlap = candidateTags.filter((t: string) => tags.includes(t))
      const tagPrecision = tagOverlap.length / (candidateTags.length || 1)
      const tagRecall = tagOverlap.length / (tags.length || 1)
      const tagF1 = (2 * tagPrecision * tagRecall) / (tagPrecision + tagRecall || 1)
      score += tagF1 * 20

      // Studio overlap (bonus if any match)
      const candidateStudios = (candidate.studios ?? []).map((s: any) => s.studio?.name).filter(Boolean)
      const studioOverlap = candidateStudios.filter((s: string) => studios.includes(s)).length
      if (studioOverlap > 0) score += 5

      // Format match
      if (candidate.format === format && format) score += 2

      // Penalize for genres/tags NOT in source (irrelevant content)
      const extraGenres = candidateGenres.filter((g: string) => !genres.includes(g)).length
      score -= extraGenres * 2
      const extraTags = candidateTags.filter((t: string) => !tags.includes(t)).length
      score -= extraTags

      // Popularity and meanScore (minor boost)
      score += (candidate.popularity || 0) / 20000
      score += (candidate.meanScore || 0) / 20

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