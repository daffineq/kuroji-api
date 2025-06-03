import { Injectable } from '@nestjs/common';
import { ZoroService } from '../../zoro/service/zoro.service';
import { AnimekaiService } from '../../animekai/service/animekai.service';
import { AnimepaheService } from '../../animepahe/service/animepahe.service';
import { AnilistService } from '../../anilist/service/anilist.service';
import { TmdbService } from '../../tmdb/service/tmdb.service';
import { AnimekaiEpisode, AnimepaheEpisode, EpisodeZoro } from '@prisma/client';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import Config from '../../../../configs/Config';
import { ISource } from '@consumet/extensions';
import { TMDB } from '../../../../configs/tmdb.config';
import {
  Episode,
  EpisodeDetails,
  EpisodeImage,
  Provider,
  ProviderInfo,
  SourceType,
} from '../types/types';

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
        const cached = await this.redis.get(key);
        if (cached) {
          return JSON.parse(cached) as Episode[];
        }
      }

      const [aniwatch, season, anilist] = await Promise.all([
        this.aniwatch.getZoroByAnilist(id).catch(() => null),
        this.tmdb.getTmdbSeasonByAnilist(id).catch(() => null),
        this.anilist.getAnilist(id).catch(() => null),
      ]);

      const episodesZoro = aniwatch?.episodes || [];
      const tmdbEpisodes = season?.episodes || [];
      const anilistEpisodes = anilist?.streamingEpisodes || [];

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

        const anilistEpisode = anilistEpisodes.find((e) => {
          const match = e.title?.match(/.*?(\d+).*/);
          return match ? parseInt(match[1]) === number : false;
        });

        const airDate =
          anilist?.airingSchedule?.find((s) => s.episode == number)?.airingAt ||
          0;

        const formattedDate = new Date(airDate * 1000).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          },
        );

        return {
          title: tmdbEpisode?.name || anilistEpisode?.title || zoroTitle,
          image: {
            w300: `${TMDB.getImageUrl('w300')}${tmdbEpisode?.still_path}`,
            w500: `${TMDB.getImageUrl('w500')}${tmdbEpisode?.still_path}`,
            original: `${TMDB.IMAGE_BASE_ORIGINAL_URL}${tmdbEpisode?.still_path}`,
          },
          number,
          overview: tmdbEpisode?.overview ?? '',
          date: tmdbEpisode?.air_date || formattedDate || '',
          duration:
            tmdbEpisode?.runtime ||
            anilist?.duration ||
            anilist?.shikimori?.duration ||
            anilist?.kitsu?.episodeLength ||
            0,
          filler,
          sub,
          dub,
        };
      });

      if (Config.REDIS) {
        await this.redis.set(
          key,
          JSON.stringify(episodes),
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
    const details = await this.tmdb
      .getEpisodeDetailsByAnilist(id, ep)
      .catch(() => null);
    const data = (await this.getEpisodes(id)).find(
      (e) => e.number === ep,
    ) as Episode;

    const images: EpisodeImage[] = details?.images?.stills
      ? details.images.stills.map((s) => ({
          image: {
            w300: `${TMDB.getImageUrl('w300')}${s.file_path}`,
            w500: `${TMDB.getImageUrl('w500')}${s.file_path}`,
            original: `${TMDB.IMAGE_BASE_ORIGINAL_URL}${s.file_path}`,
          },
          aspectRation: s.aspect_ratio ?? 0,
          height: s.height ?? 0,
          width: s.width ?? 0,
          iso_639_1: s.iso_639_1 ?? '',
          voteAverage: s.vote_average ?? 0,
          voteCount: s.vote_count ?? 0,
        }))
      : [];

    return {
      ...data,
      images,
    };
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

      const [zoro, pahe, kai] = await Promise.all([
        this.aniwatch.getZoroByAnilist(id).catch(() => null),
        this.animepahe.getAnimepaheByAnilist(id).catch(() => null),
        this.animekai.getAnimekaiByAnilist(id).catch(() => null),
      ]);

      const pushProvider = (
        id: string,
        filler: boolean,
        provider: Provider,
        type: SourceType,
      ) => {
        providers.push({ id, filler, provider, type });
      };

      if (zoro) {
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

      if (pahe) {
        const paheEp = pahe.episodes?.find(
          (e: AnimepaheEpisode, idx: number) =>
            e.number === ep || idx + 1 === ep,
        );
        if (paheEp) {
          pushProvider(paheEp.id, false, Provider.animepahe, SourceType.both);
        }
      }

      if (kai) {
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
          JSON.stringify(providers),
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

    const fetchMap = {
      [Provider.zoro]: async () => this.aniwatch.getSources(epId, dub),
      [Provider.animekai]: async () => this.animekai.getSources(epId, dub),
      [Provider.animepahe]: async () => this.animepahe.getSources(epId),
    };

    const fetchFn = fetchMap[provider];
    if (!fetchFn) throw new Error('Invalid provider');

    try {
      return fetchFn();
    } catch {
      throw new Error('No sources found');
    }
  }
}
