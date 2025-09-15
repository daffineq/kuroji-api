import { Prisma } from '@prisma/client';
import mappings from '../mappings/mappings';
import { mappingsSelect } from '../mappings/types';
import prisma from 'src/lib/prisma';
import { parseNumber, parseString } from 'src/helpers/parsers';
import tmdbFetch from './helpers/tmdb.fetch';
import anilist from '../anilist/anilist';
import { getTmdbTypeByAl } from './helpers/tmdb.utils';
import { TmdbInfoResult } from './types';
import { getTmdbPrismaData } from './helpers/tmdb.prisma';
import { mappingSelect } from '../anilist/types';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';

class Tmdb {
  async getInfo<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const mapping = await mappings.getMappings(id, mappingsSelect);

    const tmdbId = parseNumber(mapping.mappings.find((m) => m.sourceName === 'tmdb')?.sourceId);

    if (tmdbId) {
      const existing = await prisma.tmdb.findUnique({
        where: { id: tmdbId },
        select
      });

      if (existing) {
        return existing as Prisma.TmdbGetPayload<{ select: T }>;
      }

      const al = await anilist.getAndJustSave(id, { format: true });
      const type = getTmdbTypeByAl(al.format);

      const tmdb = type === 'MOVIE' ? await tmdbFetch.fetchMovie(tmdbId) : await tmdbFetch.fetchSeries(tmdbId);

      return this.save(tmdb, select);
    } else {
      const tmdb = await this.find(id);

      await mappings.add(id, {
        id: parseString(tmdb.id)!,
        name: 'tmdb'
      });

      return this.save(tmdb, select);
    }
  }

  async save<T extends Prisma.TmdbSelect>(
    data: TmdbInfoResult,
    select?: T
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    return prisma.tmdb.upsert({
      where: { id: data.id },
      create: getTmdbPrismaData(data),
      update: getTmdbPrismaData(data),
      select
    }) as Prisma.TmdbGetPayload<{ select: T }>;
  }

  async find(id: number): Promise<TmdbInfoResult> {
    const al = await anilist.getAndJustSave(id, mappingSelect);

    if (!al) {
      throw new Error('Anilist not found');
    }

    const type = getTmdbTypeByAl(al.format);

    const search =
      type === 'MOVIE'
        ? await tmdbFetch.searchMovie(deepCleanTitle(al.title?.native ?? ''))
        : await tmdbFetch.searchSeries(deepCleanTitle(al.title?.native ?? ''));

    const results = search.map((result) => {
      return {
        titles: [result.original_name, result.original_title, result.name, result.title],
        id: result.id
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms]
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data =
        type === 'MOVIE'
          ? await tmdbFetch.fetchMovie(bestMatch.result.id)
          : await tmdbFetch.fetchSeries(bestMatch.result.id);
      return data;
    }

    throw new NotFoundError('Tmdb not found');
  }
}

export default new Tmdb();
