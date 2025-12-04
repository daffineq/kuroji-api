import { NotFoundError } from 'src/helpers/errors';
import { deepCleanTitle, ExpectAnime, findBestMatch } from 'src/helpers/mapper';
import { AnimepaheInfo } from 'src/core/types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { metaSelect } from '../../meta/types';
import { AnimepaheFetch } from './helpers/animepahe.fetch';
import { Anilist, AnilistUtils } from '../anilist';
import { Meta } from '../../meta';

const getInfo = async (id: number): Promise<AnimepaheInfo> => {
  const key = getKey('animepahe', 'info', id);

  const cached = await Redis.get<AnimepaheInfo>(key);

  if (cached) {
    return cached;
  }

  const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

  const paheId = meta?.mappings.find((mapping) => mapping.source_name === 'animepahe')?.source_id;

  if (paheId) {
    const animepahe = await AnimepaheFetch.fetchInfo(paheId);

    await Redis.set(key, animepahe);

    return animepahe;
  } else {
    const animepahe = await find(id);

    await Meta.addMapping(id, {
      id: animepahe.id as string,
      name: 'animepahe'
    });

    await Redis.set(key, animepahe);

    return animepahe;
  }
};

const find = async (id: number) => {
  const al = await Anilist.getInfo(id);

  if (!al) throw new NotFoundError('Anilist not found');

  const search = await AnimepaheFetch.search(deepCleanTitle(al.title?.romaji ?? ''));

  const results = search.map((result) => ({
    titles: [result.title as string],
    id: result.id as string,
    type: result.metadata?.type ?? undefined,
    year: result.metadata?.year ?? undefined
  }));

  const searchCriteria: ExpectAnime = {
    titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms],
    year: al.seasonYear ?? undefined,
    type: al.format ?? undefined,
    episodes: AnilistUtils.findEpisodeCount(al)
  };

  const exclude: string[] = [];

  for (let i = 0; i < 3; i++) {
    const bestMatch = findBestMatch(searchCriteria, results, exclude);

    if (bestMatch) {
      const data = await AnimepaheFetch.fetchInfo(bestMatch.result.id);

      if ((data.idAl && Number(data.idAl) === al.id) || (data.idMal && Number(data.idMal) === al.idMal)) {
        data.idAl = id;
        return data;
      } else {
        exclude.push(bestMatch.result.id);
        continue;
      }
    }
  }

  throw new NotFoundError('Animepahe not found');
};

const Animepahe = {
  getInfo,
  find
};

export { Animepahe };
