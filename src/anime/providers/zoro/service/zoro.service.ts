import { Injectable } from '@nestjs/common';
import { EpisodeZoro, Zoro } from '@prisma/client';
import { UrlConfig } from '../../../../configs/url.config';
import { CustomHttpService } from '../../../../http/http.service';
import { PrismaService } from '../../../../prisma.service';
import { ZoroHelper } from '../utils/zoro-helper';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnilistService } from '../../anilist/service/anilist.service'
import { findBestMatch, ScrapeHelper } from '../../../../scrapper/scrape-helper'
import { Source } from '../../stream/model/Source'
import { TmdbService } from '../../tmdb/service/tmdb.service'

export interface BasicZoro {
  id: string;
  title: string;
  url: string;
  image: string;
  japaneseTitle: string;
}

export interface ZoroResponse {
  results: BasicZoro[];
}

export interface ZoroWithRelations extends Zoro {
  episodes: EpisodeZoro[]
}

@Injectable()
export class ZoroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilistService: AnilistService,
    private readonly tmdbService: TmdbService,
    private readonly http: CustomHttpService,
    private readonly helper: ZoroHelper,
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
      return this.saveZoro(zoro as ZoroWithRelations);
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
      return this.saveZoro(zoro as ZoroWithRelations);
    }
    return existingZoro;
  }

  async saveZoro(zoro: ZoroWithRelations): Promise<ZoroWithRelations> {
    await this.prisma.lastUpdated.create({
      data: {
        entityId: zoro.id,
        externalId: zoro.alID,
        type: UpdateType.ANIWATCH,
      },
    });

    await this.prisma.zoro.create({
      data: this.helper.getZoroData(zoro),
    });

    return await this.prisma.zoro.findUnique({
      where: { id: zoro.id },
      include: {
        episodes: true
      }
    }) as unknown as ZoroWithRelations;
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

    const zoro = await this.fetchZoro(id) as ZoroWithRelations;
    zoro.alID = existingZoro.alID || 0;

    if (existingZoro?.episodes !== zoro.episodes) {
      const tmdb = await this.tmdbService.getTmdbByAnilist(zoro.alID);

      if (tmdb) {
        await this.tmdbService.update(tmdb.id);
      }

      const anilist = await this.anilistService.getAnilist(zoro.alID);
      await this.anilistService.updateAtAnilist(anilist);
    }

    return this.saveZoro(zoro);
  }

  async getSources(episodeId: string, dub: boolean): Promise<Source> {
    const zoro = await this.http.getResponse(
      UrlConfig.ZORO + 'watch/' + episodeId + '?dub=' + dub
    )

    return zoro as Source
  }

  async fetchZoro(id: string): Promise<Zoro> {
    const zoro = await this.http.getResponse(UrlConfig.ZORO + 'info?id=' + id);

    return zoro as Promise<Zoro>;
  }

  async searchZoro(q: string): Promise<ZoroResponse> {
    const zoro = await this.http.getResponse(UrlConfig.ZORO + q);
    return zoro as Promise<ZoroResponse>;
  }
  
  async findZoroByAnilist(id: number): Promise<Zoro> {
    const anilist = await this.anilistService.getAnilist(id);
    const searchResult = await this.searchZoro(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map(result => ({
      title: result.title,
      id: result.id
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
