import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { IAnimeInfo, ISource } from '@consumet/extensions';
import { UrlConfig } from '../../../../configs/url.config.js';
import { AnimepaheWithRelations } from '../types/types.js';
import { Client } from '../../../model/client.js';
import { getAnimePaheData } from '../utils/animepahe-helper.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { animepaheFetch } from './animepahe.fetch.service.js';

@Injectable()
export class AnimepaheService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
  ) {
    super(UrlConfig.ANIMEPAHE);
  }

  async getAnimepaheByAnilist(id: number): Promise<AnimepaheWithRelations> {
    const existingAnimepahe = await this.prisma.animepahe.findFirst({
      where: { alId: id },
      include: {
        externalLinks: true,
        episodes: true,
      },
    });

    if (existingAnimepahe) {
      return existingAnimepahe;
    }

    const animepahe = await this.findAnimepahe(id);
    return this.saveAnimepahe(animepahe);
  }

  async saveAnimepahe(animepahe: IAnimeInfo): Promise<AnimepaheWithRelations> {
    return await this.prisma.animepahe.upsert({
      where: { id: animepahe.id },
      update: getAnimePaheData(animepahe),
      create: getAnimePaheData(animepahe),
      include: {
        externalLinks: true,
        episodes: true,
      },
    });
  }

  async update(
    id: number,
    force: boolean = false,
  ): Promise<AnimepaheWithRelations> {
    if (force) {
      const animepahe = await this.findAnimepahe(id);

      if (!animepahe) {
        throw new Error('Animepahe not found');
      }

      animepahe.alId = id;

      return await this.saveAnimepahe(animepahe);
    }

    const existingAnimepahe = await this.getAnimepaheByAnilist(id);

    if (!existingAnimepahe) {
      throw new Error('No animepahe');
    }

    const animepahe = await animepaheFetch.fetchAnimepahe(existingAnimepahe.id);

    if (!animepahe) {
      throw new Error('Animepahe not found');
    }

    if (existingAnimepahe.episodes.length === animepahe.episodes?.length) {
      throw new Error('Nothing to update');
    }

    animepahe.alId = id;

    return await this.saveAnimepahe(animepahe);
  }

  async findAnimepahe(id: number): Promise<IAnimeInfo> {
    const anilist = await this.anilist.getMappingAnilist(id);

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const searchResult = await animepaheFetch.searchAnimepahe(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.results.map((result) => ({
      title: result.title,
      id: result.id,
      type: result.type,
      year:
        typeof result.releaseDate === 'string'
          ? parseInt(result.releaseDate)
          : result.releaseDate,
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
        const data = await animepaheFetch.fetchAnimepahe(bestMatch.result.id);

        const anilistLink = data.externalLinks?.find(
          (e) => e.sourceName === 'AniList',
        );

        const malLink = data.externalLinks?.find((e) => e.sourceName === 'MAL');

        if (
          (anilistLink && Number(anilistLink.id) === anilist.id) ||
          (malLink && Number(malLink.id) === anilist.idMal)
        ) {
          data.alId = id;
          return data;
        } else {
          exclude.push(bestMatch.result.id);
          continue;
        }
      }
    }

    throw new Error('Animepahe not found');
  }
}
