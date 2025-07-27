import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';
import { Prisma } from '@prisma/client';
import { anilibriaFetch } from './anilibria.fetch.service.js';
import { normalizeMediaSeason } from '../../anilist/filter/Filter.js';
import { AnilibriaEntry } from '../types/types.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import { getAnilibriaData } from '../utils/anilibria-helper.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';

@Injectable()
export class AnilibriaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
    private readonly mappings: MappingsService,
  ) {}

  async getInfoByAnilist<T extends Prisma.AnilibriaSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.AnilibriaGetPayload<{ select: T }>> {
    const existing = await this.prisma.anilibria.findUnique({
      where: { anilist_id: id },
      select,
    });

    if (existing) {
      return existing as Prisma.AnilibriaGetPayload<{ select: T }>;
    }

    const anilibria = await this.findByAnilist(id);
    if (!anilibria) throw new NotFoundException('Anilibria not found');

    await this.mappings.updateAniZipMappings(id, { anilibriaId: anilibria.id });

    return this.save(anilibria, select);
  }

  async save<T extends Prisma.AnilibriaSelect>(
    anilibria: AnilibriaEntry,
    select?: T,
  ): Promise<Prisma.AnilibriaGetPayload<{ select: T }>> {
    return (await this.prisma.anilibria.upsert({
      where: { id: anilibria.id },
      update: getAnilibriaData(anilibria),
      create: getAnilibriaData(anilibria),
      select,
    })) as Prisma.AnilibriaGetPayload<{ select: T }>;
  }

  async update<T extends Prisma.AnilibriaSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.AnilibriaGetPayload<{ select: T }>> {
    const anilibria = await this.findByAnilist(id);
    if (!anilibria) throw new NotFoundException('Anilibria not found');

    await this.mappings.updateAniZipMappings(id, { anilibriaId: anilibria.id });

    return this.save(anilibria, select);
  }

  async findByAnilist(id: number): Promise<AnilibriaEntry> {
    const anilist = await this.anilist.getMappingAnilist(id);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const searchResult = await anilibriaFetch.search(
      deepCleanTitle(anilist.title?.romaji ?? ''),
      anilist.seasonYear,
      normalizeMediaSeason(anilist.season),
    );

    const results = searchResult.map((result) => ({
      titles: [result.name.english, result.name.alternative, result.name.main],
      id: result.id,
      type: result.type.value,
      year: result.year,
      episodes: result.episodes_total,
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
      const data = await anilibriaFetch.fetchInfo(bestMatch.result.id);
      data.anilistId = id;
      return data;
    }

    throw new NotFoundException('Animekai not found');
  }
}
