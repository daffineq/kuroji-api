import { getKey, Redis } from 'src/helpers/redis.util';
import { parseNumber } from 'src/helpers/parsers';
import { metaSelect } from '../../meta/types';
import { Anilist } from '../anilist';
import { Meta, VideoEntry } from '../../meta';
import { ProviderModule } from 'src/helpers/module';
import { Meta as CryMeta } from '@crysoline/lib';
import env from 'src/config/env';
import { Info } from '@crysoline/lib/dist/core/types';
import { MInfoMeta } from '@crysoline/lib/dist/core/meta/myanimelist';

type MALInfo = Info<MInfoMeta>;

class MyAnimeListModule extends ProviderModule<MALInfo> {
  override readonly name = 'MyAnimeList';

  private fetch = CryMeta.MyAnimeList(env.CRYSOLINE_API_KEY);

  override async getInfo(id: number, idMal?: number): Promise<MALInfo> {
    const key = getKey('mal', 'info', id);

    const cached = await Redis.get<MALInfo>(key);

    if (cached) {
      return cached;
    }

    let fetched: MALInfo;

    if (idMal) {
      fetched = await this.fetch.info(idMal);

      await Meta.update(id, {
        mappings: {
          id: idMal,
          name: 'mal'
        }
      });
    } else {
      const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

      const malId = parseNumber(meta?.mappings.find((m) => m.source_name === 'mal')?.source_id);

      if (malId) {
        fetched = await this.fetch.info(malId);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('No MAL ID found');
        }

        fetched = await this.fetch.info(al.idMal);

        await Meta.update(id, {
          mappings: {
            id: al.idMal,
            name: 'mal'
          }
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

      await Meta.update(id, { videos });
    }

    if (fetched.image) {
      await Meta.update(id, {
        images: {
          url: fetched.image.large,
          large: fetched.image.large,
          type: 'poster',
          source: 'mal'
        }
      });
    }

    if (fetched.metadata?.moreInfo) {
      await Meta.update(id, { moreinfo: fetched.metadata?.moreInfo });
    }

    if (fetched.metadata?.broadcast) {
      await Meta.update(id, { broadcast: fetched.metadata?.broadcast });
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

const MyAnimeList = new MyAnimeListModule();

export { MyAnimeList, MyAnimeListModule };
