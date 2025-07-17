import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { IAnimeInfo } from '@consumet/extensions';
import { ZoroWithRelations } from '../types/types.js';
import { Client } from '../../../model/client.js';
import { getZoroData } from '../utils/zoro-helper.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { zoroFetch } from './zoro.fetch.service.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';

@Injectable()
export class ZoroService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
  ) {
    super();
  }

  async getZoro(id: string): Promise<ZoroWithRelations> {
    const existingZoro = await this.prisma.zoro.findUnique({
      where: { id: id },
      include: {
        episodes: true,
      },
    });

    if (existingZoro) {
      return existingZoro;
    }

    const zoro = await zoroFetch.fetchZoro(id);

    if (!zoro) {
      throw new Error('Zoro not found');
    }

    return this.saveZoro(zoro);
  }

  async getZoroByAnilist(id: number): Promise<ZoroWithRelations> {
    const existingZoro = await this.prisma.zoro.findFirst({
      where: { alID: id },
      include: {
        episodes: true,
      },
    });

    if (!existingZoro) {
      const zoro = await this.findZoroByAnilist(id);
      return this.saveZoro(zoro);
    }
    return existingZoro;
  }

  async saveZoro(zoro: IAnimeInfo): Promise<ZoroWithRelations> {
    return await this.prisma.zoro.upsert({
      where: { id: zoro.id },
      create: getZoroData(zoro),
      update: getZoroData(zoro),
      include: {
        episodes: true,
      },
    });
  }

  async update(id: number, force: boolean = false): Promise<ZoroWithRelations> {
    if (force) {
      const zoro = await this.findZoroByAnilist(id);

      if (!zoro) {
        throw new Error('Zoro not fetched');
      }

      zoro.alID = id;

      return this.saveZoro(zoro);
    }

    const existingZoro = await this.getZoroByAnilist(id);

    if (!existingZoro) {
      throw new Error('Zoro not found');
    }

    const zoro = await zoroFetch.fetchZoro(existingZoro.id);

    if (!zoro) {
      throw new Error('Zoro not fetched');
    }

    if (existingZoro.episodes.length === zoro.episodes?.length) {
      throw new Error('Nothing to update');
    }

    zoro.alID = id;

    return this.saveZoro(zoro);
  }

  async findZoroByAnilist(id: number): Promise<IAnimeInfo> {
    const anilist = await this.anilist.getMappingAnilist(id);

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const searchResult = await zoroFetch.searchZoro(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map((result) => ({
      title: result.title,
      japaneseTitle: result.japaneseTitle as string,
      id: result.id,
      type: result.type,
      episodes: result.sub as number,
    }));

    const searchCriteria: ExpectAnime = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english:
          anilist.shikimori?.english || anilist.title?.english || undefined,
        native:
          anilist.shikimori?.japanese || anilist.title?.native || undefined,
      },
      synonyms: anilist.synonyms,
      year: anilist.seasonYear ?? undefined,
      type: anilist.format ?? undefined,
      episodes: findEpisodeCount(anilist),
    };

    const exclude: string[] = [];

    for (let i = 0; i < 3; i++) {
      const bestMatch = findBestMatch(searchCriteria, results, exclude);

      if (bestMatch) {
        const data = await zoroFetch.fetchZoro(bestMatch.result.id);

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

    throw new Error('Zoro not found');
  }
}
