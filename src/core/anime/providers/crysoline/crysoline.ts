import { Anime as CryAnime, Mapper, Source } from '@crysoline/lib';
import { Config } from 'src/config/config';
import { Module } from 'src/helpers/module';
import logger from 'src/helpers/logger';
import { Episode } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { Anime } from '../../anime';

class CrysolineModule extends Module {
  constructor() {
    super();

    for (const [_, factory] of Object.entries(CryAnime)) {
      const provider = factory(Config.crysoline_api_key);

      if (Config.crysoline_anime_providers.includes(provider.name)) {
        this.providers.push(provider);
      }
    }
  }

  override readonly name = 'Crysoline';

  private providers: ReturnType<(typeof CryAnime)[keyof typeof CryAnime]>[] = [];

  private mapper = Mapper(Config.crysoline_api_key);

  async map(id: number) {
    if (!Config.has_crysoline_api_key && Config.crysoline_should_init_maps) {
      return;
    }

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

          await Anime.upsert({
            id,
            links: {
              link: map.idMap,
              label: p.name,
              type: 'mapping'
            }
          });
        } catch (e) {
          logger.error(`${p.name} failed ${e}`);
        }
      })
    );
  }

  async episodes(id: number) {
    if (!Config.has_crysoline_api_key) {
      return [];
    }

    const key = getKey(this.name, 'episodes', id);

    const cached = await Redis.get<Episode[]>(key);

    if (cached) {
      return cached;
    }

    const episodesArrays = await Promise.all(
      this.providers.map(async (p) => {
        try {
          let idMap = await Anime.map(id, p.name);

          if (!idMap) {
            const map = await this.mapper.map({
              id,
              provider: p.name
            });

            if (!map.idMap) {
              return [];
            }

            await Anime.upsert({
              id,
              links: {
                link: map.idMap,
                label: p.name,
                type: 'mapping'
              }
            });

            idMap = map.idMap;
          }

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
          return [];
        }
      })
    );

    const mergedMap = new Map<number, Episode>();

    for (const episodeArray of episodesArrays) {
      for (const episode of episodeArray) {
        const number = episode.number;
        if (number == null) continue;

        const existing = mergedMap.get(number);

        if (!existing) {
          mergedMap.set(number, { ...episode });
        } else {
          mergedMap.set(number, {
            title: episode.title || existing.title,
            image: episode.image ?? existing.image,
            description: episode.description || existing.description,
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
    if (!Config.has_crysoline_api_key) {
      return null;
    }

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

    let idMap = await Anime.map(id, provider.name);

    if (!idMap) {
      const map = await this.mapper.map({
        id,
        provider: provider.name
      });

      if (!map.idMap) {
        return null;
      }

      await Anime.upsert({
        id,
        links: {
          link: map.idMap,
          label: provider.name,
          type: 'mapping'
        }
      });

      idMap = map.idMap;
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
