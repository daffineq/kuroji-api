import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch } from '../../../mapper/mapper.helper';
import {
  ANIME,
  IAnimeInfo,
  IAnimeResult,
  ISearch,
  ISource,
  StreamingServers,
  SubOrSub,
} from '@consumet/extensions';
import { UrlConfig } from '../../../../configs/url.config';
import { ZoroWithRelations } from '../types/types';
import { Client } from '../../../model/client';
import { getZoroData } from '../utils/zoro-helper';
import { findEpisodeCount } from '../../anilist/utils/anilist-helper';

const zoro = new ANIME.Zoro();

@Injectable()
export class ZoroService extends Client {
  constructor(private readonly prisma: PrismaService) {
    super(UrlConfig.ZORO);
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

    const zoro = await this.fetchZoro(id);

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

    const zoro = await this.fetchZoro(existingZoro.id);

    if (!zoro) {
      throw new Error('Zoro not fetched');
    }

    zoro.alID = id;

    return this.saveZoro(zoro);
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    // return await zoro.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
    const { data, error } = await this.client.get<ISource>(
      `watch/${episodeId}?dub=${dub}`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchZoro(id: string): Promise<IAnimeInfo> {
    // return await zoro.fetchAnimeInfo(id);
    const { data, error } = await this.client.get<IAnimeInfo>(`info?id=${id}`);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async searchZoro(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await zoro.search(q)).results;
    const { data, error } = await this.client.get<ISearch<IAnimeResult>>(q);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async findZoroByAnilist(id: number): Promise<IAnimeInfo> {
    const anilist = await this.prisma.anilist.findUnique({
      where: { id: id },
      select: {
        title: {
          select: {
            romaji: true,
            english: true,
            native: true,
          },
        },
        id: true,
        idMal: true,
        seasonYear: true,
        episodes: true,
        format: true,
        airingSchedule: true,
        shikimori: {
          select: {
            english: true,
            japanese: true,
            episodes: true,
            episodesAired: true,
          },
        },
        kitsu: {
          select: {
            episodeCount: true,
          },
        },
      },
    });

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const searchResult = await this.searchZoro(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map((result) => ({
      title: result.title,
      japaneseTitle: result.japaneseTitle as string,
      id: result.id,
      type: result.type,
      episodes: result.sub as number,
    }));

    const searchCriteria = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english:
          anilist.shikimori?.english || anilist.title?.english || undefined,
        native:
          anilist.shikimori?.japanese || anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      type: anilist.format ?? undefined,
      episodes: findEpisodeCount(anilist),
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await this.fetchZoro(bestMatch.result.id);

      if (
        (data.alID && Number(data.alID) === anilist.id) ||
        (data.malID && Number(data.malID) === anilist.idMal)
      ) {
        data.alID = id;
        return data;
      }
    }

    throw new Error('Zoro not found');
  }
}
