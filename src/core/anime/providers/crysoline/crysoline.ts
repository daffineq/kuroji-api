import { Anime, Mapper, Source } from '@crysoline/lib';
import { Config } from 'src/config/config';
import { Module } from 'src/helpers/module';
import { Meta } from '../../meta';
import logger from 'src/helpers/logger';
import { Episode } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';

class CrysolineModule extends Module {
  override readonly name = 'Crysoline';

  private providers = [
    Anime.AnimePahe(Config.crysoline_api_key),
    Anime.AnimeKai(Config.crysoline_api_key),
    Anime.HiAnime(Config.crysoline_api_key)
  ];

  private mapper = Mapper(Config.crysoline_api_key);

  async map(id: number) {
    await Promise.all(
      this.providers.map(async (p) => {
        try {
          const map = await this.mapper.map({
            id,
            provider: p.name
          });

          if (!map.idMap) {
            return;
          }

          const info = await p.info(map.idMap);

          if (!info.id) {
            return;
          }

          await Meta.update({
            id,
            mappings: {
              id: info.id,
              name: p.name
            }
          });
        } catch (e) {
          logger.error(`${p.name} failed ${e}`);
        }
      })
    );
  }

  async episodes(id: number) {
    const key = getKey(this.name, 'episodes', id);

    const cached = await Redis.get<Episode[]>(key);

    if (cached) {
      return cached;
    }

    const episodesArrays = await Promise.all(
      this.providers.map(async (p) => {
        try {
          const meta = await Meta.fetchOrCreate(id).catch(() => null);
          const idMap = meta?.mappings.find((m) => m.source_name === p.name)?.source_id;

          if (!idMap) return;

          const episodes = await p.episodes(idMap);

          const results: Episode[] = episodes.map((ep, i) => ({
            title: ep.title,
            image: ep.image,
            description: ep.description,
            number: i + 1,
            is_filler: ep.isFiller ?? false,
            providers: [
              {
                name: p.name,
                id: ep.id ?? null
              }
            ]
          }));

          return results;
        } catch (e) {
          logger.error(`${p.name} episodes failed ${e}`);
          return;
        }
      })
    );

    const validEpisodes = episodesArrays.filter((e) => e !== undefined && e !== null);

    const mergedMap = new Map<number, Episode>();

    for (const episodeArray of validEpisodes) {
      for (const episode of episodeArray) {
        const number = episode.number;
        if (number == null) continue;

        const existing = mergedMap.get(number);

        if (!existing) {
          mergedMap.set(number, { ...episode });
        } else {
          mergedMap.set(number, {
            title: episode.title ?? existing.title,
            image: episode.image ?? existing.image,
            description: episode.description ?? existing.description,
            number,
            is_filler: episode.is_filler ?? existing.is_filler,
            providers: [
              ...existing.providers,
              ...episode.providers.filter((p) => !existing.providers.some((e) => e.name === p.name))
            ]
          });
        }
      }
    }

    const sorted = Array.from(mergedMap.values()).sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

    await Redis.set(key, sorted);

    return sorted;
  }

  async sources(id: number, idEp: string) {
    const key = getKey('crysoline', 'sources', id, idEp);

    const cached = await Redis.get<Source>(key);

    if (cached) {
      return cached;
    }

    const episodes = await this.episodes(id);

    const epProvider = episodes
      .find((e) => e.providers.find((p) => p.id === idEp))
      ?.providers.find((p) => p.id === idEp);

    const provider = this.providers.find((p) => p.name === epProvider?.name);

    if (!provider || !epProvider?.id) {
      return null;
    }

    const meta = await Meta.fetchOrCreate(id).catch(() => null);
    const idMap = meta?.mappings.find((m) => m.source_name === provider.name)?.source_id;

    if (!idMap) {
      return null;
    }

    const sources = await provider?.sources({
      id: idMap,
      episodeId: epProvider.id
    });

    await Redis.set(key, sources);

    return sources;
  }
}

const Crysoline = new CrysolineModule();

export { Crysoline };
