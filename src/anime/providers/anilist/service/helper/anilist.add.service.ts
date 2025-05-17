import { Injectable } from '@nestjs/common';
import { BasicIdAni, AnilistCharacter, AnilistTag } from '@prisma/client';
import { ApiResponse, PageInfo } from '../../../../../api/ApiResponse';
import { TMDB } from '../../../../../configs/tmdb.config';
import { BasicAnilistSmall, BasicAnilist } from '../../model/BasicAnilist';
import { FilterDto } from '../../model/FilterDto';
import { PrismaService } from '../../../../../prisma.service';
import { ShikimoriService } from '../../../shikimori/service/shikimori.service';
import { TmdbService } from '../../../tmdb/service/tmdb.service';
import { AnilistHelper } from '../../utils/anilist-helper';
import {
  AnilistWithRelations,
  Franchise,
  FranchiseResponse,
} from '../../model/AnilistModels';
import { AnilistSearchService } from './anilist.search.service';
import { getPageInfo } from '../../../../../shared/utils';
import { AnilistService } from '../anilist.service';

@Injectable()
export class AnilistAddService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
    private readonly tmdbService: TmdbService,
    private readonly search: AnilistSearchService,
    private readonly shikimori: ShikimoriService,
    private readonly anilist: AnilistService,
  ) {}

  async getChronology(
    id: number,
    filter: FilterDto,
  ): Promise<ApiResponse<BasicAnilistSmall[]>> {
    const existingAnilist = (await this.prisma.anilist.findUnique({
      where: { id },
    })) as AnilistWithRelations;

    const chronologyRaw = await this.shikimori.getChronology(
      String(existingAnilist.idMal),
    );
    const chronologyIds = chronologyRaw.map((c) => Number(c.malId));
    filter.idMalIn = [...(filter.idMalIn ?? []), ...chronologyIds];
    const chronology = await this.search.getAnilists(filter);

    const basicChronology = this.helper.mapToSmall(chronology.data);

    return {
      ...chronology,
      data: basicChronology,
    } as ApiResponse<BasicAnilistSmall[]>;
  }

  async getRecommendations(
    id: number,
    filter: FilterDto,
  ): Promise<ApiResponse<BasicAnilistSmall[]>> {
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
    const recommendations = await this.search.getAnilists(filter);
    const basicRecommendations = this.helper.mapToSmall(recommendations.data);

    return {
      ...recommendations,
      data: basicRecommendations,
    } as ApiResponse<BasicAnilistSmall[]>;
  }

  async getCharacters(
    id: number,
    perPage: number,
    page: number,
  ): Promise<ApiResponse<AnilistCharacter[]>> {
    const existingAnilist = (await this.prisma.anilist.findUnique({
      where: { id },
      include: {
        characters: true,
      },
    })) as AnilistWithRelations;

    const charactersIds = existingAnilist.characters?.map((c) => c.id);

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

    const firstFranchise = franchises.data?.[0];

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

  async addShikimori(
    data: AnilistWithRelations[],
  ): Promise<AnilistWithRelations[]> {
    const malIds = data
      .map((anilist) => anilist.idMal)
      .filter((id): id is number => id != null)
      .map((id) => id.toString())
      .join(',');
    const shikimoriData = await this.shikimori.saveMultipleShikimori(malIds);

    return data.map((anilist) => {
      const malId = anilist.idMal?.toString() || '';
      const shikimori = shikimoriData.find(
        (data) => data.malId?.toString() == malId,
      );
      return {
        ...anilist,
        shikimori: (shikimori as any) || null,
      } as AnilistWithRelations;
    });
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

  async getRandom(): Promise<AnilistWithRelations> {
    const count = await this.prisma.anilist.count();
    const skip = Math.floor(Math.random() * count);

    const data = await this.prisma.anilist.findFirst({
      skip,
      select: {
        id: true,
      },
    });

    if (!data) {
      throw new Error('No objects in database');
    }

    return await this.anilist.getAnilist(data?.id);
  }
}
