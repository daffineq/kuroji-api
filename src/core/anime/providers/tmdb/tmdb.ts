import { parseNumber, parseString } from 'src/helpers/parsers';
import { TmdbImage, TmdbInfoResult, TmdbTranslation } from './types';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';
import { getKey, Redis } from 'src/helpers/redis.util';
import { Anilist } from '../anilist';
import { TmdbUtils } from './helpers/tmdb.utils';
import { TmdbFetch } from './helpers/tmdb.fetch';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';
import { AnimeUtils } from '../../helpers';
import { Anime } from '../../anime';
import { AnimeArtworkPayload } from '../../types';

class TmdbModule extends ProviderModule<TmdbInfoResult> {
  override readonly name = 'TMDB';

  override async getInfo(id: number): Promise<TmdbInfoResult> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<TmdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const resolved = await this.resolveInfo(id);

    const images =
      resolved.type === 'movie'
        ? await TmdbFetch.getMovieImages(resolved.info.id)
        : await TmdbFetch.getSeriesImages(resolved.info.id);

    const artworks: AnimeArtworkPayload[] = images.map((i) => {
      return {
        url: i.file_path,
        large: TmdbUtils.getImage('original', i.file_path) ?? undefined,
        height: i.height,
        width: i.width,
        iso_639_1: normalize_iso_639_1(i.iso_639_1) ?? undefined,
        medium: TmdbUtils.getImage('w780', i.file_path) ?? undefined,
        type: AnimeUtils.unifyArtworkType(i.type),
        source: this.name
      } satisfies AnimeArtworkPayload;
    });

    if (artworks) {
      await Anime.upsert({ id, artworks });
    }

    if (resolved.info.poster_path) {
      await Anime.upsert({
        id,
        images: {
          url: resolved.info.poster_path,
          small: TmdbUtils.getImage('w300', resolved.info.poster_path),
          medium: TmdbUtils.getImage('w780', resolved.info.poster_path),
          large: TmdbUtils.getImage('original', resolved.info.poster_path),
          type: 'poster',
          source: this.name
        }
      });
    }

    if (resolved.info.backdrop_path) {
      await Anime.upsert({
        id,
        images: {
          url: resolved.info.backdrop_path,
          small: TmdbUtils.getImage('w300', resolved.info.backdrop_path),
          medium: TmdbUtils.getImage('w780', resolved.info.backdrop_path),
          large: TmdbUtils.getImage('original', resolved.info.backdrop_path),
          type: 'background',
          source: this.name
        }
      });
    }

    await Redis.set(key, resolved.info);

    return resolved.info;
  }

  async resolveInfo(id: number): Promise<{
    info: TmdbInfoResult;
    type: string;
  }> {
    const idMap = parseNumber(await Anime.map(id, this.name));

    const al = await Anilist.getInfo(id);
    const type = AnimeUtils.getType(al.format);

    if (idMap) {
      const info = type === 'movie' ? await TmdbFetch.fetchMovie(idMap) : await TmdbFetch.fetchSeries(idMap);

      return {
        info,
        type
      };
    } else {
      const info = await this.find(id);

      await Anime.upsert({
        id,
        links: {
          link: parseString(info.id)!,
          label: this.name,
          type: 'mapping'
        }
      });

      return {
        info,
        type
      };
    }
  }

  async getTranslations(id: number): Promise<TmdbTranslation[]> {
    const key = getKey(this.name, 'info', 'translations', id);

    const cached = await Redis.get<TmdbTranslation[]>(key);

    if (cached) {
      return cached;
    }

    const tmdb = await this.getInfo(id);

    const al = await Anilist.getInfo(id);
    const type = AnimeUtils.getType(al.format);

    const translations =
      type == 'movie'
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

    const type = AnimeUtils.getType(al.format);

    const title = AnimeUtils.pickBestTitle(al);

    if (!title) {
      throw new Error('No title found');
    }

    const search =
      type === 'movie'
        ? await TmdbFetch.searchMovie(deepCleanTitle(title))
        : await TmdbFetch.searchSeries(deepCleanTitle(title));

    const results: ExpectAnime[] = search.map((result) => {
      return {
        titles: [result.original_name, result.original_title, result.name, result.title],
        id: result.id,
        language: result.original_language
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
      language: AnimeUtils.getLanguage(al.countryOfOrigin ?? 'JP') ?? 'jp'
    };

    const bestMatch = findBestMatch(searchCriteria, results);
    const bestMatchId = parseNumber(bestMatch?.id);

    if (bestMatchId) {
      const data =
        type === 'movie' ? await TmdbFetch.fetchMovie(bestMatchId) : await TmdbFetch.fetchSeries(bestMatchId);
      return data;
    }

    throw new NotFoundError('Tmdb not found');
  }
}

const Tmdb = new TmdbModule();

console.log(await Tmdb.find(21));

export { Tmdb, TmdbModule };
