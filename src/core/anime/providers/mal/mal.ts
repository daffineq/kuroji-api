import { MALInfo } from 'src/core/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseNumber } from 'src/helpers/parsers';
import { metaSelect } from '../../meta/types';
import { MyAnimeListFetch } from './helpers/mal.fetch';
import { Anilist } from '../anilist';
import { Meta, VideoEntry } from '../../meta';
import { ProviderModule } from 'src/helpers/module';

class MyAnimeListModule extends ProviderModule<MALInfo> {
  override readonly name = 'MyAnimeList';
  override readonly logo =
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.logotypes101.com%2Flogos%2F240%2F2042DE55ADC66D19CDDCF3435B9F2A53%2FMyAnimeList.png&f=1&nofb=1&ipt=ed5a038635641ada0d38279a29d32850efade86a3a376f6b95db0c3a8a7ab23f';

  override async getInfo(id: number, idMal?: number): Promise<MALInfo> {
    const key = getKey('mal', 'info', id);

    const cached = await Redis.get<MALInfo>(key);

    if (cached) {
      return cached;
    }

    let fetched: MALInfo;

    if (idMal) {
      fetched = await MyAnimeListFetch.fetchInfo(idMal);

      await Meta.addSingleMapping(id, {
        id: idMal,
        name: 'mal'
      });
    } else {
      const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

      const malId = parseNumber(meta?.mappings.find((m) => m.source_name === 'mal')?.source_id);

      if (malId) {
        fetched = await MyAnimeListFetch.fetchInfo(malId);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('No MAL ID found');
        }

        fetched = await MyAnimeListFetch.fetchInfo(al.idMal);

        await Meta.addSingleMapping(id, {
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
  }
}

const MyAnimeList = new MyAnimeListModule();

export { MyAnimeList, MyAnimeListModule };
