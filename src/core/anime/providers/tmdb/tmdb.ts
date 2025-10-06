import mappings from '../../mappings/mappings';
import { mappingsSelect } from '../../mappings/types';
import { parseNumber, parseString } from 'src/helpers/parsers';
import tmdbFetch from './helpers/tmdb.fetch';
import { getImage, getTmdbTypeByAl } from './helpers/tmdb.utils';
import { TmdbInfoResult } from './types';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';
import { getKey, Redis } from 'src/helpers/redis.util';
import anilist from '../anilist/anilist';

class Tmdb {
  async getInfo(id: number): Promise<TmdbInfoResult> {
    const key = getKey('tmdb', 'info', id);

    const cached = await Redis.get<TmdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const mapping = await mappings.initOrGet(id, mappingsSelect).catch(() => null);

    const tmdbId = parseNumber(mapping?.mappings.find((m) => m.sourceName === 'tmdb')?.sourceId);

    var tmdb: TmdbInfoResult;

    if (tmdbId) {
      const al = await anilist.getInfo(id);
      const type = getTmdbTypeByAl(al.format);

      tmdb = type === 'MOVIE' ? await tmdbFetch.fetchMovie(tmdbId) : await tmdbFetch.fetchSeries(tmdbId);
    } else {
      tmdb = await this.find(id);

      await mappings.addMapping(id, {
        id: parseString(tmdb.id)!,
        name: 'tmdb'
      });
    }

    if (tmdb.poster_path) {
      await mappings.addSinglePoster(id, {
        url: tmdb.poster_path,
        small: getImage('w300', tmdb.poster_path),
        medium: getImage('w780', tmdb.poster_path),
        large: getImage('original', tmdb.poster_path),
        source: 'tmdb'
      });
    }

    if (tmdb.backdrop_path) {
      await mappings.addSingleBanner(id, {
        url: tmdb.backdrop_path,
        small: getImage('w300', tmdb.backdrop_path),
        medium: getImage('w780', tmdb.backdrop_path),
        large: getImage('original', tmdb.backdrop_path),
        source: 'tmdb'
      });
    }

    await Redis.set(key, tmdb);

    return tmdb;
  }

  async find(id: number): Promise<TmdbInfoResult> {
    const al = await anilist.getInfo(id);

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

const tmdb = new Tmdb();

export default tmdb;
