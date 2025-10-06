import { AnilistMedia } from './types';
import anilistFetch from './helpers/anilist.fetch';
import { getKey, Redis } from 'src/helpers/redis.util';

class Anilist {
  async getInfo(id: number): Promise<AnilistMedia> {
    const key = getKey('anilist', 'info', id);

    const cached = await Redis.get<AnilistMedia>(key);

    if (cached) {
      return cached;
    }

    const anilist = await anilistFetch.fetchInfo(id);

    await Redis.set(key, anilist);

    return anilist;
  }
}

const anilist = new Anilist();

export default anilist;
