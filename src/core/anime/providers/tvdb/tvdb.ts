import { NotFoundError } from 'src/helpers/errors';
import { TvdbInfoResult } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseString } from 'src/helpers/parsers';
import { TvdbFetch } from './helpers/tvdb.fetch';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';
import { AnimeUtils } from '../../helpers';
import { Anime } from '../../anime';
import { AnimeArtworkPayload } from '../../types';
import { Config } from 'src/config';
import { ExpectAnime, findBestMatch, getSearchTitle } from 'src/helpers/mapper';

class TvdbModule extends ProviderModule<TvdbInfoResult> {
  override readonly name = 'TVDB';

  override async getInfo(id: number): Promise<TvdbInfoResult> {
    if (!Config.use_tvdb) {
      throw new Error(`${this.name} disabled`);
    }

    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<TvdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const info = await this.resolveInfo(id);

    if (info.artworks) {
      const artworks: AnimeArtworkPayload[] = info.artworks.map((a) => {
        return {
          url: a.image!,
          large: a.image,
          width: a.width,
          height: a.height,
          iso_639_1: normalize_iso_639_1(a.language) ?? undefined,
          medium: a.thumbnail,
          type: AnimeUtils.unifyArtworkType(a.type),
          source: this.name
        } satisfies AnimeArtworkPayload;
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

      if (logo) {
        await Anime.save({
          id,
          images: {
            url: logo.url,
            small: null,
            medium: logo.medium,
            large: logo.large,
            type: 'logo',
            source: this.name
          }
        });
      }

      await Anime.save({ id, artworks });
    }

    await Redis.set(key, info);

    return info;
  }

  private async resolveInfo(id: number) {
    const al = await Anime.getBasicInfo(id);

    if (!al) {
      throw new NotFoundError('Anime not found');
    }

    const type = AnimeUtils.getType(al.format);

    const idMap = await Anime.map(id, this.name);

    if (idMap) {
      return type === 'movie' ? TvdbFetch.fetchMovie(idMap) : TvdbFetch.fetchSeries(idMap);
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

      return info;
    }
  }

  async find(id: number): Promise<TvdbInfoResult> {
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
        ? await TvdbFetch.search(getSearchTitle(title), type, AnimeUtils.getCountryA3(al.country ?? '') ?? 'jpn')
        : await TvdbFetch.search(getSearchTitle(title), type, AnimeUtils.getCountryA3(al.country ?? '') ?? 'jpn');

    const results: ExpectAnime[] = search.map((result) => {
      return {
        titles: [result.name, result.translations?.['eng']],
        id: result.tvdb_id,
        language: AnimeUtils.getLanguageA3(result.primary_language ?? 'jpn') ?? 'jp'
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.other_titles.map((t) => t.title)],
      language: AnimeUtils.getLanguage(al.country ?? 'JP') ?? 'jp'
    };

    const bestMatch = findBestMatch(searchCriteria, results);
    const bestMatchId = parseString(bestMatch?.id);

    if (bestMatchId) {
      const data =
        type === 'movie' ? await TvdbFetch.fetchMovie(bestMatchId) : await TvdbFetch.fetchSeries(bestMatchId);
      return data;
    }

    throw new NotFoundError('Tvdb not found');
  }
}

const Tvdb = new TvdbModule();

export { Tvdb, TvdbModule };
