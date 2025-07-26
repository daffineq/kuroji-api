import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { IAniZipData } from '../types/types.js';
import { getAnizipData } from '../utils/anizip.helper.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { AnizipDto, AnizipSort } from '../types/AnizipDto.js';
import { getPageInfo } from '../../../../utils/utils.js';
import { mappingsFetch } from './mappings.fetch.service.js';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '../../../../shared/responses.js';

@Injectable()
export class MappingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
  ) {}

  async getMapping<T extends Prisma.AniZipSelect>(
    anilistId: number,
    select?: T,
  ): Promise<Prisma.AniZipGetPayload<{ select: T }>> {
    const existing = await this.prisma.aniZip.findFirst({
      where: { mappings: { anilistId } },
      select,
    });

    if (existing) {
      return existing as Prisma.AniZipGetPayload<{ select: T }>;
    }

    const anilist = await this.anilist.getMappingAnilist(anilistId);
    if (!anilist) throw new NotFoundException('No anilist found');

    const anizipRaw = await mappingsFetch.fetchMapping(anilistId);
    if (!anizipRaw) throw new NotFoundException('No data found');

    return await this.save(anizipRaw, select);
  }

  async getMappings<T extends Prisma.AniZipSelect>(
    dto: AnizipDto,
    select?: T,
  ): Promise<ApiResponse<Prisma.AniZipGetPayload<{ select: T }>[]>> {
    const where: any = {};

    if (dto.anilistId) where.mappings = { anilistId: dto.anilistId };
    if (dto.malId) where.mappings = { ...where.mappings, malId: dto.malId };
    if (dto.kitsuId)
      where.mappings = { ...where.mappings, kitsuId: dto.kitsuId };
    if (dto.animePlanetId)
      where.mappings = { ...where.mappings, animePlanetId: dto.animePlanetId };
    if (dto.anidbId)
      where.mappings = { ...where.mappings, anidbId: dto.anidbId };
    if (dto.anisearchId)
      where.mappings = { ...where.mappings, anisearchId: dto.anisearchId };
    if (dto.notifymoeId)
      where.mappings = { ...where.mappings, notifymoeId: dto.notifymoeId };
    if (dto.livechartId)
      where.mappings = { ...where.mappings, livechartId: dto.livechartId };
    if (dto.thetvdbId)
      where.mappings = { ...where.mappings, thetvdbId: dto.thetvdbId };
    if (dto.imdbId) where.mappings = { ...where.mappings, imdbId: dto.imdbId };
    if (dto.themoviedbId)
      where.mappings = { ...where.mappings, themoviedbId: dto.themoviedbId };

    if (dto.minEpisodes !== undefined || dto.maxEpisodes !== undefined) {
      where.episodeCount = {};
      if (dto.minEpisodes !== undefined)
        where.episodeCount.gte = dto.minEpisodes;
      if (dto.maxEpisodes !== undefined)
        where.episodeCount.lte = dto.maxEpisodes;
    }

    if (dto.hasImages !== undefined) {
      where.images = dto.hasImages ? { some: {} } : { none: {} };
    }

    if (dto.hasEpisodes !== undefined) {
      where.episodes = dto.hasEpisodes ? { some: {} } : { none: {} };
    }

    if (dto.hasMappings !== undefined) {
      where.mappings = dto.hasMappings ? { isNot: null } : { is: null };
    }

    if (dto.title) {
      const tokens = dto.title
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length > 0);

      if (tokens.length > 0) {
        where.titles = {
          some: {
            OR: tokens.map((token) => ({
              name: {
                contains: token,
                mode: 'insensitive',
              },
            })),
          },
        };
      }
    }

    if (dto.titleKeys && dto.titleKeys.length > 0) {
      where.titles = {
        ...where.titles,
        some: {
          ...where.titles?.some,
          key: {
            in: dto.titleKeys,
          },
        },
      };
    }

    const orderBy: any[] = [];

    if (dto.sort && dto.sort.length > 0) {
      dto.sort.forEach((sortField) => {
        switch (sortField) {
          case AnizipSort.ID:
            orderBy.push({ id: 'asc' });
            break;
          case AnizipSort.ID_DESC:
            orderBy.push({ id: 'desc' });
            break;
          case AnizipSort.EPISODE_COUNT:
            orderBy.push({ episodeCount: 'asc' });
            break;
          case AnizipSort.EPISODE_COUNT_DESC:
            orderBy.push({ episodeCount: 'desc' });
            break;
          case AnizipSort.SPECIAL_COUNT:
            orderBy.push({ specialCount: 'asc' });
            break;
          case AnizipSort.SPECIAL_COUNT_DESC:
            orderBy.push({ specialCount: 'desc' });
            break;
          default:
            orderBy.push({ id: 'asc' });
        }
      });
    } else {
      orderBy.push({ id: 'asc' });
    }

    const skip = (dto.page - 1) * dto.perPage;

    const [data, total] = await Promise.all([
      this.prisma.aniZip.findMany({
        where,
        select,
        orderBy,
        skip,
        take: dto.perPage,
      }),
      this.prisma.aniZip.count({ where }),
    ]);

    const pageInfo = getPageInfo(total, dto.perPage, dto.page);

    return { pageInfo, data: data as Prisma.AniZipGetPayload<{ select: T }>[] };
  }

  async save<T extends Prisma.AniZipSelect>(
    mapping: IAniZipData,
    select?: T,
  ): Promise<Prisma.AniZipGetPayload<{ select: T }>> {
    return (await this.prisma.aniZip.upsert({
      where: { id: mapping.mappings.anilist_id },
      update: getAnizipData(mapping),
      create: getAnizipData(mapping),
      select,
    })) as Prisma.AniZipGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.AniZipSelect>(
    anilistId: number,
    select?: T,
  ): Promise<Prisma.AniZipGetPayload<{ select: T }>> {
    const anizipRaw = await mappingsFetch.fetchMapping(anilistId);
    if (!anizipRaw) throw new NotFoundException('No data found');
    return await this.save(anizipRaw, select);
  }

  /**
   * Update only the mapping IDs for an AniZip entry.
   * @param aniZipId - The AniZip.id (Int)
   * @param mappingIds - Partial mapping fields to update (only IDs)
   */
  async updateAniZipMappings<T extends Prisma.AniZipSelect>(
    aniZipId: number,
    mappingIds: Partial<{
      animePlanetId: string | null;
      kitsuId: string | null;
      malId: number | null;
      type: string | null;
      anilistId: number | null;
      anisearchId: number | null;
      anidbId: number | null;
      notifymoeId: string | null;
      livechartId: number | null;
      thetvdbId: number | null;
      imdbId: string | null;
      themoviedbId: number | null;
      anilibriaId: number | null;
      zoroId: string | null;
      animepaheId: string | null;
      animekaiId: string | null;
    }>,
    select?: T,
  ): Promise<Prisma.AniZipGetPayload<{ select: T }>> {
    const mapping = await this.prisma.aniZipMapping.findUnique({
      where: { aniZipId },
    });

    if (!mapping)
      throw new NotFoundException(
        `AniZipMapping not found for aniZipId ${aniZipId}`,
      );

    await this.prisma.aniZipMapping.update({
      where: { aniZipId },
      data: mappingIds,
    });

    return this.prisma.aniZip.findUnique({
      where: { id: aniZipId },
      select,
    }) as Promise<Prisma.AniZipGetPayload<{ select: T }>>;
  }
}
