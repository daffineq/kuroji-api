import { Injectable } from '@nestjs/common';
import { BasicIdAni, AnilistCharacter } from '@prisma/client';
import { ApiResponse } from '../../../../../shared/ApiResponse.js';
import { FilterDto } from '../../filter/FilterDto.js';
import { PrismaService } from '../../../../../prisma.service.js';
import { ShikimoriService } from '../../../shikimori/service/shikimori.service.js';
import { AnilistSearchService } from './anilist.search.service.js';
import { BasicAnilist, AnilistWithRelations } from '../../types/types.js';

@Injectable()
export class AnilistAddService {
  constructor(
    private readonly prisma: PrismaService,
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

  async getCharacters(id: number): Promise<AnilistCharacter[]> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
      include: {
        characters: true,
      },
    });

    const charactersIds = existingAnilist?.characters?.map((c) => c.id);

    const data = await this.prisma.anilistCharacterEdge.findMany({
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
    });

    return data;
  }

  async getAllGenres(): Promise<string[]> {
    const results = await this.prisma.anilist.findMany({
      select: { genres: true },
    });

    const flatGenres = results.flatMap((entry) => entry.genres);
    const uniqueGenres = [...new Set(flatGenres)].sort();

    return uniqueGenres;
  }
}
