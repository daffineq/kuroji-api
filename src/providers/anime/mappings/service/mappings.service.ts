import { Injectable } from '@nestjs/common';
import { Client } from '../../../model/client.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { PrismaService } from '../../../../prisma.service.js';
import { AniZipWithRelations, IAniZipData } from '../types/types.js';
import { getAnizipData, getAnizipInclude } from '../utils/anizip.helper.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';

@Injectable()
export class MappingsService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
  ) {
    super(UrlConfig.ANI_ZIP_BASE);
  }

  async getMapping(anilistId: number): Promise<AniZipWithRelations> {
    const existing = (await this.prisma.aniZip.findFirst({
      where: { mappings: { anilistId } },
      include: getAnizipInclude(),
    })) as AniZipWithRelations;

    if (existing) return existing;

    const anilist = await this.anilist.getMappingAnilist(anilistId);

    if (!anilist) {
      throw new Error('No anilist found');
    }

    const anizipRaw = await this.fetchMapping(anilistId);

    if (!anizipRaw) {
      throw new Error('No data found');
    }

    return await this.saveMapping(anizipRaw);
  }

  async fetchMapping(anilistId: number) {
    const { data, error } = await this.client.get<IAniZipData>(
      `mappings?anilist_id=${anilistId}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async saveMapping(mapping: IAniZipData) {
    return (await this.prisma.aniZip.create({
      data: getAnizipData(mapping),
      include: getAnizipInclude(),
    })) as AniZipWithRelations;
  }

  /**
   * Update only the mapping IDs for an AniZip entry.
   * @param aniZipId - The AniZip.id (Int)
   * @param mappingIds - Partial mapping fields to update (only IDs)
   */
  async updateAniZipMappings(
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
    }>,
  ): Promise<AniZipWithRelations> {
    const mapping = await this.prisma.aniZipMapping.findUnique({
      where: { aniZipId },
    });

    if (!mapping) {
      throw new Error(`AniZipMapping not found for aniZipId ${aniZipId}`);
    }

    await this.prisma.aniZipMapping.update({
      where: { aniZipId },
      data: mappingIds,
    });

    return this.prisma.aniZip.findUnique({
      where: { id: aniZipId },
      include: getAnizipInclude(),
    }) as Promise<AniZipWithRelations>;
  }
}
