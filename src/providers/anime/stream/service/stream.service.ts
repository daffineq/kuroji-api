import { Injectable, NotFoundException } from '@nestjs/common';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import {
  AnimekaiEpisode,
  AnimepaheEpisode,
  EpisodeZoro,
  TmdbSeasonEpisode,
} from '@prisma/client';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import Config from '../../../../configs/config.js';
import { ISource } from '@consumet/extensions';
import {
  AvailableOn,
  BestProvider,
  Episode,
  EpisodeDetails,
  EpisodeImage,
  EpisodeUnion,
  Provider,
  ProviderInfo,
  SourceType,
} from '../types/types.js';
import { undefinedToNull } from '../../../../shared/interceptor.js';
import { getImage } from '../../tmdb/types/types.js';
import { TmdbSeasonService } from '../../tmdb/service/tmdb.season.service.js';
import { TmdbEpisodeService } from '../../tmdb/service/tmdb.episode.service.js';
import { findEpisodeCount } from '../../anilist/utils/utils.js';
import {
  AniZipEpisodeWithRelations,
  AniZipPayload,
} from '../../mappings/types/types.js';
import { animepaheFetch } from '../../animepahe/service/animepahe.fetch.service.js';
import { animekaiFetch } from '../../animekai/service/animekai.fetch.service.js';
import { zoroFetch } from '../../zoro/service/zoro.fetch.service.js';
import { fullSelect } from '../../anilist/types/types.js';
import { ZoroPayload } from '../../zoro/types/types.js';
import { AnimepahePayload } from '../../animepahe/types/types.js';
import { AnimeKaiPayload } from '../../animekai/types/types.js';

