import { NotFoundError } from 'src/helpers/errors';
import animepaheFetch from './helpers/animepahe.fetch';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { findEpisodeCount } from '../anilist/helpers/anilist.utils';
import { AnimepaheInfo } from 'src/core/types';
import anilist from '../anilist/anilist';
import mappings from '../../mappings/mappings';
import { getKey, Redis } from 'src/helpers/redis.util';
import { mappingsSelect } from '../../mappings/types';

class Animepahe {
  async getInfo(id: number): Promise<AnimepaheInfo> {
    const key = getKey('animepahe', 'info', id);

    const cached = await Redis.get<AnimepaheInfo>(key);

    if (cached) {
      return cached;
    }

    const mapping = await mappings.initOrGet(id, mappingsSelect).catch(() => null);

    const paheId = mapping?.mappings.find((mapping) => mapping.sourceName === 'animepahe')?.sourceId;

    if (paheId) {
      const animepahe = await animepaheFetch.fetchInfo(paheId);

      await Redis.set(key, animepahe);

      return animepahe;
    } else {
      const animepahe = await this.find(id);

      await mappings.addMapping(id, {
        id: animepahe.id as string,
        name: 'animepahe'
      });

      await Redis.set(key, animepahe);

      return animepahe;
    }
  }

  async find(id: number) {
    const al = await anilist.getInfo(id);

    if (!al) throw new NotFoundError('Anilist not found');

    const search = await animepaheFetch.search(deepCleanTitle(al.title?.romaji ?? ''));

    const results = search.map((result) => ({
      titles: [result.title as string],
      id: result.id as string,
      type: result.metadata?.type ?? undefined,
      year: result.metadata?.year ?? undefined
    }));

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
      year: al.seasonYear ?? undefined,
      type: al.format ?? undefined,
      episodes: findEpisodeCount(al)
    };

    const exclude: string[] = [];

    for (let i = 0; i < 3; i++) {
      const bestMatch = findBestMatch(searchCriteria, results, exclude);

      if (bestMatch) {
        const data = await animepaheFetch.fetchInfo(bestMatch.result.id);

        if ((data.idAl && Number(data.idAl) === al.id) || (data.idMal && Number(data.idMal) === al.idMal)) {
          data.idAl = id;
          return data;
        } else {
          exclude.push(bestMatch.result.id);
          continue;
        }
      }
    }

    throw new NotFoundError('Animepahe not found');
  }
}

export default new Animepahe();
