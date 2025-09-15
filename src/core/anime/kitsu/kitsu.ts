import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import { KitsuAnime } from './types';
import { NotFoundError } from 'src/helpers/errors';
import { mappingSelect } from '../anilist/types';
import anilist from '../anilist/anilist';
import kitsuFetch from './helpers/kitsu.fetch';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { parseNumber } from 'src/helpers/parsers';
import { findEpisodeCount } from '../anilist/helpers/anilist.utils';
import { getKitsuPrismaData } from './helpers/kitsu.prisma';
import mappings from '../mappings/mappings';

class Kitsu {
  async getInfo<T extends Prisma.KitsuSelect>(
    id: number,
    select?: T
  ): Promise<Prisma.KitsuGetPayload<{ select: T }>> {
    const existing = await prisma.kitsu.findUnique({
      where: { idAl: id },
      select
    });

    if (existing) {
      return existing as Prisma.KitsuGetPayload<{ select: T }>;
    }

    const mapping = await mappings.getMappings(id);

    const kitsuId = mapping.mappings.find((m) => m.sourceName === 'kitsu')?.sourceId;

    if (kitsuId) {
      const kitsu = await kitsuFetch.fetchInfo(kitsuId);

      return this.save(kitsu, select);
    } else {
      const kitsu = await this.find(id);

      await mappings.add(id, {
        id: kitsu.id,
        name: 'kitsu'
      });

      return this.save(kitsu, select);
    }
  }

  async save<T extends Prisma.KitsuSelect>(
    data: KitsuAnime,
    select?: T
  ): Promise<Prisma.KitsuGetPayload<{ select: T }>> {
    return prisma.kitsu.upsert({
      where: { id: data.id },
      create: getKitsuPrismaData(data),
      update: getKitsuPrismaData(data),
      select
    }) as Prisma.KitsuGetPayload<{ select: T }>;
  }

  async find(id: number): Promise<KitsuAnime> {
    const al = await anilist.getAndJustSave(id, mappingSelect);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    const search = await kitsuFetch.search(deepCleanTitle(al.title?.romaji ?? ''));

    const results = search.map((result) => {
      const startDate = result.attributes.startDate;
      const year = startDate ? parseNumber(startDate.split('-')[0]) : undefined;

      return {
        titles: [result.attributes.titles.en, result.attributes.titles.en_jp, result.attributes.titles.ja_jp],
        id: result.id,
        year,
        episodes: result.attributes.episodeCount
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
      year: al.seasonYear ?? undefined,
      episodes: findEpisodeCount(al)
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await kitsuFetch.fetchInfo(bestMatch.result.id);
      data.idAl = id;
      return data;
    }

    throw new NotFoundError('Kitsu not found');
  }
}

export default new Kitsu();
