import { parseNumber, parseString } from 'src/helpers/parsers';
import { TmdbImage, TmdbInfoResult, TmdbTranslation } from './types';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';
import { getKey, Redis } from 'src/helpers/redis.util';
import { ArtworkEntry, unifyArtworkType } from '../../meta/helpers/meta.dto';
import { Anilist } from '../anilist';
import { TmdbUtils } from './helpers/tmdb.utils';
import { TmdbFetch } from './helpers/tmdb.fetch';
import { Meta } from '../../meta';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';
import { AnimeUtils } from '../../helpers';

class TmdbModule extends ProviderModule<TmdbInfoResult> {
  override readonly name = 'TMDB';

  override async getInfo(id: number): Promise<TmdbInfoResult> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<TmdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const meta = await Meta.fetchOrCreate(id).catch(() => null);

    const tmdbId = parseNumber(meta?.mappings.find((m) => m.source_name === this.name.toLowerCase())?.source_id);

    let info: TmdbInfoResult;

    const al = await Anilist.getInfo(id);
    const type = TmdbUtils.getTmdbTypeByAl(al.format);

    if (tmdbId) {
      info = type === 'MOVIE' ? await TmdbFetch.fetchMovie(tmdbId) : await TmdbFetch.fetchSeries(tmdbId);
    } else {
      info = await this.find(id);

      await Meta.update({
        id,
        mappings: {
          id: parseString(info.id)!,
          name: this.name
        }
      });
    }

    const images =
      type === 'MOVIE' ? await TmdbFetch.getMovieImages(info.id) : await TmdbFetch.getSeriesImages(info.id);

    const artworks: ArtworkEntry[] = images.map((i) => {
      return {
        url: i.file_path,
        large: TmdbUtils.getImage('original', i.file_path) ?? undefined,
        height: i.height,
        width: i.width,
        iso_639_1: normalize_iso_639_1(i.iso_639_1) ?? undefined,
        medium: TmdbUtils.getImage('w780', i.file_path) ?? undefined,
        type: unifyArtworkType(i.type),
        source: this.name
      } satisfies ArtworkEntry;
    });

    if (artworks) {
      await Meta.update({ id, artworks });
    }

    if (info.poster_path) {
      await Meta.update({
        id,
        images: {
          url: info.poster_path,
          small: TmdbUtils.getImage('w300', info.poster_path),
          medium: TmdbUtils.getImage('w780', info.poster_path),
          large: TmdbUtils.getImage('original', info.poster_path),
          type: 'poster',
          source: this.name
        }
      });
    }

    if (info.backdrop_path) {
      await Meta.update({
        id,
        images: {
          url: info.backdrop_path,
          small: TmdbUtils.getImage('w300', info.backdrop_path),
          medium: TmdbUtils.getImage('w780', info.backdrop_path),
          large: TmdbUtils.getImage('original', info.backdrop_path),
          type: 'background',
          source: this.name
        }
      });
    }

    await Redis.set(key, info);

    return info;
  }

  async getTranslations(id: number): Promise<TmdbTranslation[]> {
    const key = getKey(this.name, 'info', 'translations', id);

    const cached = await Redis.get<TmdbTranslation[]>(key);

    if (cached) {
      return cached;
    }

    const tmdb = await this.getInfo(id);

    const al = await Anilist.getInfo(id);
    const type = TmdbUtils.getTmdbTypeByAl(al.format);

    const translations =
      type == 'MOVIE'
        ? await TmdbFetch.fetchMovieTranslations(tmdb.id)
        : await TmdbFetch.fetchSeriesTranslations(tmdb.id);

    await Redis.set(key, translations);

    return translations;
  }

  async getEpisodeTranslations(show_id?: number, season?: number, episode?: number): Promise<TmdbTranslation[]> {
    if (!show_id || !season || !episode) {
      return [];
    }

    const key = getKey(this.name, 'info', 'translations', show_id, season, episode);

    const cached = await Redis.get<TmdbTranslation[]>(key);

    if (cached) {
      return cached;
    }

    const translations = await TmdbFetch.fetchEpisodeTranslations(show_id, season, episode);

    await Redis.set(key, translations);

    return translations;
  }

  async getEpisodeImages(show_id?: number, season?: number, episode?: number): Promise<TmdbImage[]> {
    if (!show_id || !season || !episode) {
      return [];
    }

    const key = getKey(this.name, 'info', 'images', show_id, season, episode);

    const cached = await Redis.get<TmdbImage[]>(key);

    if (cached) {
      return cached;
    }

    const images = await TmdbFetch.fetchEpisodeImages(show_id, season, episode);

    await Redis.set(key, images);

    return images;
  }

  async find(id: number): Promise<TmdbInfoResult> {
    const al = await Anilist.getInfo(id);

    if (!al) {
      throw new Error('Anilist not found');
    }

    const type = TmdbUtils.getTmdbTypeByAl(al.format);

    const title = AnimeUtils.pickBestTitle(al);

    if (!title) {
      throw new Error('No title found');
    }

    const search =
      type === 'MOVIE'
        ? await TmdbFetch.searchMovie(deepCleanTitle(title))
        : await TmdbFetch.searchSeries(deepCleanTitle(title));

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
  }
}

const Tmdb = new TmdbModule();

export { Tmdb, TmdbModule };
