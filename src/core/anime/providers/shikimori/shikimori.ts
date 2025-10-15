import { parseString } from 'src/helpers/parsers';
import shikimoriFetch from './helpers/shikimori.fetch';
import { ShikimoriAnime } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import mappings from '../../mappings/mappings';
import { mappingsSelect } from '../../mappings/types';
import anilist from '../anilist/anilist';

class Shikimori {
  async getInfo(id: number): Promise<ShikimoriAnime> {
    const key = getKey('shikimori', 'info', id);

    const cached = await Redis.get<ShikimoriAnime>(key);

    if (cached) {
      return cached;
    }

    const mapping = await mappings.initOrGet(id, mappingsSelect).catch(() => null);

    const shikId = mapping?.mappings.find((m) => m.sourceName === 'shikimori')?.sourceId;

    var fetched: ShikimoriAnime;

    if (shikId) {
      fetched = await shikimoriFetch.fetchInfo(shikId);
    } else {
      const al = await anilist.getInfo(id);

      if (!al.idMal) {
        throw new Error('Anime not found');
      }

      fetched = await shikimoriFetch.fetchInfo(parseString(al.idMal)!);

      await mappings.addMapping(id, {
        id: al.idMal,
        name: 'shikimori'
      });
    }

    if (fetched.screenshots) {
      await mappings.addScreenshots(id, fetched.screenshots);
    }

    if (fetched.russian) {
      await mappings.addSingleTitle(id, {
        title: fetched.russian,
        source: 'shikimori',
        language: 'russian'
      });
    }

    if (fetched.description) {
      await mappings.addSingleDescription(id, {
        description: fetched.description,
        source: 'shikimori',
        language: 'russian'
      });
    }

    if (fetched.poster) {
      await mappings.addSingleImage(id, {
        url: fetched.poster.originalUrl!,
        medium: fetched.poster.mainUrl!,
        large: fetched.poster.originalUrl!,
        type: 'poster',
        source: 'shikimori'
      });
    }

    if (fetched.franchise) {
      await mappings.addFranchise(id, fetched.franchise);
    }

    if (fetched.rating) {
      await mappings.addRating(id, fetched.rating);
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

const shikimori = new Shikimori();

export default shikimori;
