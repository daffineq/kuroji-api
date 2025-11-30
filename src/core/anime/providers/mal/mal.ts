import { MALInfo } from 'src/core/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import malFetch from './helpers/mal.fetch';
import { parseNumber } from 'src/helpers/parsers';
import anilist from '../anilist/anilist';
import meta from '../../meta/meta';
import { metaSelect } from '../../meta/types';

class MyAnimeList {
  async getInfo(id: number): Promise<MALInfo> {
    const key = getKey('mal', 'info', id);

    const cached = await Redis.get<MALInfo>(key);

    if (cached) {
      return cached;
    }

    const mapping = await meta.fetchOrCreate(id, metaSelect).catch(() => null);

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

      await meta.addMapping(id, {
        id: al.idMal,
        name: 'mal'
      });
    }

    if (fetched.metadata?.videos) {
      await meta.addVideos(id, fetched.metadata.videos);
    }

    if (fetched.image) {
      await meta.addSingleImage(id, {
        url: fetched.image as string,
        large: fetched.image as string,
        type: 'poster',
        source: 'mal'
      });
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

const mal = new MyAnimeList();

export default mal;
