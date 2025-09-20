import { MALInfo } from 'src/core/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import malFetch from './helpers/mal.fetch';
import { parseNumber, parseString } from 'src/helpers/parsers';
import anilist from '../anilist/anilist';
import mappings from '../mappings/mappings';
import { mappingsSelect } from '../mappings/types';

class MyAnimeList {
  async getInfo(id: number): Promise<MALInfo> {
    const key = getKey('shikimori', 'info', id);

    const cached = await Redis.get<MALInfo>(key);

    if (cached) {
      return cached;
    }

    const mapping = await mappings.initOrGet(id, mappingsSelect).catch(() => null);

    const malId = parseNumber(mapping?.mappings.find((m) => m.sourceName === 'mal')?.sourceId);

    var fetched: MALInfo;

    if (malId) {
      fetched = await malFetch.fetchInfo(malId);
    } else {
      const al = await anilist.getInfo(id);

      if (!al.idMal) {
        throw new Error('No MAL ID found');
      }

      fetched = await malFetch.fetchInfo(al.idMal);

      await mappings.addMapping(id, {
        id: al.idMal,
        name: 'mal'
      });
    }

    if (fetched.metadata?.videos) {
      await mappings.addVideos(id, fetched.metadata.videos);
    }

    if (fetched.image) {
      await mappings.addSinglePoster(id, {
        url: fetched.image as string,
        large: fetched.image as string,
        source: 'mal'
      });
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

export default new MyAnimeList();
