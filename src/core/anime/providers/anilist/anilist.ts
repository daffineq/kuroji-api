import { ProviderModule } from 'src/helpers/module';
import { AnilistFetch } from './helpers/anilist.fetch';
import { AnilistMedia } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';

class AnilistModule extends ProviderModule<AnilistMedia> {
  override readonly name = 'Anilist';
  override readonly logo = 'https://anilist.co/img/icons/android-chrome-512x512.png';

  override async getInfo(id: number): Promise<AnilistMedia> {
    const key = getKey('anilist', 'info', id);

    const cached = await Redis.get<AnilistMedia>(key);

    if (cached) {
      return cached;
    }

    const anilist = await AnilistFetch.fetchInfo(id);

    await Redis.set(key, anilist);

    return anilist;
  }
}

const Anilist = new AnilistModule();

export { Anilist, AnilistModule };
