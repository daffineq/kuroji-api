import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { IAnimeInfo } from '@consumet/extensions';
import { getZoroData } from '../utils/zoro-helper.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { zoroFetch } from './zoro.fetch.service.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { Prisma } from '@prisma/client';
import { zoroSelect } from '../types/types.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';

@Injectable()
export class ZoroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
    private readonly mappings: MappingsService,
  ) {}

  async getInfoByAnilist<T extends Prisma.ZoroSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.ZoroGetPayload<{ select: T }>> {
    const existingZoro = await this.prisma.zoro.findFirst({
      where: { alID: id },
      select,
    });

    if (existingZoro) {
      return existingZoro as Prisma.ZoroGetPayload<{ select: T }>;
    }

    const zoro = await this.findByAnilist(id);
    if (!zoro) throw new NotFoundException(`Zoro not found`);

    await this.mappings.updateAniZipMappings(id, { zoroId: zoro.id });

    return await this.save(zoro, select);
  }

  async save<T extends Prisma.ZoroSelect>(
    zoro: IAnimeInfo,
    select?: T,
  ): Promise<Prisma.ZoroGetPayload<{ select: T }>> {
    return (await this.prisma.zoro.upsert({
      where: { id: zoro.id },
      create: getZoroData(zoro),
      update: getZoroData(zoro),
      select,
    })) as Prisma.ZoroGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.ZoroSelect>(
    id: number,
    force: boolean = false,
    select?: T,
  ): Promise<Prisma.ZoroGetPayload<{ select: T }>> {
    if (force) {
      const zoro = await this.findByAnilist(id);
      if (!zoro) throw new NotFoundException('Zoro not found');

      zoro.alID = id;

      return this.save(zoro, select);
    }

    const existingZoro = await this.getInfoByAnilist(id, zoroSelect);
    if (!existingZoro) throw new NotFoundException('Existing Zoro not found');

    const zoro = await zoroFetch.fetchInfo(existingZoro.id);
    if (!zoro) throw new NotFoundException('Zoro not found');

    if (existingZoro.episodes.length === zoro.episodes?.length)
      throw new Error('Zoro not fetched');

    zoro.alID = id;

    return this.save(zoro, select);
  }

  async findByAnilist(id: number): Promise<IAnimeInfo> {
    const anilist = await this.anilist.getMappingAnilist(id);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const searchResult = await zoroFetch.search(
      deepCleanTitle(anilist.title?.romaji ?? ''),
    );

    const results = searchResult.results.map((result) => ({
      titles: [result.title as string, result.japaneseTitle as string],
      id: result.id,
      type: result.type,
      episodes: result.sub as number,
    }));

    const searchCriteria: ExpectAnime = {
      titles: [
        anilist.title?.romaji,
        anilist.title?.english,
        anilist.title?.native,
        ...anilist.synonyms,
      ],
      type: anilist.format ?? undefined,
      episodes: findEpisodeCount(anilist),
    };

    const exclude: string[] = [];

    for (let i = 0; i < 3; i++) {
      const bestMatch = findBestMatch(searchCriteria, results, exclude);

      if (bestMatch) {
        const data = await zoroFetch.fetchInfo(bestMatch.result.id);

        if (
          (data.alID && Number(data.alID) === anilist.id) ||
          (data.malID && Number(data.malID) === anilist.idMal)
        ) {
          data.alID = id;
          return data;
        } else {
          exclude.push(bestMatch.result.id);
          continue;
        }
      }
    }

    throw new NotFoundException('Zoro not found');
  }
}
