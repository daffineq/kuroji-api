import { parseNumber, parseString } from 'src/helpers/parsers';
import { TmdbImage, TmdbInfoResult, TmdbTranslation } from './types';
import { getSearchTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { NotFoundError } from 'src/helpers/errors';
import { getKey, Redis } from 'src/helpers/redis.util';
import { TmdbUtils } from './helpers/tmdb.utils';
import { TmdbFetch } from './helpers/tmdb.fetch';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';
import { AnimeUtils } from '../../helpers';
import { Anime } from '../../anime';
import { AnimeArtworkPayload, AnimeTranslationPayload } from '../../types';
import { Config } from 'src/config';

class TmdbModule extends ProviderModule<TmdbInfoResult> {
  override readonly name = 'TMDB';

  override async getInfo(id: number): Promise<TmdbInfoResult> {
    if (!Config.use_tmdb) {
      throw new Error(`${this.name} disabled`);
    }

    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<TmdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const resolved = await this.resolveInfo(id);

    const imagesPromise =
      resolved.type === 'movie'
        ? TmdbFetch.fetchMovieImages(resolved.info.id)
        : TmdbFetch.fetchSeriesImages(resolved.info.id);

    const translationsPromise =
      resolved.type === 'movie'
        ? TmdbFetch.fetchMovieTranslations(resolved.info.id)
        : TmdbFetch.fetchSeriesTranslations(resolved.info.id);

    const [images, translationsData] = await Promise.all([imagesPromise, translationsPromise]);

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

    const translations: AnimeTranslationPayload[] = translationsData.map((t) => {
      return {
        iso_639_1: t.iso_639_1,
        title: t.data.name ?? t.data.title,
        description: t.data.overview,
        tagline: t.data.tagline,
        source: this.name
      } satisfies AnimeTranslationPayload;
    });

    const logo = artworks
      .filter((a) => a.type === 'logo')
      .sort((a, b) => {
        if (a.iso_639_1 === 'en' && b.iso_639_1 !== 'en') return -1;
        if (b.iso_639_1 === 'en' && a.iso_639_1 !== 'en') return 1;

        const sizeB = (b.height ?? 0) ** 2 + (b.width ?? 0) ** 2;
        const sizeA = (a.height ?? 0) ** 2 + (a.width ?? 0) ** 2;
        return sizeB - sizeA;
      })[0];

    if (artworks) {
      await Anime.save({ id, artworks });
    }

    if (translations) {
      await Anime.save({
        id,
        translations
      });
    }

    if (resolved.info.poster_path) {
      await Anime.save({
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
      await Anime.save({
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

    if (logo) {
      await Anime.save({
        id,
        images: {
          url: logo.url,
          small: TmdbUtils.getImage('w300', logo.url),
          medium: TmdbUtils.getImage('w780', logo.url),
          large: TmdbUtils.getImage('original', logo.url),
          type: 'logo',
          source: this.name
        }
      });
    }

    await Redis.set(key, resolved.info);

    return resolved.info;
  }

  private async resolveInfo(id: number): Promise<{
    info: TmdbInfoResult;
    type: string;
  }> {
    const idMap = parseNumber(await Anime.map(id, this.name));

    const al = await Anime.getBasicInfo(id);

    if (!al) {
      throw new Error('Anime not found');
    }

    const type = AnimeUtils.getType(al.format);

    if (idMap) {
      const info = type === 'movie' ? await TmdbFetch.fetchMovie(idMap) : await TmdbFetch.fetchSeries(idMap);

      return {
        info,
        type
      };
    } else {
      const info = await this.find(id);

      await Anime.save({
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

  private async find(id: number): Promise<TmdbInfoResult> {
    const al = await Anime.getBasicInfo(id);

    if (!al) {
      throw new Error('Anime not found');
    }

    const type = AnimeUtils.getType(al.format);

    const title = AnimeUtils.pickBestTitle(al.title);

    if (!title) {
      throw new Error('No title found');
    }

    const search =
      type === 'movie'
        ? await TmdbFetch.searchMovie(getSearchTitle(title))
        : await TmdbFetch.searchSeries(getSearchTitle(title));

    const results: ExpectAnime[] = search.map((result) => {
      return {
        titles: [result.original_name, result.original_title, result.name, result.title],
        id: result.id,
        language: result.original_language
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.other_titles.map((t) => t.title)],
      language: AnimeUtils.getLanguage(al.country ?? 'JP') ?? 'jp'
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

export { Tmdb, TmdbModule };
