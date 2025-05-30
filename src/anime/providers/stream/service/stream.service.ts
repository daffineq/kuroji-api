import { Injectable } from '@nestjs/common';
import { Provider } from '../model/Provider'
import { SourceType } from '../model/SourceType'
import { ZoroService } from '../../zoro/service/zoro.service'
import { AnimekaiService } from '../../animekai/service/animekai.service'
import { AnimepaheService } from '../../animepahe/service/animepahe.service'
import { AnilistService } from '../../anilist/service/anilist.service'
import { TmdbService } from '../../tmdb/service/tmdb.service'
import { AnimekaiEpisode, AnimepaheEpisode, EpisodeZoro } from '@prisma/client'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import Config from '../../../../configs/Config'
import { ISource } from '@consumet/extensions'
import { TMDB } from '../../../../configs/tmdb.config'

export interface Episode {
  title: string | null
  image: string
  number: number | null
  overview: string
  date: string
  duration: number
  filler: boolean | null
  sub: boolean | null
  dub: boolean | null
}

export interface ProviderInfo {
  id: string,
  filler: boolean,
  provider: Provider,
  type: SourceType
}

@Injectable()
export class StreamService {
  constructor(
    private readonly aniwatch: ZoroService,
    private readonly animekai: AnimekaiService,
    private readonly animepahe: AnimepaheService,
    private readonly anilist: AnilistService,
    private readonly tmdb: TmdbService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getEpisodes(id: number): Promise<Episode[]> {
    try {
      const key = `anime:episodes:${id}`;

      if (Config.REDIS) {
        const cached = await this.redis.get(key)
        if (cached) {
          return JSON.parse(cached) as Episode[]
        }
      }

      const [aniwatch, season, anilist] = await Promise.all([
        this.aniwatch.getZoroByAnilist(id).catch(() => null),
        this.tmdb.getTmdbSeasonByAnilist(id).catch(() => null),
        this.anilist.getAnilist(id).catch(() => null),
      ])

      const episodesZoro = aniwatch?.episodes || []
      const tmdbEpisodes = season?.episodes || []
      const anilistEpisodes = anilist?.streamingEpisodes || []

      const episodes: Episode[] = episodesZoro.map((episode) => {
        const {
          isFiller: filler = false,
          isSubbed: sub = false,
          isDubbed: dub = false,
          number,
          title: zoroTitle,
        } = episode

        const tmdbEpisode = tmdbEpisodes.find(e => e.episode_number === number)

        const anilistEpisode = anilistEpisodes.find(e => {
          const match = e.title?.match(/.*?(\d+).*/)
          return match ? parseInt(match[1]) === number : false
        })

        const airDate = anilist?.airingSchedule?.find(s => s.episode == number)?.airingAt || 0;

        const formattedDate = new Date(airDate * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });

        return {
          title: tmdbEpisode?.name || anilistEpisode?.title || zoroTitle,
          image: `${TMDB.IMAGE_BASE_ORIGINAL_URL}${tmdbEpisode?.still_path}` || anilistEpisode?.thumbnail || anilist?.coverImage?.extraLarge || "",
          number,
          overview: tmdbEpisode?.overview ?? "",
          date: tmdbEpisode?.air_date || formattedDate || "",
          duration: tmdbEpisode?.runtime || anilist?.duration || anilist?.shikimori?.duration || 0,
          filler,
          sub,
          dub,
        }
      })

      Config.REDIS && await this.redis.set(
        key,
        JSON.stringify(episodes),
        'EX',
        Config.REDIS_TIME
      );

      return episodes
    } catch (e) {
      throw new Error(String(e))
    }
  }

  async getEpisode(id: number, ep: number): Promise<Episode> {
    return (await this.getEpisodes(id)).find(e => e.number === ep) as Episode;
  }

