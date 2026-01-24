import { getKey, Redis } from 'src/helpers/redis.util';
import { parseNumber } from 'src/helpers/parsers';
import { Anilist } from '../anilist';
import { Meta, VideoEntry } from '../../meta';
import { ProviderModule } from 'src/helpers/module';
import { Meta as CryMeta } from '@crysoline/lib';
import { Config } from 'src/config/config';
import { Info } from '@crysoline/lib/dist/core/types';
import { MInfoMeta } from '@crysoline/lib/dist/core/meta/myanimelist';

type MALInfo = Info<MInfoMeta>;

class MyAnimeListModule extends ProviderModule<MALInfo> {
  override readonly name = 'MyAnimeList';

  private fetch = CryMeta.MyAnimeList(Config.crysoline_api_key);

  override async getInfo(id: number, idMal?: number): Promise<MALInfo> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<MALInfo>(key);

    if (cached) {
      return cached;
    }

    let info: MALInfo;

    if (idMal) {
      info = await this.fetch.info(idMal);

      await Meta.update({
        id,
        mappings: {
          id: idMal,
          name: this.name
        }
      });
    } else {
      const idMap = await Meta.map(id, this.name);

      if (idMap) {
        info = await this.fetch.info(idMap);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('No MAL ID found');
        }

        info = await this.fetch.info(al.idMal);

        await Meta.update({
          id,
          mappings: {
            id: al.idMal,
            name: this.name
          }
        });
      }
    }

    if (info.metadata?.videos) {
      const videos: VideoEntry[] = info.metadata.videos.map((v) => {
        return {
          url: v.url,
          title: v.title,
          thumbnail: v.thumbnail ?? undefined,
          artist: v.artist ?? undefined,
          type: v.type,
          source: this.name
        };
      });

      await Meta.update({ id, videos });
    }

    if (info.image) {
      await Meta.update({
        id,
        images: {
          url: info.image.large,
          large: info.image.large,
          type: 'poster',
          source: this.name
        }
      });
    }

    if (info.metadata?.moreInfo) {
      await Meta.update({ id, moreinfo: info.metadata?.moreInfo });
    }

    if (info.metadata?.broadcast) {
      await Meta.update({ id, broadcast: info.metadata?.broadcast });
    }

    await Redis.set(key, info);

    return info;
  }
}

const MyAnimeList = new MyAnimeListModule();

export { MyAnimeList, MyAnimeListModule };
