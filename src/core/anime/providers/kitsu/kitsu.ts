import { KitsuAnime } from './types';
import { NotFoundError } from 'src/helpers/errors';
import { getSearchTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { parseNumber, parseString } from 'src/helpers/parsers';
import { getKey, Redis } from 'src/helpers/redis.util';
import { KitsuFetch } from './helpers/kitsu.fetch';
import { ProviderModule } from 'src/helpers/module';
import { Anime } from '../../anime';
import { AnimeUtils } from '../../helpers';
import { Config } from 'src/config';

class KitsuModule extends ProviderModule<KitsuAnime> {
  override readonly name = 'Kitsu';

  override async getInfo(id: number): Promise<KitsuAnime> {
    if (!Config.use_kitsu) {
      throw new Error(`${this.name} disabled`);
    }

    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<KitsuAnime>(key);

    if (cached) {
      return cached;
    }

    const info = await this.resolveInfo(id);

    if (info.attributes.posterImage) {
      await Anime.save({
        id,
        images: {
          url: info.attributes.posterImage.original,
          small: info.attributes.posterImage.small,
          medium: info.attributes.posterImage.medium,
          large: info.attributes.posterImage.large,
          type: 'poster',
          source: this.name
        }
      });
    }

    if (info.attributes.coverImage) {
      await Anime.save({
        id,
        images: {
          url: info.attributes.coverImage.original,
          small: info.attributes.coverImage.small,
          medium: info.attributes.coverImage.medium,
          large: info.attributes.coverImage.large,
          type: 'background',
          source: this.name
        }
      });
    }

    await Anime.save({ id, nsfw: info.attributes.nsfw });

    await Redis.set(key, info);

    return info;
  }

  private async resolveInfo(id: number) {
    const idMap = await Anime.map(id, this.name);

    if (idMap) {
      return KitsuFetch.fetchInfo(idMap);
    } else {
      const info = await this.find(id);

      await Anime.save({
        id,
        links: {
          link: info.id,
          label: this.name,
          type: 'mapping'
        }
      });

      return info;
    }
  }

  private async find(id: number): Promise<KitsuAnime> {
    const al = await Anime.getBasicInfo(id);

    if (!al) {
      throw new NotFoundError('Anime not found');
    }

    const title = AnimeUtils.pickBestTitle(al.title);

    if (!title) {
      throw new NotFoundError('no title?');
    }

    const search = await KitsuFetch.search(getSearchTitle(title));

    const results = search.map((result) => {
      const startDate = result.attributes.startDate;
      const year = startDate ? parseNumber(startDate.split('-')[0]) : undefined;

      return {
        titles: [result.attributes.titles.en, result.attributes.titles.en_jp, result.attributes.titles.ja_jp],
        id: result.id,
        year,
        type: result.attributes.subtype,
        episodes: result.attributes.episodeCount
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.other_titles.map((t) => t.title)],
      year: al.season_year ?? undefined,
      type: al.format ?? 'TV',
      episodes: AnimeUtils.findEpisodeCount(al)
    };

    const bestMatch = findBestMatch(searchCriteria, results);
    const bestMatchId = parseString(bestMatch?.id);

    if (bestMatchId) {
      const data = await KitsuFetch.fetchInfo(bestMatchId);
      return data;
    }

    throw new NotFoundError('Kitsu not found');
  }
}

const Kitsu = new KitsuModule();

export { Kitsu, KitsuModule };