@Injectable()
export class StreamService {
  constructor(
    private readonly anilist: AnilistService,
    private readonly tmdbSeason: TmdbSeasonService,
    private readonly tmdbEpisode: TmdbEpisodeService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getEpisodes(id: number): Promise<Episode[]> {
    try {
      const key = `anime:episodes:${id}`;

      if (Config.REDIS) {
        const cached = await this.redis.get(key);
        if (cached) {
          return JSON.parse(cached) as Episode[];
        }
      }

      const anilist = await this.anilist
        .getAnilist(id, fullSelect)
        .catch(() => null);
      if (!anilist) throw new NotFoundException('Anilist not found');

      const season = await this.tmdbSeason
        .getTmdbSeasonByAnilist(id)
        .catch(() => null);

      const zoro = anilist.zoro as ZoroPayload;
      const animepahe = anilist.animepahe as AnimepahePayload;
      const anizip = anilist.anizip as AniZipPayload;

      const episodesZoro = (zoro?.episodes || []).sort(
        (a, b) => (a.number || 0) - (b.number || 0),
      );
      const episodesPahe = animepahe?.episodes || [];
      const tmdbEpisodes = (season?.episodes || []).sort(
        (a, b) => (a.episode_number || 0) - (b.episode_number || 0),
      );
      const anizipEpisodes = (anizip?.episodes || []).sort(
        (a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0),
      );

      const episodeCount = findEpisodeCount(anilist);

      const zoroMap = new Map<number, EpisodeZoro>();
      episodesZoro.forEach((ep) => {
        if (ep.number != null) zoroMap.set(ep.number, ep);
      });

      const paheMap = new Map<number, AnimepaheEpisode>();
      episodesPahe.forEach((ep, idx) => {
        paheMap.set(idx + 1, ep);
      });

      const tmdbMap = new Map<number, TmdbSeasonEpisode>();
      tmdbEpisodes.forEach((ep) => {
        if (ep.episode_number != null) tmdbMap.set(ep.episode_number, ep);
      });

      const anizipMap = new Map<number, AniZipEpisodeWithRelations>();
      anizipEpisodes.forEach((ep) => {
        if (ep.episodeNumber != null) anizipMap.set(ep.episodeNumber, ep);
      });

      const providerCounts: BestProvider<EpisodeUnion>[] = [
        { name: 'zoro', count: episodesZoro.length, episodes: episodesZoro },
        { name: 'pahe', count: episodesPahe.length, episodes: episodesPahe },
        { name: 'tmdb', count: tmdbEpisodes.length, episodes: tmdbEpisodes },
        {
          name: 'anizip',
          count: anizipEpisodes.length,
          episodes: anizipEpisodes,
        },
      ];

      let bestProvider: BestProvider<EpisodeUnion>;
      if (episodeCount != null) {
        bestProvider = providerCounts.reduce((best, current) => {
          const currentDiff = Math.abs(current.count - episodeCount);
          const bestDiff = Math.abs(best.count - episodeCount);
          return currentDiff < bestDiff ? current : best;
        });
      } else {
        bestProvider = providerCounts.reduce((best, current) => {
          return current.count > best.count ? current : best;
        });
      }

      const allNumbers = new Set<number>();

      if (episodeCount != null) {
        const maxEpisodes = Math.min(bestProvider.count, episodeCount);

        if (bestProvider.name === 'zoro') {
          episodesZoro.slice(0, maxEpisodes).forEach((e) => {
            if (e.number != null) allNumbers.add(e.number);
          });
        } else if (bestProvider.name === 'pahe') {
          for (let i = 1; i <= maxEpisodes; i++) {
            allNumbers.add(i);
          }
        } else if (bestProvider.name === 'tmdb') {
          tmdbEpisodes.slice(0, maxEpisodes).forEach((e) => {
            if (e.episode_number != null) allNumbers.add(e.episode_number);
          });
        } else if (bestProvider.name === 'anizip') {
          anizipEpisodes.slice(0, maxEpisodes).forEach((e) => {
            if (e.episodeNumber != null) allNumbers.add(e.episodeNumber);
          });
        }

        for (let i = 1; i <= episodeCount; i++) {
          if (!allNumbers.has(i)) {
            const hasInZoro = episodesZoro.some((e) => e.number === i);
            const hasInPahe = i <= episodesPahe.length;
            const hasInTmdb = tmdbEpisodes.some((e) => e.episode_number === i);
            const hasInAnizip = anizipEpisodes.some(
              (e) => e.episodeNumber === i,
            );

            if (hasInZoro || hasInPahe || hasInTmdb || hasInAnizip) {
              allNumbers.add(i);
            }
          }
        }
      } else {
        if (bestProvider.name === 'zoro') {
          episodesZoro.forEach((e) => {
            if (e.number != null) allNumbers.add(e.number);
          });
        } else if (bestProvider.name === 'pahe') {
          for (let i = 1; i <= episodesPahe.length; i++) {
            allNumbers.add(i);
          }
        } else if (bestProvider.name === 'tmdb') {
          tmdbEpisodes.forEach((e) => {
            if (e.episode_number != null) allNumbers.add(e.episode_number);
          });
        } else if (bestProvider.name === 'anizip') {
          anizipEpisodes.forEach((e) => {
            if (e.episodeNumber != null) allNumbers.add(e.episodeNumber);
          });
        }

        const bestProviderNumbers = new Set(Array.from(allNumbers));

        episodesZoro.forEach((e) => {
          if (e.number != null && !bestProviderNumbers.has(e.number)) {
            allNumbers.add(e.number);
          }
        });
        tmdbEpisodes.forEach((e) => {
          if (
            e.episode_number != null &&
            !bestProviderNumbers.has(e.episode_number)
          ) {
            allNumbers.add(e.episode_number);
          }
        });
        anizipEpisodes.forEach((e) => {
          if (
            e.episodeNumber != null &&
            !bestProviderNumbers.has(e.episodeNumber)
          ) {
            allNumbers.add(e.episodeNumber);
          }
        });
        for (let i = 1; i <= episodesPahe.length; i++) {
          if (!bestProviderNumbers.has(i)) {
            allNumbers.add(i);
          }
        }
      }

      let episodes: Episode[] = Array.from(allNumbers)
        .sort((a, b) => a - b)
        .map((number) => {
          const zoroEp = zoroMap.get(number);
          const paheEp = paheMap.get(number);
          const tmdbEpisode = tmdbMap.get(number);
          const anizipEpisode = anizipMap.get(number);

          const airDate = anilist?.airingSchedule?.find(
            (s) => s.episode === number,
          )?.airingAt;

          const formattedDate = tmdbEpisode?.air_date
            ? new Date(tmdbEpisode.air_date)
            : anizipEpisode?.airDate
              ? new Date(anizipEpisode.airDate)
              : airDate
                ? new Date(airDate * 1000)
                : anilist?.startDate?.year &&
                    anilist?.startDate?.month &&
                    anilist?.startDate?.day
                  ? new Date(
                      anilist.startDate.year,
                      anilist.startDate.month - 1,
                      anilist.startDate.day,
                    )
                  : undefined;

          const title =
            tmdbEpisode?.name ||
            anizipEpisode?.titles?.find((t) => t.key === 'en')?.name ||
            zoroEp?.title ||
            paheEp?.title;
          const image =
            getImage(tmdbEpisode?.still_path) ||
            getImage(anizipEpisode?.image, true) ||
            getImage(paheEp?.image, true);

          const overview = tmdbEpisode?.overview || anizipEpisode?.overview;

          const duration =
            tmdbEpisode?.runtime || anizipEpisode?.runtime || anilist?.duration;

          const filler = zoroEp?.isFiller ?? false;
          const sub = zoroEp?.isSubbed ?? (paheEp ? true : false);
          const dub = zoroEp?.isDubbed ?? (paheEp ? false : false);

          const availableOn: AvailableOn = {
            animepahe: paheEp ? true : false,
            animekai: false,
            zoro: zoroEp ? true : false,
          };

          return {
            title,
            image,
            number,
            overview,
            date: formattedDate ? formattedDate.toISOString() : undefined,
            duration,
            filler,
            sub,
            dub,
            availableOn,
          };
        });

      episodes = episodes
        .filter((e) => e.number && e.number > 0)
        .sort((a, b) => a.number! - b.number!);

      if (Config.REDIS) {
        await this.redis.set(
          key,
          JSON.stringify(undefinedToNull(episodes)),
          'EX',
          Config.REDIS_TIME,
        );
      }

      return episodes;
    } catch (e) {
      throw new Error(String(e));
    }
  }

  async getEpisode(id: number, ep: number): Promise<EpisodeDetails> {
    const key = `anime:episode:details:${id}:${ep}`;

    if (Config.REDIS) {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached) as EpisodeDetails;
      }
    }

