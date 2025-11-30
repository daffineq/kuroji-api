import { KitsuAnime } from './types';
import { NotFoundError } from 'src/helpers/errors';
import kitsuFetch from './helpers/kitsu.fetch';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { parseNumber } from 'src/helpers/parsers';
import meta from '../../meta/meta';
import { metaSelect } from '../../meta/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import anilist from '../anilist/anilist';
import { findEpisodeCount } from '../anilist/helpers/anilist.utils';

class Kitsu {
  async getInfo(id: number): Promise<KitsuAnime> {
    const key = getKey('kitsu', 'info', id);

    const cached = await Redis.get<KitsuAnime>(key);

    if (cached) {
      return cached;
    }

    const mapping = await meta.fetchOrCreate(id, metaSelect).catch(() => null);

    const kitsuId = mapping?.mappings.find((m) => m.sourceName === 'kitsu')?.sourceId;

    if (kitsuId) {
      const kitsu = await kitsuFetch.fetchInfo(kitsuId);

      await Redis.set(key, kitsu);

      return kitsu;
    } else {
      const kitsu = await this.find(id);

      await meta.addMapping(id, {
        id: kitsu.id,
        name: 'kitsu'
      });

      await Redis.set(key, kitsu);

      return kitsu;
    }
  }

  async find(id: number): Promise<KitsuAnime> {
    const al = await anilist.getInfo(id);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    const search = await kitsuFetch.search(deepCleanTitle(al.title?.romaji ?? ''));

    const results = search.map((result) => {
      const startDate = result.attributes.startDate;
      const year = startDate ? parseNumber(startDate.split('-')[0]) : undefined;

      return {
        titles: [result.attributes.titles.en, result.attributes.titles.en_jp, result.attributes.titles.ja_jp],
        id: result.id,
        year,
        episodes: result.attributes.episodeCount
      };
    });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
      year: al.seasonYear ?? undefined,
      episodes: findEpisodeCount(al)
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await kitsuFetch.fetchInfo(bestMatch.result.id);
      return data;
    }

    throw new NotFoundError('Kitsu not found');
  }
}

const kitsu = new Kitsu();

export default kitsu;
