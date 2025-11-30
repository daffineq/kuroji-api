import { parseString } from 'src/helpers/parsers';
import shikimoriFetch from './helpers/shikimori.fetch';
import { ShikimoriAnime } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import meta from '../../meta/meta';
import { metaSelect } from '../../meta/types';
import anilist from '../anilist/anilist';
import logger from 'src/helpers/logger';

class Shikimori {
  async getInfo(id: number): Promise<ShikimoriAnime> {
    const key = getKey('shikimori', 'info', id);

    const cached = await Redis.get<ShikimoriAnime>(key);

    if (cached) {
      return cached;
    }

    const mapping = await meta.fetchOrCreate(id, metaSelect).catch(() => null);

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

      await meta.addMapping(id, {
        id: al.idMal,
        name: 'shikimori'
      });
    }

    if (fetched.screenshots) {
      await meta.addScreenshots(id, fetched.screenshots);
    }

    if (fetched.russian) {
      await meta.addSingleTitle(id, {
        title: fetched.russian,
        source: 'shikimori',
        language: 'russian'
      });
    }

    if (fetched.description) {
      await meta.addSingleDescription(id, {
        description: fetched.description,
        source: 'shikimori',
        language: 'russian'
      });
    }

    if (fetched.poster) {
      await meta.addSingleImage(id, {
        url: fetched.poster.originalUrl!,
        medium: fetched.poster.mainUrl!,
        large: fetched.poster.originalUrl!,
        type: 'poster',
        source: 'shikimori'
      });
    }

    if (fetched.franchise) {
      await meta.addFranchise(id, fetched.franchise);
    }

    if (fetched.rating) {
      await meta.addRating(id, fetched.rating);
    }

    if (fetched.episodesAired) {
      await meta.addEpisodesAired(id, fetched.episodesAired);
    }

    if (fetched.episodes) {
      await meta.addEpisodesTotal(id, fetched.episodes);
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

const shikimori = new Shikimori();

export default shikimori;
