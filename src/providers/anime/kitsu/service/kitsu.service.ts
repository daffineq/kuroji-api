import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { KitsuHelper } from '../util/kitsu-helper.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';
import { kitsuFetch } from './kitsu.fetch.service.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { Prisma } from '@prisma/client';
import { KitsuAnime, kitsuSelect } from '../types/types.js';

@Injectable()
export class KitsuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly anilist: AnilistUtilService,
    private readonly helper: KitsuHelper,
  ) {}

  async getInfo<T extends Prisma.KitsuSelect>(
    id: string,
    select?: T,
  ): Promise<Prisma.KitsuGetPayload<{ select: T }>> {
    const existingKitsu = await this.prisma.kitsu.findFirst({
      where: {
        id,
      },
      select,
    });

    if (existingKitsu) {
      return existingKitsu as Prisma.KitsuGetPayload<{ select: T }>;
    }

    const rawKitsu = await kitsuFetch.fetchInfo(id);

    return await this.save(rawKitsu, select);
  }

  async getInfoByAnilist<T extends Prisma.KitsuSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.KitsuGetPayload<{ select: T }>> {
    const existingKitsu = await this.prisma.kitsu.findFirst({
      where: {
        anilistId: id,
      },
      select,
    });

    if (existingKitsu) {
      return existingKitsu as Prisma.KitsuGetPayload<{ select: T }>;
    }

    const mapping = await this.mappings.getMapping(id, {
      id: true,
      mappings: true,
    });
    if (!mapping) throw new NotFoundException('No mapping found');

    const kitsuId = mapping.mappings?.kitsuId;

    if (!kitsuId) {
      const rawKitsu = await this.findByAnilist(id);
      await this.mappings.updateAniZipMappings(mapping.id, {
        kitsuId: rawKitsu.id,
      });
      return await this.save(rawKitsu, select);
    }

    const rawKitsu = await kitsuFetch.fetchInfo(kitsuId);
    rawKitsu.anilistId = id;
    return await this.save(rawKitsu, select);
  }

  async save<T extends Prisma.KitsuSelect>(
    kitsu: KitsuAnime,
    select?: T,
  ): Promise<Prisma.KitsuGetPayload<{ select: T }>> {
    return (await this.prisma.kitsu.upsert({
      where: { id: kitsu.id },
      create: this.helper.getDataForPrisma(kitsu),
      update: this.helper.getDataForPrisma(kitsu),
      select,
    })) as Prisma.KitsuGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.KitsuSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.KitsuGetPayload<{ select: T }>> {
    const existingKitsu = await this.getInfoByAnilist(id, kitsuSelect);
    if (!existingKitsu) throw new NotFoundException('Not found');

    const rawKitsu = await kitsuFetch.fetchInfo(existingKitsu.id);
    rawKitsu.anilistId = existingKitsu.anilistId ?? 0;

    return await this.save(rawKitsu, select);
  }

  async findByAnilist(id: number): Promise<KitsuAnime> {
    const anilist = await this.anilist.getMappingAnilist(id);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const searchResult = await kitsuFetch.search(
      deepCleanTitle(anilist.title?.romaji ?? ''),
    );

    const results = searchResult.map((result) => {
      const startDate = result.attributes.startDate;
      const year = startDate ? parseInt(startDate.split('-')[0]) : undefined;

      return {
        titles: [
          result.attributes.titles.en,
          result.attributes.titles.en_jp,
          result.attributes.titles.ja_jp,
        ],
        id: result.id,
        year,
        episodes: result.attributes.episodeCount,
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [
        anilist.title?.romaji,
        anilist.title?.english,
        anilist.title?.native,
        ...anilist.synonyms,
      ],
      year: anilist.seasonYear ?? undefined,
      episodes: findEpisodeCount(anilist),
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await kitsuFetch.fetchInfo(bestMatch.result.id);
      data.anilistId = id;
      return data;
    }

    throw new NotFoundException('Kitsu not found');
  }
}
