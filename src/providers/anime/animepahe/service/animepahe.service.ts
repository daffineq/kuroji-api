import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.js';
import { IAnimeInfo } from '@consumet/extensions';
import { getAnimePaheData } from '../utils/animepahe-helper.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { animepaheFetch } from './animepahe.fetch.service.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { Prisma } from '@prisma/client';
import { animepaheSelect } from '../types/types.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';

@Injectable()
export class AnimepaheService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
    private readonly mappings: MappingsService,
  ) {}

  async getInfoByAnilist<T extends Prisma.AnimepaheSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.AnimepaheGetPayload<{ select: T }>> {
    const existingAnimepahe = await this.prisma.animepahe.findFirst({
      where: { alId: id },
      select,
    });

    if (existingAnimepahe) {
      return existingAnimepahe as Prisma.AnimepaheGetPayload<{ select: T }>;
    }

    const animepahe = await this.findByAnilist(id);
    if (!animepahe) throw new NotFoundException(`Animepahe not found`);

    await this.mappings.updateAniZipMappings(id, { animepaheId: animepahe.id });

    return this.save(animepahe, select);
  }

  async save<T extends Prisma.AnimepaheSelect>(
    animepahe: IAnimeInfo,
    select?: T,
  ): Promise<Prisma.AnimepaheGetPayload<{ select: T }>> {
    return (await this.prisma.animepahe.upsert({
      where: { id: animepahe.id },
      update: getAnimePaheData(animepahe),
      create: getAnimePaheData(animepahe),
      select,
    })) as Prisma.AnimepaheGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.AnimepaheSelect>(
    id: number,
    force: boolean = false,
    select?: T,
  ): Promise<Prisma.AnimepaheGetPayload<{ select: T }>> {
    if (force) {
      const animepahe = await this.findByAnilist(id);
      if (!animepahe) throw new NotFoundException('Animepahe not found');

      animepahe.alId = id;

      return await this.save(animepahe, select);
    }

    const existingAnimepahe = await this.getInfoByAnilist(id, animepaheSelect);
    if (!existingAnimepahe) throw new NotFoundException('No animepahe found');

    const animepahe = await animepaheFetch.fetchInfo(existingAnimepahe.id);
    if (!animepahe) throw new NotFoundException('Animepahe not found');

    if (existingAnimepahe.episodes.length === animepahe.episodes?.length)
      throw new NotFoundException('Nothing to update');

    animepahe.alId = id;

    return await this.save(animepahe);
  }

  async findByAnilist(id: number): Promise<IAnimeInfo> {
    const anilist = await this.anilist.getMappingAnilist(id);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const searchResult = await animepaheFetch.search(
      deepCleanTitle(anilist.title?.romaji ?? ''),
    );

    const results = searchResult.results.map((result) => ({
      titles: [result.title as string],
      id: result.id,
      type: result.type,
      year:
        typeof result.releaseDate === 'string'
          ? parseInt(result.releaseDate)
          : result.releaseDate,
    }));

    const searchCriteria: ExpectAnime = {
      titles: [
        anilist.title?.romaji,
        anilist.title?.english,
        anilist.title?.native,
        ...anilist.synonyms,
      ],
      year: anilist.seasonYear ?? undefined,
      type: anilist.format ?? undefined,
      episodes: findEpisodeCount(anilist),
    };

    const exclude: string[] = [];

    for (let i = 0; i < 3; i++) {
      const bestMatch = findBestMatch(searchCriteria, results, exclude);

      if (bestMatch) {
        const data = await animepaheFetch.fetchInfo(bestMatch.result.id);

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

    throw new NotFoundException('Animepahe not found');
  }
}
