import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma.service.js';
import { AnilistService } from '../anilist.service.js';
import { RandomDto, RandomType } from '../../types/types.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnilistRandomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistService,
  ) {}

  async getRandom<T extends Prisma.AnilistSelect>(
    params: RandomDto,
    select?: T,
  ): Promise<Prisma.AnilistGetPayload<{ select: T }>> {
    const {
      type = RandomType.ANY,
      genre,
      minPopularity = 10000,
      minScore = 75,
      maxTrendingRank = 500,
    } = params;

    const whereClause: any = {};
    const orderByClause: any = {};

    if (genre) {
      whereClause.genres = {
        has: genre.toLowerCase(),
      };
    }

    switch (type) {
      case RandomType.POPULAR:
        whereClause.popularity = {
          gte: minPopularity,
        };
        orderByClause.popularity = 'desc';
        break;
      case RandomType.HIGHLY_RATED:
        whereClause.averageScore = {
          gte: minScore,
        };
        orderByClause.averageScore = 'desc';
        break;
      case RandomType.TRENDING:
        whereClause.trending = {
          lte: maxTrendingRank,
          gt: 0,
        };
        orderByClause.trending = 'asc';
        break;
      case RandomType.ANY:
      default:
        break;
    }

    const count = await this.prisma.anilist.count({
      where: whereClause,
    });

    if (count === 0) {
      let errorMessage = 'No anime found matching your criteria.';
      if (genre) errorMessage += ` (Genre: ${genre})`;
      if (type === RandomType.POPULAR)
        errorMessage += ` (Min Popularity: ${minPopularity})`;
      if (type === RandomType.HIGHLY_RATED)
        errorMessage += ` (Min Score: ${minScore})`;
      if (type === RandomType.TRENDING)
        errorMessage += ` (Max Trending Rank: ${maxTrendingRank})`;
      throw new Error(errorMessage);
    }

    const skip = Math.floor(Math.random() * count);

    const data = await this.prisma.anilist.findFirst({
      skip,
      where: whereClause,
      select: {
        id: true,
      },
      orderBy:
        Object.keys(orderByClause).length > 0 ? orderByClause : undefined,
    });

    if (!data)
      throw new Error('Could not retrieve an anime matching your criteria.');

    return await this.anilist.getAnilist(data.id, select);
  }
}