    const details = await this.tmdbEpisode
      .getEpisodeDetailsByAnilist(id, ep)
      .catch(() => null);

    const data = (await this.getEpisodes(id)).find(
      (e) => e.number === ep,
    ) as Episode;

    const images: EpisodeImage[] = details?.images?.stills
      ? details.images.stills.map((s) => ({
          image: getImage(s.file_path),
          aspectRation: s.aspect_ratio ?? 0,
          height: s.height ?? 0,
          width: s.width ?? 0,
          iso_639_1: s.iso_639_1 ?? '',
          voteAverage: s.vote_average ?? 0,
          voteCount: s.vote_count ?? 0,
        }))
      : [];

    const episode: EpisodeDetails = {
      ...data,
      images,
    };

    if (Config.REDIS) {
      await this.redis.set(
        key,
        JSON.stringify(undefinedToNull(episode)),
        'EX',
        Config.REDIS_TIME,
      );
    }

    return episode;
  }

  async getProvidersSingle(id: number, ep: number): Promise<ProviderInfo[]> {
    try {
      const key = `anime:providers:${id}:${ep}`;

      if (Config.REDIS) {
        const cached = await this.redis.get(key);
        if (cached) {
          return JSON.parse(cached) as ProviderInfo[];
        }
      }

      const providers: ProviderInfo[] = [];

      const anilist = await this.anilist
        .getAnilist(id, fullSelect)
        .catch(() => null);
      if (!anilist) throw new NotFoundException('Anilist not found');

      const zoro = anilist.zoro as ZoroPayload;
      const animepahe = anilist.animepahe as AnimepahePayload;
      const animekai = anilist.animekai as AnimeKaiPayload;

      const pushProvider = (
        id: string,
        filler: boolean,
        provider: Provider,
        type: SourceType,
      ) => {
        providers.push({ id, filler, provider, type });
      };

      if (Config.ZORO_ENABLED && zoro) {
        const zoroEp = zoro.episodes?.find(
          (e: EpisodeZoro, idx: number) => e.number === ep || idx + 1 === ep,
        );
        if (zoroEp) {
          const { id, isFiller, isSubbed, isDubbed } = zoroEp;
          if (isSubbed)
            pushProvider(
              id,
              isFiller || false,
              Provider.zoro,
              SourceType.soft_sub,
            );
          if (isDubbed)
            pushProvider(id, isFiller || false, Provider.zoro, SourceType.dub);
        }
      }

      if (Config.ANIMEPAHE_ENABLED && animepahe) {
        const paheEp = animepahe.episodes?.find(
          (e: AnimepaheEpisode, idx: number) =>
            e.number === ep || idx + 1 === ep,
        );
        if (paheEp) {
          pushProvider(paheEp.id, false, Provider.animepahe, SourceType.both);
        }
      }

      if (Config.ANIMEKAI_ENABLED && animekai) {
        const kaiEp = animekai.episodes?.find(
          (e: AnimekaiEpisode, idx: number) =>
            e.number === ep || idx + 1 === ep,
        );
        if (kaiEp) {
          const { id, isFiller, isSubbed, isDubbed } = kaiEp;
          if (isSubbed)
            pushProvider(
              id,
              isFiller || false,
              Provider.animekai,
              SourceType.hard_sub,
            );
          if (isDubbed)
            pushProvider(
              id,
              isFiller || false,
              Provider.animekai,
              SourceType.dub,
            );
        }
      }

      if (Config.REDIS) {
        await this.redis.set(
          key,
          JSON.stringify(undefinedToNull(providers)),
          'EX',
          Config.REDIS_TIME,
        );
      }

      return providers;
    } catch (e) {
      throw new Error(String(e));
    }
  }

  async getSources(
    provider: Provider,
    ep: number,
    alId: number,
    dub: boolean = false,
  ): Promise<ISource> {
    const providers = await this.getProvidersSingle(alId, ep);
    const epId = providers.find((p) => p.provider === provider)?.id;
    if (!epId) throw new NotFoundException('Episode not found for provider');

    const fetchMap: { [key: string]: () => Promise<ISource> } = {};

    if (Config.ZORO_ENABLED) {
      fetchMap[Provider.zoro] = async () => zoroFetch.getSources(epId, dub);
    }

    if (Config.ANIMEKAI_ENABLED) {
      fetchMap[Provider.animekai] = async () =>
        animekaiFetch.getSources(epId, dub);
    }

    if (Config.ANIMEPAHE_ENABLED) {
      fetchMap[Provider.animepahe] = async () =>
        animepaheFetch.getSources(epId);
    }

    const fetchFn = fetchMap[provider];
    if (!fetchFn) throw new Error('Invalid provider');

    try {
      return fetchFn();
    } catch {
      throw new NotFoundException('No sources found');
    }
  }
}
