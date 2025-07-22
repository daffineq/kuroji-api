import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { IAnimeInfo } from '@consumet/extensions';
import { getAnimekaiData } from '../utils/animekai-helper.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { animekaiFetch } from './animekai.fetch.service.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { Prisma } from '@prisma/client';
import { animeKaiSelect } from '../types/types.js';

@Injectable()
export class AnimekaiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
  ) {}

  async getAnimekaiByAnilist<T extends Prisma.AnimeKaiSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.AnimeKaiGetPayload<{ select: T }>> {
    const existingAnimekai = await this.prisma.animeKai.findFirst({
      where: { anilistId: id },
      select,
    });

    if (existingAnimekai) {
      return existingAnimekai as Prisma.AnimeKaiGetPayload<{ select: T }>;
    }

    const animekai = await this.findAnimekai(id);
    return this.saveAnimekai(animekai, select);
  }

  async saveAnimekai<T extends Prisma.AnimeKaiSelect>(
    animekai: IAnimeInfo,
    select?: T,
  ): Promise<Prisma.AnimeKaiGetPayload<{ select: T }>> {
    return (await this.prisma.animeKai.upsert({
      where: { id: animekai.id },
      update: getAnimekaiData(animekai),
      create: getAnimekaiData(animekai),
      select,
    })) as Prisma.AnimeKaiGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.AnimeKaiSelect>(
    id: number,
    force: boolean = false,
    select?: T,
  ): Promise<Prisma.AnimeKaiGetPayload<{ select: T }>> {
    if (force) {
      const animekai = await this.findAnimekai(id);
      if (!animekai) throw new NotFoundException('Animekai not found');

      animekai.anilistId = id;

      return await this.saveAnimekai(animekai, select);
    }

    const existingAnimekai = await this.getAnimekaiByAnilist(
      id,
      animeKaiSelect,
    );
    if (!existingAnimekai) throw new Error('Animekai not found');

    const animekai = await animekaiFetch.fetchAnimekai(existingAnimekai.id);
    if (!animekai) throw new NotFoundException('Animekai not found');

    if (existingAnimekai.episodes.length === animekai.episodes?.length)
      throw new NotFoundException('Nothing to update');

    animekai.anilistId = id;

    return await this.saveAnimekai(animekai);
  }

  async findAnimekai(id: number): Promise<IAnimeInfo> {
    const anilist = await this.anilist.getMappingAnilist(id);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const searchResult = await animekaiFetch.searchAnimekai(
      deepCleanTitle(anilist.title?.romaji ?? ''),
    );

    const results = searchResult.results.map((result) => ({
      titles: [result.title as string],
      id: result.id,
      type: result.type,
    }));

    const searchCriteria: ExpectAnime = {
      titles: [
        anilist.title?.english,
        anilist.title?.native,
        anilist.title?.romaji,
        ...anilist.synonyms,
      ],
      year: anilist.seasonYear ?? undefined,
      type: anilist.format ?? undefined,
      episodes: findEpisodeCount(anilist),
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await animekaiFetch.fetchAnimekai(bestMatch.result.id);
      data.anilistId = id;
      return data;
    }

    throw new NotFoundException('Animekai not found');
  }
}
