import { Injectable } from '@nestjs/common';
import { ZoroService } from '../../zoro/service/zoro.service';
import { AnimekaiService } from '../../animekai/service/animekai.service';
import { AnimepaheService } from '../../animepahe/service/animepahe.service';
import { AnilistService } from '../../anilist/service/anilist.service';
import { AnimekaiEpisode, AnimepaheEpisode, EpisodeZoro } from '@prisma/client';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import Config from '../../../../configs/config';
import { ISource } from '@consumet/extensions';
import {
  Episode,
  EpisodeDetails,
  EpisodeImage,
  Provider,
  ProviderInfo,
  SourceType,
} from '../types/types';
import { undefinedToNull } from '../../../../shared/interceptor';
import { getImage } from '../../tmdb/types/types';
import { TmdbSeasonService } from '../../tmdb/service/tmdb.season.service';
import { TmdbEpisodeService } from '../../tmdb/service/tmdb.episode.service';

@Injectable()
export class StreamService {
  constructor(
    private readonly aniwatch: ZoroService,
    private readonly animekai: AnimekaiService,
    private readonly animepahe: AnimepaheService,
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

      const [aniwatch, season, anilist] = await Promise.all([
        this.aniwatch.getZoroByAnilist(id).catch(() => null),
        this.tmdbSeason.getTmdbSeasonByAnilist(id).catch(() => null),
        this.anilist.getAnilist(id).catch(() => null),
      ]);

      const episodesZoro = aniwatch?.episodes || [];
      const tmdbEpisodes = season?.episodes || [];

      const episodes: Episode[] = episodesZoro.map((episode) => {
        const {
          isFiller: filler = false,
          isSubbed: sub = false,
          isDubbed: dub = false,
          number,
          title: zoroTitle,
        } = episode;

        const tmdbEpisode = tmdbEpisodes.find(
          (e) => e.episode_number === number,
        );

        const airDate = anilist?.airingSchedule?.find(
          (s) => s.episode === number,
        )?.airingAt;

        const formattedDate = tmdbEpisode?.air_date
          ? new Date(tmdbEpisode.air_date)
          : airDate
            ? new Date(airDate * 1000)
            : undefined;

        return {
          title: tmdbEpisode?.name || zoroTitle,
          image: getImage(tmdbEpisode?.still_path),
          number,
          overview: tmdbEpisode?.overview ?? '',
          date: formattedDate ? formattedDate.toISOString() : '',
          duration: tmdbEpisode?.runtime || anilist?.duration || 0,
          filler,
          sub,
          dub,
        };
      });

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

      const promises: Promise<any>[] = [];

      if (Config.ZORO_ENABLED) {
        promises.push(this.aniwatch.getZoroByAnilist(id).catch(() => null));
      } else {
        promises.push(Promise.resolve(null));
      }

      if (Config.ANIMEPAHE_ENABLED) {
        promises.push(
          this.animepahe.getAnimepaheByAnilist(id).catch(() => null),
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      if (Config.ANIMEKAI_ENABLED) {
        promises.push(this.animekai.getAnimekaiByAnilist(id).catch(() => null));
      } else {
        promises.push(Promise.resolve(null));
      }

      const [zoro, pahe, kai] = await Promise.all(promises);

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

      if (Config.ANIMEPAHE_ENABLED && pahe) {
        const paheEp = pahe.episodes?.find(
          (e: AnimepaheEpisode, idx: number) =>
            e.number === ep || idx + 1 === ep,
        );
        if (paheEp) {
          pushProvider(paheEp.id, false, Provider.animepahe, SourceType.both);
        }
      }

      if (Config.ANIMEKAI_ENABLED && kai) {
        const kaiEp = kai.episodes?.find(
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
    if (!epId) throw new Error('Episode not found for provider');

    const fetchMap: { [key: string]: () => Promise<ISource> } = {};

    if (Config.ZORO_ENABLED) {
      fetchMap[Provider.zoro] = async () => this.aniwatch.getSources(epId, dub);
    }

    if (Config.ANIMEKAI_ENABLED) {
      fetchMap[Provider.animekai] = async () =>
        this.animekai.getSources(epId, dub);
    }

    if (Config.ANIMEPAHE_ENABLED) {
      fetchMap[Provider.animepahe] = async () =>
        this.animepahe.getSources(epId);
    }

    const fetchFn = fetchMap[provider];
    if (!fetchFn) throw new Error('Invalid provider');

    try {
      return fetchFn();
    } catch {
      throw new Error('No sources found');
    }
  }
}
