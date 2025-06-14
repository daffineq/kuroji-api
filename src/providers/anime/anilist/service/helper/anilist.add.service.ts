import { Injectable } from '@nestjs/common';
import { BasicIdAni, AnilistCharacter, AnilistTag } from '@prisma/client';
import { ApiResponse, PageInfo } from '../../../../../shared/ApiResponse';
import { TMDB } from '../../../../../configs/tmdb.config';
import { FilterDto } from '../../filter/FilterDto';
import { PrismaService } from '../../../../../prisma.service';
import { ShikimoriService } from '../../../shikimori/service/shikimori.service';
import { TmdbService } from '../../../tmdb/service/tmdb.service';
import { AnilistSearchService } from './anilist.search.service';
import { getPageInfo } from '../../../../../utils/utils';
import {
  BasicAnilist,
  AnilistWithRelations,
  FranchiseResponse,
  Franchise,
} from '../../types/types';

@Injectable()
export class AnilistAddService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
    private readonly search: AnilistSearchService,
    private readonly shikimori: ShikimoriService,
  ) {}

  async getChronology(
    id: number,
    filter: FilterDto,
  ): Promise<ApiResponse<BasicAnilist[]>> {
    const existingAnilist = (await this.prisma.anilist.findUnique({
      where: { id },
    })) as AnilistWithRelations;

    const chronologyRaw = await this.shikimori.getChronology(
      String(existingAnilist.idMal),
    );
    const chronologyIds = chronologyRaw.map((c) => Number(c.malId));
    filter.idMalIn = [...(filter.idMalIn ?? []), ...chronologyIds];
    return await this.search.getAnilists(filter);
  }

  async getRecommendations(
    id: number,
    filter: FilterDto,
  ): Promise<ApiResponse<BasicAnilist[]>> {
    const existingAnilist = (await this.prisma.anilist.findUnique({
      where: { id },
      include: { recommendations: true },
    })) as {
      id: number;
      recommendations: BasicIdAni[];
    };

    const recommendationIds = existingAnilist.recommendations.map((r) =>
      Number(r.id),
    );
    filter.idIn = [...(filter.idIn ?? []), ...recommendationIds];
    return await this.search.getAnilists(filter);
  }

  async getCharacters(
    id: number,
    perPage: number,
    page: number,
  ): Promise<ApiResponse<AnilistCharacter[]>> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
      include: {
        characters: true,
      },
    });

    const charactersIds = existingAnilist?.characters?.map((c) => c.id);

    const [data, total] = await Promise.all([
      this.prisma.anilistCharacterEdge.findMany({
        where: { id: { in: charactersIds } },
        omit: {
          anilistId: true,
          characterId: true,
        },
        include: {
          character: {
            include: {
              image: {
                omit: {
                  id: true,
                  characterId: true,
                },
              },
              name: {
                omit: {
                  id: true,
                  characterId: true,
                },
              },
            },
          },
          voiceActors: {
            include: {
              image: {
                omit: {
                  id: true,
                  voiceActorId: true,
                },
              },
              name: {
                omit: {
                  id: true,
                  voiceActorId: true,
                },
              },
            },
          },
        },
        skip: perPage * (page - 1),
        take: perPage,
      }),
      this.prisma.anilistCharacterEdge.count({
        where: { id: { in: charactersIds } },
      }),
    ]);

    const pageInfo: PageInfo = getPageInfo(total, perPage, page);
    const response: ApiResponse<AnilistCharacter[]> = { pageInfo, data };
    return response;
  }

  async getFranchise(
    franchiseName: string,
    filter: FilterDto,
  ): Promise<FranchiseResponse<BasicAnilist[]>> {
    const franchiseBasic = await this.shikimori.getFranchiseIds(franchiseName);

    const franchiseIds = franchiseBasic.map((r) => Number(r.malId));
    filter.idMalIn = [...(filter.idMalIn ?? []), ...franchiseIds];
    const franchises = await this.search.getAnilists(filter);

    const firstFranchise = franchises.data.reduce(
      (best, item) => {
        const popularity = item.popularity ?? 0;
        const favourites = item.favourites ?? 0;
        const score = item.score ?? 0;

        const combinedScore = popularity + favourites + score * 10;

        const bestPopularity = best ? (best.popularity ?? 0) : 0;
        const bestFavourites = best ? (best.favourites ?? 0) : 0;
        const bestScore = best ? (best.score ?? 0) : 0;
        const bestCombined = bestPopularity + bestFavourites + bestScore * 10;

        return combinedScore > bestCombined ? item : best;
      },
      null as BasicAnilist | null,
    );

    if (!firstFranchise) {
      return {
        pageInfo: franchises.pageInfo,
        franchise: {},
        data: [],
      } as FranchiseResponse<BasicAnilist[]>;
    }

    const tmdbFirst = await this.tmdbService
      .getTmdbByAnilist(firstFranchise.id)
      .catch(() => null);

    const franchise: Franchise = {
      cover: firstFranchise.shikimori?.poster?.originalUrl ?? '',
      banner: tmdbFirst?.backdrop_path
        ? TMDB.IMAGE_BASE_ORIGINAL_URL + tmdbFirst.backdrop_path
        : firstFranchise.bannerImage,
      title: (tmdbFirst?.name || firstFranchise.title?.romaji) ?? '',
      franchise: franchiseName,
      description: tmdbFirst?.overview || firstFranchise.description,
    };

    const response: FranchiseResponse<BasicAnilist[]> = {
      pageInfo: franchises.pageInfo,
      franchise,
      data: franchises.data,
    };
    return response;
  }

  async getAllGenres(): Promise<string[]> {
    const results = await this.prisma.anilist.findMany({
      select: { genres: true },
    });

    const flatGenres = results.flatMap((entry) => entry.genres);
    const uniqueGenres = [...new Set(flatGenres)].sort();

    return uniqueGenres;
  }

  async getAllTags(
    page: number,
    perPage: number,
  ): Promise<ApiResponse<AnilistTag[]>> {
    const [data, total] = await Promise.all([
      this.prisma.anilistTag.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { name: 'asc' },
      }),
      this.prisma.anilistTag.count(),
    ]);

    const pageInfo = getPageInfo(total, perPage, page);

    return {
      pageInfo,
      data,
    };
  }
}
