import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../../prisma.service'
import { ApiResponse } from '../../../../../api/ApiResponse'
import { BasicAnilist } from '../../model/BasicAnilist'
import { AnilistService } from '../anilist.service'
import { Anilist, AnilistStudioEdge, AnilistTag } from '@prisma/client'
import { getPageInfo } from '../../../../../shared/utils'

interface AnimeScore {
  id: number
  score: number
}

type AnimeWithRelations = Anilist & {
  tags: AnilistTag[];
  studios: AnilistStudioEdge[];
}

@Injectable()
export class AnilistRecommendationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistService
  ) {}

  async getRecommendations(id: number, page: number = 1, perPage: number = 20): Promise<ApiResponse<BasicAnilist[]>> {
    // Get the source anime details
    const sourceAnime = await this.prisma.anilist.findUnique({
      where: { id },
      include: {
        tags: true,
        studios: true,
      }
    });

    if (!sourceAnime) {
      throw new Error('Anime not found');
    }

    // Get pre-filtered anime based on basic criteria
    const preFilteredAnime = await this.prisma.anilist.findMany({
      where: {
        NOT: { id },
        isAdult: false,
        // Filter by same format or similar formats
        format: {
          in: this.getSimilarFormats(sourceAnime.format)
        },
        // Filter by similar episode count range
        episodes: {
          gte: Math.max(1, (sourceAnime.episodes || 12) - 6),
          lte: (sourceAnime.episodes || 12) + 6
        },
        // Filter by genre overlap
        genres: {
          hasSome: sourceAnime.genres
        }
      },
      include: {
        tags: true,
        studios: true,
      },
      // Get more than needed for scoring, but not all
      take: perPage * 3,
      orderBy: [
        { meanScore: 'desc' },
        { popularity: 'desc' }
      ]
    });

    // Calculate scores for the pre-filtered anime
    const scores: AnimeScore[] = preFilteredAnime.map(anime => ({
      id: anime.id,
      score: this.calculateSimilarityScore(sourceAnime, anime)
    }));

    // Sort by score and get paginated results
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    const paginatedScores = sortedScores.slice(0, perPage);

    // Get full details for recommended anime
    const recommendations = await Promise.all(
      paginatedScores.map(rec => this.anilist.getAnilist(rec.id))
    );

    const validRecommendations = recommendations.filter(Boolean) as BasicAnilist[];

    const pageInfo = getPageInfo(sortedScores.length, perPage, page);

    return {
      pageInfo,
      data: validRecommendations
    };
  }

  private getSimilarFormats(format: string | null): string[] {
    switch (format) {
      case 'TV':
        return ['TV', 'TV_SHORT'];
      case 'MOVIE':
        return ['MOVIE', 'SPECIAL'];
      case 'OVA':
        return ['OVA', 'ONA', 'SPECIAL'];
      default:
        return [format || 'TV'];
    }
  }

  private calculateSimilarityScore(source: AnimeWithRelations, target: AnimeWithRelations): number {
    let score = 0;

    // Genre matching (weight: 3.0)
    const genreMatch = this.calculateGenreScore(source.genres, target.genres);
    score += genreMatch * 3.0;

    // Tags matching (weight: 2.5)
    const tagMatch = this.calculateTagScore(source.tags, target.tags);
    score += tagMatch * 2.5;

    // Studio matching (weight: 1.5)
    const studioMatch = this.calculateStudioScore(source.studios, target.studios);
    score += studioMatch * 1.5;

    // Format matching (weight: 1.0)
    if (source.format === target.format) {
      score += 1.0;
    }

    // Episode count similarity (weight: 0.5)
    const episodeDiff = Math.abs((source.episodes || 0) - (target.episodes || 0));
    score += (1 - Math.min(episodeDiff / 12, 1)) * 0.5;

    // Score/popularity bonus (weight: 1.0)
    if ((target.averageScore || 0) > 75) {
      score += 1.0;
    }

    return score;
  }

  private calculateGenreScore(sourceGenres: string[], targetGenres: string[]): number {
    if (!sourceGenres?.length || !targetGenres?.length) return 0;
    
    const matches = sourceGenres.filter(g => targetGenres.includes(g));
    return matches.length / Math.max(sourceGenres.length, targetGenres.length);
  }

  private calculateTagScore(sourceTags: AnilistTag[], targetTags: AnilistTag[]): number {
    if (!sourceTags?.length || !targetTags?.length) return 0;

    const sourceTagNames = sourceTags.map(t => t.name);
    const targetTagNames = targetTags.map(t => t.name);
    
    const matches = sourceTagNames.filter(t => targetTagNames.includes(t));
    return matches.length / Math.max(sourceTagNames.length, targetTagNames.length);
  }

  private calculateStudioScore(sourceStudios: AnilistStudioEdge[], targetStudios: AnilistStudioEdge[]): number {
    if (!sourceStudios?.length || !targetStudios?.length) return 0;

    const matches = sourceStudios.filter(studio => 
      targetStudios.some(targetStudio => targetStudio.studioId === studio.studioId)
    );
    return matches.length > 0 ? 1 : 0;
  }
}