import { MALInfo } from 'src/core/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseNumber } from 'src/helpers/parsers';
import { metaSelect } from '../../meta/types';
import { MalFetch } from './helpers/mal.fetch';
import { Anilist } from '../anilist';
import { Meta, VideoEntry } from '../../meta';

const getInfo = async (id: number, idMal: number | undefined = undefined): Promise<MALInfo> => {
  const key = getKey('mal', 'info', id);

  const cached = await Redis.get<MALInfo>(key);

  if (cached) {
    return cached;
  }

  var fetched: MALInfo;

  if (idMal) {
    fetched = await MalFetch.fetchInfo(idMal);

    await Meta.addMapping(id, {
      id: idMal,
      name: 'mal'
    });
  } else {
    const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

    const malId = parseNumber(meta?.mappings.find((m) => m.sourceName === 'mal')?.sourceId);

    if (malId) {
      fetched = await MalFetch.fetchInfo(malId);
    } else {
      const al = await Anilist.getInfo(id);

      if (!al.idMal) {
        throw new Error('No MAL ID found');
      }

      fetched = await MalFetch.fetchInfo(al.idMal);

      await Meta.addMapping(id, {
        id: al.idMal,
        name: 'mal'
      });
    }
  }

  if (fetched.metadata?.videos) {
    const videos: VideoEntry[] = fetched.metadata.videos.map((v) => {
      return {
        url: v.url,
        title: v.title,
        thumbnail: v.thumbnail ?? undefined,
        artist: v.artist ?? undefined,
        type: v.type,
        source: 'mal'
      };
    });

    await Meta.addVideos(id, videos);
  }

  if (fetched.image) {
    await Meta.addSingleImage(id, {
      url: fetched.image as string,
      large: fetched.image as string,
      type: 'poster',
      source: 'mal'
    });
  }

  if (fetched.metadata?.moreInfo) {
    await Meta.addMoreinfo(id, fetched.metadata?.moreInfo);
  }

  if (fetched.metadata?.broadcast) {
    await Meta.addBroadcast(id, fetched.metadata?.broadcast);
  }

  await Redis.set(key, fetched);

  return fetched;
};

const Mal = {
  getInfo
};

export { Mal };
