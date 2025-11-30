import { parseString } from 'src/helpers/parsers';
import { ShikimoriAnime } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { metaSelect } from '../../meta/types';
import { ShikimoriFetch } from './helpers/shikimori.fetch';
import { Anilist } from '../anilist';
import { Meta } from '../../meta';

const getInfo = async (id: number, idMal: number | undefined = undefined): Promise<ShikimoriAnime> => {
  const key = getKey('shikimori', 'info', id);

  const cached = await Redis.get<ShikimoriAnime>(key);

  if (cached) {
    return cached;
  }

  var fetched: ShikimoriAnime;

  if (idMal) {
    fetched = await ShikimoriFetch.fetchInfo(parseString(idMal)!);

    await Meta.addMapping(id, {
      id: idMal,
      name: 'shikimori'
    });
  } else {
    const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

    const shikId = meta?.mappings.find((m) => m.sourceName === 'shikimori')?.sourceId;

    if (shikId) {
      fetched = await ShikimoriFetch.fetchInfo(shikId);
    } else {
      const al = await Anilist.getInfo(id);

      if (!al.idMal) {
        throw new Error('Anime not found');
      }

      fetched = await ShikimoriFetch.fetchInfo(parseString(al.idMal)!);

      await Meta.addMapping(id, {
        id: al.idMal,
        name: 'shikimori'
      });
    }
  }

  if (fetched.screenshots) {
    await Meta.addScreenshots(id, fetched.screenshots);
  }

  if (fetched.russian) {
    await Meta.addSingleTitle(id, {
      title: fetched.russian,
      source: 'shikimori',
      language: 'russian'
    });
  }

  if (fetched.description) {
    await Meta.addSingleDescription(id, {
      description: fetched.description,
      source: 'shikimori',
      language: 'russian'
    });
  }

  if (fetched.poster) {
    await Meta.addSingleImage(id, {
      url: fetched.poster.originalUrl!,
      medium: fetched.poster.mainUrl!,
      large: fetched.poster.originalUrl!,
      type: 'poster',
      source: 'shikimori'
    });
  }

  if (fetched.franchise) {
    await Meta.addFranchise(id, fetched.franchise);
  }

  if (fetched.rating) {
    await Meta.addRating(id, fetched.rating);
  }

  if (fetched.episodesAired) {
    await Meta.addEpisodesAired(id, fetched.episodesAired);
  }

  if (fetched.episodes) {
    await Meta.addEpisodesTotal(id, fetched.episodes);
  }

  await Redis.set(key, fetched);

  return fetched;
};

const Shikimori = {
  getInfo
};

export { Shikimori };
