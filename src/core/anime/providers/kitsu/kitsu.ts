import { KitsuAnime } from './types';
import { NotFoundError } from 'src/helpers/errors';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { parseNumber } from 'src/helpers/parsers';
import { metaSelect } from '../../meta/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { KitsuFetch } from './helpers/kitsu.fetch';
import { Anilist, AnilistUtils } from '../anilist';
import { Meta } from '../../meta';

const getInfo = async (id: number): Promise<KitsuAnime> => {
  const key = getKey('kitsu', 'info', id);

  const cached = await Redis.get<KitsuAnime>(key);

  if (cached) {
    return cached;
  }

  const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

  const kitsuId = meta?.mappings.find((m) => m.source_name === 'kitsu')?.source_id;

  var kitsu: KitsuAnime;

  if (kitsuId) {
    kitsu = await KitsuFetch.fetchInfo(kitsuId);
  } else {
    kitsu = await find(id);

    await Meta.addMapping(id, {
      id: kitsu.id,
      name: 'kitsu'
    });
  }

  if (kitsu.attributes.posterImage) {
    Meta.addSingleImage(id, {
      url: kitsu.attributes.posterImage.original,
      small: kitsu.attributes.posterImage.small,
      medium: kitsu.attributes.posterImage.medium,
      large: kitsu.attributes.posterImage.large,
      type: 'poster',
      source: 'kitsu'
    });
  }

  if (kitsu.attributes.coverImage) {
    Meta.addSingleImage(id, {
      url: kitsu.attributes.coverImage.original,
      small: kitsu.attributes.coverImage.small,
      medium: kitsu.attributes.coverImage.medium,
      large: kitsu.attributes.coverImage.large,
      type: 'banner',
      source: 'kitsu'
    });
  }

  Meta.setNSFW(id, kitsu.attributes.nsfw);

  await Redis.set(key, kitsu);

  return kitsu;
};

const find = async (id: number): Promise<KitsuAnime> => {
  const al = await Anilist.getInfo(id);

  if (!al) {
    throw new NotFoundError('Anilist not found');
  }

  const search = await KitsuFetch.search(deepCleanTitle(al.title?.romaji ?? ''));

  const results = search.map((result) => {
    const startDate = result.attributes.startDate;
    const year = startDate ? parseNumber(startDate.split('-')[0]) : undefined;

    return {
      titles: [result.attributes.titles.en, result.attributes.titles.en_jp, result.attributes.titles.ja_jp],
      id: result.id,
      year,
      episodes: result.attributes.episodeCount
    };
  });

  const searchCriteria: ExpectAnime = {
    titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
    year: al.seasonYear ?? undefined,
    episodes: AnilistUtils.findEpisodeCount(al)
  };

  const bestMatch = findBestMatch(searchCriteria, results);

  if (bestMatch) {
    const data = await KitsuFetch.fetchInfo(bestMatch.result.id);
    return data;
  }

  throw new NotFoundError('Kitsu not found');
};

const Kitsu = {
  getInfo,
  find
};

export { Kitsu };
