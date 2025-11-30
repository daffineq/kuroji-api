import { AnilistFetch } from './helpers/anilist.fetch';
import { AnilistMedia } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';

const getInfo = async (id: number): Promise<AnilistMedia> => {
  const key = getKey('anilist', 'info', id);

  const cached = await Redis.get<AnilistMedia>(key);

  if (cached) {
    return cached;
  }

  const anilist = await AnilistFetch.fetchInfo(id);

  await Redis.set(key, anilist);

  return anilist;
};

const Anilist = {
  getInfo
};

export { Anilist };
