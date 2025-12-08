import { metaSelect } from '../../meta/types';
import { parseNumber, parseString } from 'src/helpers/parsers';
import { TmdbInfoResult, TmdbTranslation } from './types';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';
import { getKey, Redis } from 'src/helpers/redis.util';
import { ArtworkEntry } from '../../meta/helpers/meta.dto';
import { Anilist } from '../anilist';
import { TmdbUtils } from './helpers/tmdb.utils';
import { TmdbFetch } from './helpers/tmdb.fetch';
import { Meta } from '../../meta';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { prisma } from 'src/lib/prisma';

const getInfo = async (id: number): Promise<TmdbInfoResult> => {
  const key = getKey('tmdb', 'info', id);

  const cached = await Redis.get<TmdbInfoResult>(key);

  if (cached) {
    return cached;
  }

  const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

  const tmdbId = parseNumber(meta?.mappings.find((m) => m.source_name === 'tmdb')?.source_id);

  var tmdb: TmdbInfoResult;

  const al = await Anilist.getInfo(id);
  const type = TmdbUtils.getTmdbTypeByAl(al.format);

  if (tmdbId) {
    tmdb = type === 'MOVIE' ? await TmdbFetch.fetchMovie(tmdbId) : await TmdbFetch.fetchSeries(tmdbId);
  } else {
    tmdb = await find(id);

    await Meta.addMapping(id, {
      id: parseString(tmdb.id)!,
      name: 'tmdb'
    });
  }

  const images =
    type === 'MOVIE' ? await TmdbFetch.getMovieImages(tmdb.id) : await TmdbFetch.getSeriesImages(tmdb.id);

  const artworks: ArtworkEntry[] = images.map((i) => {
    return {
      url: i.file_path,
      image: TmdbUtils.getImage('original', i.file_path) ?? undefined,
      height: i.height,
      width: i.width,
      iso_639_1: normalize_iso_639_1(i.iso_639_1) ?? undefined,
      thumbnail: TmdbUtils.getImage('w780', i.file_path) ?? undefined,
      type: i.type,
      source: 'tmdb'
    };
  });

  if (artworks) {
    await Meta.addArtworks(id, artworks);
  }

  if (tmdb.poster_path) {
    await Meta.addSingleImage(id, {
      url: tmdb.poster_path,
      small: TmdbUtils.getImage('w300', tmdb.poster_path),
      medium: TmdbUtils.getImage('w780', tmdb.poster_path),
      large: TmdbUtils.getImage('original', tmdb.poster_path),
      type: 'poster',
      source: 'tmdb'
    });
  }

  if (tmdb.backdrop_path) {
    await Meta.addSingleImage(id, {
      url: tmdb.backdrop_path,
      small: TmdbUtils.getImage('w300', tmdb.backdrop_path),
      medium: TmdbUtils.getImage('w780', tmdb.backdrop_path),
      large: TmdbUtils.getImage('original', tmdb.backdrop_path),
      type: 'banner',
      source: 'tmdb'
    });
  }

  await Redis.set(key, tmdb);

  return tmdb;
};

const getTranslations = async (id: number): Promise<TmdbTranslation[]> => {
  const key = getKey('tmdb', 'info', 'translations', id);

  const cached = await Redis.get<TmdbTranslation[]>(key);

  if (cached) {
    return cached;
  }

  const tmdb = await getInfo(id);

  const al = await Anilist.getInfo(id);
  const type = TmdbUtils.getTmdbTypeByAl(al.format);

  const translations =
    type == 'MOVIE'
      ? await TmdbFetch.fetchMovieTranslations(tmdb.id)
      : await TmdbFetch.fetchSeriesTranslations(tmdb.id);

  await Redis.set(key, translations);

  return translations;
};

const getEpisodeTranslations = async (id: number): Promise<TmdbTranslation[]> => {
  const key = getKey('tmdb', 'info', 'translations', id);

  const cached = await Redis.get<TmdbTranslation[]>(key);

  if (cached) {
    return cached;
  }

  const episode = await prisma.episode.findUnique({
    where: { id }
  });

  if (!episode || !episode.tmdb_show_id || !episode.season_number || !episode.number) {
    return [];
  }

  const translations = await TmdbFetch.fetchEpisodeTranslations(
    episode.tmdb_show_id,
    episode.season_number,
    episode.number
  );

  await Redis.set(key, translations);

  return translations;
};

const find = async (id: number): Promise<TmdbInfoResult> => {
  const al = await Anilist.getInfo(id);

  if (!al) {
    throw new Error('Anilist not found');
  }

  const type = TmdbUtils.getTmdbTypeByAl(al.format);

  const search =
    type === 'MOVIE'
      ? await TmdbFetch.searchMovie(deepCleanTitle(al.title?.native ?? ''))
      : await TmdbFetch.searchSeries(deepCleanTitle(al.title?.native ?? ''));

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
        ? await TmdbFetch.fetchMovie(bestMatch.result.id)
        : await TmdbFetch.fetchSeries(bestMatch.result.id);
    return data;
  }

  throw new NotFoundError('Tmdb not found');
};

const Tmdb = {
  getInfo,
  find
};

export { Tmdb };
