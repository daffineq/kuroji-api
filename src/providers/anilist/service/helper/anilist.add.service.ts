import { Injectable } from '@nestjs/common';
import { BasicIdAni, AnilistCharacter } from '@prisma/client'
import { ApiResponse, PageInfo } from '../../../../api/ApiResponse'
import { TMDB } from '../../../../configs/tmdb.config'
import { MediaSort } from '../../filter/Filter'
import { BasicAnilistSmall, BasicAnilist } from '../../model/BasicAnilist'
import { FilterDto } from '../../model/FilterDto'
import { PrismaService } from '../../../../prisma.service'
import { ShikimoriService } from '../../../shikimori/service/shikimori.service'
import { TmdbService } from '../../../tmdb/service/tmdb.service'
import { AnilistHelper } from '../../utils/anilist-helper'
import { AnilistWithRelations, Franchise, FranchiseResponse } from '../../model/AnilistModels'
import { AnilistSearchService } from './anilist.search.service'
import { getPageInfo } from '../../../../shared/utils'

@Injectable()
export class AnilistAddService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnilistHelper,
    private readonly tmdbService: TmdbService,
    private readonly search: AnilistSearchService,
    private readonly shikimori: ShikimoriService,
  ) {}

  async getChronology(id: number, perPage: number, page: number): Promise<ApiResponse<BasicAnilistSmall[]>> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
    }) as AnilistWithRelations

    const chronologyRaw = await this.shikimori.getChronology(String(existingAnilist.idMal));
    const chronologyIds = chronologyRaw.map(c => Number(c.malId));

    const chronology = await this.search.getAnilists(
      new FilterDto({ idMalIn: chronologyIds, perPage, page })
    );

    const basicChronology = this.helper.mapToSmall(chronology.data);

    return {
      ...chronology,
      data: basicChronology,
    } as ApiResponse<BasicAnilistSmall[]>;
  }

  async getRecommendations(id: number, perPage: number, page: number): Promise<ApiResponse<BasicAnilistSmall[]>> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
      include: { recommendations: true }
    }) as {
      idMal: number,
      recommendations: BasicIdAni[]
    }

    const recommendationIds = existingAnilist.recommendations.map(r => Number(r.idMal));

    const recommendations = await this.search.getAnilists(
      new FilterDto({ idMalIn: recommendationIds, perPage, page, sort: [MediaSort.SCORE_DESC] })
    );

    const basicRecommendations = this.helper.mapToSmall(recommendations.data);

    return {
      ...recommendations,
      data: basicRecommendations,
    } as ApiResponse<BasicAnilistSmall[]>;
  }

  async getCharacters(id: number, perPage: number, page: number): Promise<ApiResponse<AnilistCharacter[]>> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
      include: {
        characters: true,
      }
    }) as AnilistWithRelations;

    const charactersIds = existingAnilist.characters?.map(c => c.id);

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
                  characterId: true
                }
              },
              name: {
                omit: {
                  id: true,
                  characterId: true
                }
              },
            }
          },
          voiceActors: {
            include: {
              image: {
                omit: {
                  id: true,
                  voiceActorId: true
                }
              },
              name: {
                omit: {
                  id: true,
                  voiceActorId: true
                }
              },
            }
          }
        },
        skip: perPage * (page - 1),
        take: perPage
      }),
      this.prisma.anilistCharacterEdge.count({
        where: { id: { in: charactersIds } }
      })
    ]);

    const pageInfo: PageInfo = getPageInfo(total, perPage, page);
    const response: ApiResponse<AnilistCharacter[]> = { pageInfo, data };
    return response
  }

  async getFranchise(franchiseName: string, perPage: number, page: number): Promise<FranchiseResponse<BasicAnilist[]>> {
    const franchiseBasic = await this.shikimori.getFranchiseIds(franchiseName);
  
    const franchiseIds = franchiseBasic.map(r => Number(r.malId));

    const franchises = await this.search.getAnilists(
      new FilterDto({ idMalIn: franchiseIds, perPage, page, sort: [MediaSort.START_DATE] })
    );

    const firstFranchise = franchises.data?.[0];
    
    if (!firstFranchise) {
      return {
        pageInfo: franchises.pageInfo,
        franchise: {},
        data: []
      } as FranchiseResponse<BasicAnilist[]>;
    }
    
    const tmdbFirst = await this.tmdbService.getTmdbByAnilist(firstFranchise.id).catch(() => null);

    const franchise: Franchise = {
      cover: firstFranchise.shikimori?.poster?.originalUrl ?? '',
      banner: tmdbFirst?.backdrop_path
        ? TMDB.IMAGE_BASE_ORIGINAL_URL + tmdbFirst.backdrop_path
        : firstFranchise.bannerImage,
      title: (tmdbFirst?.name || (firstFranchise.title)?.romaji) ?? '',
      franchise: franchiseName,
      description: tmdbFirst?.overview || firstFranchise.description,
    }

    const response: FranchiseResponse<BasicAnilist[]> = {
      pageInfo: franchises.pageInfo,
      franchise,
      data: franchises.data
    }
    return response;
  }

  async addShikimori(data: AnilistWithRelations[]): Promise<AnilistWithRelations[]> {
    const malIds = data
      .map((anilist) => anilist.idMal?.toString() || '')
      .join(',')
    const shikimoriData =
      await this.shikimori.saveMultipleShikimori(malIds);

    return data.map((anilist) => {
      const malId = anilist.idMal?.toString() || ''
      const shikimori = shikimoriData.find(
        (data) => data.malId?.toString() === malId,
      )
      return {
        ...anilist,
        shikimori: (shikimori as any) || null,
      } as AnilistWithRelations
    });
  }
}