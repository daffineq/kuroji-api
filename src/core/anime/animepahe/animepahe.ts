import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import { mappingSelect } from '../anilist/types';
import { NotFoundError } from 'src/helpers/errors';
import animepaheFetch from './helpers/animepahe.fetch';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { findEpisodeCount } from '../anilist/helpers/anilist.utils';
import { AnimepaheInfo } from 'src/core/types';
import { getAnimepahePrismaData } from './helpers/animepahe.prisma';
import anilist from '../anilist/anilist';
import mappings from '../mappings/mappings';

class Animepahe {
  async getInfo<T extends Prisma.AnimepaheSelect>(
    id: number,
    select?: T
  ): Promise<Prisma.AnimepaheGetPayload<{ select: T }>> {
    const existing = await prisma.animepahe.findUnique({
      where: { idAl: id },
      select
    });

    if (existing) {
      return existing as Prisma.AnimepaheGetPayload<{ select: T }>;
    }

    const animepahe = await this.find(id);

    await mappings.add(id, {
      id: animepahe.id as string,
      name: 'animepahe'
    });

    return this.save(animepahe, select);
  }

  async save<T extends Prisma.AnimepaheSelect>(
    data: AnimepaheInfo,
    select?: T
  ): Promise<Prisma.AnimepaheGetPayload<{ select: T }>> {
    return prisma.animepahe.upsert({
      where: { id: data.id as string },
      update: getAnimepahePrismaData(data),
      create: getAnimepahePrismaData(data),
      select
    }) as Prisma.AnimepaheGetPayload<{ select: T }>;
  }

  async find(id: number) {
    const al = await anilist.getAndJustSave(id, mappingSelect);

    if (!al) throw new NotFoundError('Anilist not found');

    const search = await animepaheFetch.search(deepCleanTitle(al.title?.romaji ?? ''));

    const results = search.map((result) => ({
      titles: [result.title as string],
      id: result.id as string,
      type: result.metadata?.type ?? undefined,
      year: result.metadata?.year ?? undefined
    }));

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
      year: al.seasonYear ?? undefined,
      type: al.format ?? undefined,
      episodes: findEpisodeCount(al)
    };

    const exclude: string[] = [];

    for (let i = 0; i < 3; i++) {
      const bestMatch = findBestMatch(searchCriteria, results, exclude);

      if (bestMatch) {
        const data = await animepaheFetch.fetchInfo(bestMatch.result.id);

        if ((data.idAl && Number(data.idAl) === al.id) || (data.idMal && Number(data.idMal) === al.idMal)) {
          data.idAl = id;
          return data;
        } else {
          exclude.push(bestMatch.result.id);
          continue;
        }
      }
    }

    throw new NotFoundError('Animepahe not found');
  }
}

export default new Animepahe();
