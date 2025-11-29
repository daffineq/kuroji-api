import meta from '../../meta/meta';
import { metaSelect } from '../../meta/types';
import { parseNumber, parseString } from 'src/helpers/parsers';
import tmdbFetch from './helpers/tmdb.fetch';
import { getImage, getTmdbTypeByAl } from './helpers/tmdb.utils';
import { TmdbInfoResult } from './types';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';
import { getKey, Redis } from 'src/helpers/redis.util';
import anilist from '../anilist/anilist';
import { ArtworkEntry } from '../../meta/helpers/meta.dto';

class Tmdb {
  async getInfo(id: number): Promise<TmdbInfoResult> {
    const key = getKey('tmdb', 'info', id);

    const cached = await Redis.get<TmdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const mapping = await meta.fetchOrCreate(id, metaSelect).catch(() => null);

    const tmdbId = parseNumber(mapping?.mappings.find((m) => m.sourceName === 'tmdb')?.sourceId);

    var tmdb: TmdbInfoResult;

    const al = await anilist.getInfo(id);
    const type = getTmdbTypeByAl(al.format);

    if (tmdbId) {
      tmdb = type === 'MOVIE' ? await tmdbFetch.fetchMovie(tmdbId) : await tmdbFetch.fetchSeries(tmdbId);
    } else {
      tmdb = await this.find(id);

      await meta.addMapping(id, {
        id: parseString(tmdb.id)!,
        name: 'tmdb'
      });
    }

    const images =
      type === 'MOVIE' ? await tmdbFetch.getMovieImages(tmdb.id) : await tmdbFetch.getSeriesImages(tmdb.id);

    const artworks: ArtworkEntry[] = images.map((i) => {
      return {
        url: i.file_path,
        image: getImage('original', i.file_path) ?? undefined,
        height: i.height,
        width: i.width,
        language: i.iso_639_1,
        thumbnail: getImage('w780', i.file_path) ?? undefined,
        type: i.type,
        source: 'tmdb'
      };
    });

    if (artworks) {
      await meta.addArtworks(id, artworks);
    }

    if (tmdb.poster_path) {
      await meta.addSingleImage(id, {
        url: tmdb.poster_path,
        small: getImage('w300', tmdb.poster_path),
        medium: getImage('w780', tmdb.poster_path),
        large: getImage('original', tmdb.poster_path),
        type: 'poster',
        source: 'tmdb'
      });
    }

    if (tmdb.backdrop_path) {
      await meta.addSingleImage(id, {
        url: tmdb.backdrop_path,
        small: getImage('w300', tmdb.backdrop_path),
        medium: getImage('w780', tmdb.backdrop_path),
        large: getImage('original', tmdb.backdrop_path),
        type: 'banner',
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