  async getProvidersSingle(id: number, ep: number): Promise<ProviderInfo[]> {
    try {
      const key = `anime:providers:${id}:${ep}`

      if (Config.REDIS) {
        const cached = await this.redis.get(key)
        if (cached) {
          return JSON.parse(cached) as ProviderInfo[]
        }
      }

      const providers: ProviderInfo[] = []

      const zoroPromise = Config.ZORO_ENABLED ? this.aniwatch.getZoroByAnilist(id).catch(() => null) : Promise.resolve(null)
      const pahePromise = Config.ANIMEPAHE_ENABLED ? this.animepahe.getAnimepaheByAnilist(id).catch(() => null) : Promise.resolve(null)
      const kaiPromise = Config.ANIMEKAI_ENABLED ? this.animekai.getAnimekaiByAnilist(id).catch(() => null) : Promise.resolve(null)

      const [zoro, pahe, kai] = await Promise.all([zoroPromise, pahePromise, kaiPromise])

      const pushProvider = (
        id: string,
        filler: boolean,
        provider: Provider,
        type: SourceType
      ) => {
        providers.push({ id, filler, provider, type })
      }

      if (Config.ZORO_ENABLED && zoro) {
        const zoroEp = zoro.episodes?.find((e: EpisodeZoro, idx: number) =>
          e.number === ep || idx + 1 === ep
        )
        if (zoroEp) {
          const { id, isFiller, isSubbed, isDubbed } = zoroEp
          if (isSubbed) pushProvider(id, isFiller || false, Provider.zoro, SourceType.soft_sub)
          if (isDubbed) pushProvider(id, isFiller || false, Provider.zoro, SourceType.dub)
        }
      }

      if (Config.ANIMEPAHE_ENABLED && pahe) {
        const paheEp = pahe.episodes?.find((e: AnimepaheEpisode, idx: number) =>
          e.number === ep || idx + 1 === ep
        )
        if (paheEp) {
          pushProvider(paheEp.id, false, Provider.animepahe, SourceType.both)
        }
      }

      if (Config.ANIMEKAI_ENABLED && kai) {
        const kaiEp = kai.episodes?.find((e: AnimekaiEpisode, idx: number) =>
          e.number === ep || idx + 1 === ep
        )
        if (kaiEp) {
          const { id, isFiller, isSubbed, isDubbed } = kaiEp
          if (isSubbed) pushProvider(id, isFiller || false, Provider.animekai, SourceType.hard_sub)
          if (isDubbed) pushProvider(id, isFiller || false, Provider.animekai, SourceType.dub)
        }
      }

      Config.REDIS && await this.redis.set(
        key,
        JSON.stringify(providers),
        'EX',
        Config.REDIS_TIME
      );

      return providers
    } catch (e) {
      throw new Error(String(e))
    }
  }

  async getProvidersMultiple(id: number): Promise<(Episode & { providers: ProviderInfo[] })[]> {
    const episodes = await this.getEpisodes(id)

    const enrichedEpisodes = await Promise.all(
      episodes.map(async (ep) => {
        const providers = await this.getProvidersSingle(id, ep?.number || 0)
        return {
          ...ep,
          providers,
        }
      })
    )

    return enrichedEpisodes
  }

  async getSources(provider: Provider, ep: number, alId: number, dub: boolean = false): Promise<ISource> {
    if (
      (provider === Provider.zoro && !Config.ZORO_ENABLED) ||
      (provider === Provider.animepahe && !Config.ANIMEPAHE_ENABLED) ||
      (provider === Provider.animekai && !Config.ANIMEKAI_ENABLED)
    ) {
      throw new Error(`${Provider[provider]} provider is disabled`)
    }

    const providers = await this.getProvidersSingle(alId, ep)
    const epId = providers.find(p => p.provider === provider)?.id
    if (!epId) throw new Error("Episode not found for provider")

    const fetchMap = {
      [Provider.zoro]: async () => this.aniwatch.getSources(epId, dub),
      [Provider.animekai]: async () => this.animekai.getSources(epId, dub),
      [Provider.animepahe]: async () => this.animepahe.getSources(epId),
    }

    const fetchFn = fetchMap[provider]
    if (!fetchFn) throw new Error("Invalid provider")

    try {
      return fetchFn();
    } catch {
      throw new Error("No sources found")
    }
  }
}
