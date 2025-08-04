import { Injectable } from '@nestjs/common';
import { BasicIdAni, AnilistCharacter, Prisma } from '@prisma/client';
import { FilterDto } from '../../filter/FilterDto.js';
import { PrismaService } from '../../../../../prisma.service.js';
import { ShikimoriService } from '../../../shikimori/service/shikimori.service.js';
import { AnilistSearchService } from './anilist.search.service.js';
import { PaginatedResponse } from '../../../../../shared/responses.js';

@Injectable()
export class AnilistAddService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly search: AnilistSearchService,
    private readonly shikimori: ShikimoriService,
  ) {}

  async getChronology<T extends Prisma.AnilistSelect>(
    id: number,
    filter: FilterDto,
    select?: T,
  ): Promise<PaginatedResponse<Prisma.AnilistGetPayload<{ select: T }>>> {
    const existingAnilist = await this.prisma.anilist.findUnique({
      where: { id },
      select: {
        idMal: true,
      },
    });

    if (!existingAnilist) throw new Error('Anilist not found');

    const chronologyRaw = await this.shikimori.getChronology(
      String(existingAnilist.idMal),
    );
    const chronologyIds = chronologyRaw.map((c) => Number(c.malId));
    filter.idMalIn = [...(filter.idMalIn ?? []), ...chronologyIds];

    return await this.search.getAnilists(filter, select);
  }

  async getRecommendations<T extends Prisma.AnilistSelect>(
    id: number,
    filter: FilterDto,
    select?: T,
  ): Promise<PaginatedResponse<Prisma.AnilistGetPayload<{ select: T }>>> {
    const existingAnilist = (await this.prisma.anilist.findUnique({
      where: { id },
      select: {
        id: true,
        recommendations: true,
      },
    })) as {
      id: number;
      recommendations: BasicIdAni[];
    };

    const recommendationIds = existingAnilist.recommendations.map((r) =>
      Number(r.id),
    );
    filter.idIn = [...(filter.idIn ?? []), ...recommendationIds];

    return await this.search.getAnilists(filter, select);
  }

  async getCharacters(id: number): Promise<Array<AnilistCharacter>> {
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
