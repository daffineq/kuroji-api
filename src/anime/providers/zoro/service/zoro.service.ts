import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { ZoroHelper } from '../utils/zoro-helper';
import { UpdateType } from '../../../../update/UpdateType';
import { findBestMatch } from '../../../../mapper/mapper.helper'
import { ANIME, IAnimeInfo, IAnimeResult, ISearch, ISource, StreamingServers, SubOrSub } from '@consumet/extensions'
import { getUpdateData } from '../../../../update/update.util'
import { CustomHttpService } from '../../../../http/http.service'
import { UrlConfig } from '../../../../configs/url.config'
import { ZoroWithRelations } from '../types/types'

const zoro = new ANIME.Zoro();

@Injectable()
export class ZoroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: ZoroHelper,
    private readonly http: CustomHttpService
  ) {}

  async getZoro(id: string): Promise<ZoroWithRelations> {
    const existingZoro = await this.prisma.zoro.findUnique({
      where: { id: id },
      include: {
        episodes: true
      }
    });

    if (!existingZoro) {
      const zoro = await this.fetchZoro(id);
      return this.saveZoro(zoro);
    }
    return existingZoro;
  }

  async getZoroByAnilist(id: number): Promise<ZoroWithRelations> {
    const existingZoro = await this.prisma.zoro.findFirst({
      where: { alID: id },
      include: {
        episodes: true
      }
    });

    if (!existingZoro) {
      const zoro = await this.findZoroByAnilist(id);
      return this.saveZoro(zoro);
    }
    return existingZoro;
  }

  async saveZoro(zoro: IAnimeInfo): Promise<ZoroWithRelations> {
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(zoro.id) },
      create: getUpdateData(String(zoro.id), zoro.alID ?? 0, UpdateType.ANIWATCH),
      update: getUpdateData(String(zoro.id), zoro.alID ?? 0, UpdateType.ANIWATCH),
    });

    await this.prisma.zoro.upsert({
      where: { id: zoro.id },
      create: this.helper.getZoroData(zoro),
      update: this.helper.getZoroData(zoro)
    });

    return await this.prisma.zoro.findUnique({
      where: { id: zoro.id },
      include: {
        episodes: true
      }
    }) as ZoroWithRelations;
  }

  async update(id: string): Promise<ZoroWithRelations> {
    const existingZoro = await this.prisma.zoro.findFirst({
      where: { id },
      include: {
        episodes: true,
      }
    });

    if (!existingZoro) {
      throw new Error('Zoro not found');
    }

    const zoro = await this.fetchZoro(id);
    zoro.alID = existingZoro.alID || 0;

    return this.saveZoro(zoro);
  }

  async getSources(episodeId: string, dub: boolean): Promise<ISource> {
    // return await zoro.fetchEpisodeSources(episodeId, StreamingServers.VidCloud, dub ? SubOrSub.DUB : SubOrSub.SUB);
    return this.http.getResponse(
      UrlConfig.ZORO + 'watch/' + episodeId + '?dub=' + dub
    );
  }

  async fetchZoro(id: string): Promise<IAnimeInfo> {
    // return await zoro.fetchAnimeInfo(id);
    return this.http.getResponse(UrlConfig.ZORO + 'info?id=' + id);
  }

  async searchZoro(q: string): Promise<ISearch<IAnimeResult>> {
    // return (await zoro.search(q)).results;
    return this.http.getResponse(UrlConfig.ZORO + q);
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
        seasonYear: true,
        episodes: true,
      },
    });

    if (!anilist) {
      throw new Error('Anilist not found');
    }
    
    const searchResult = await this.searchZoro(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map(result => ({
      title: result.title,
      id: result.id,
      episodes: result.sub
    }));

    const searchCriteria = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english: anilist.title?.english || undefined,
        native: anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      episodes: anilist.episodes ?? undefined
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await this.fetchZoro(bestMatch.result.id as string);
      data.alID = id;
      return data;
    }

    throw new Error('Zoro not found');
  }
}
