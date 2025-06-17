import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Config from '../../configs/config';
import { PrismaService } from '../../prisma.service';
import { UpdateType } from './UpdateType';
import { sleep } from '../../utils/utils';
import { AnilistService } from '../anime/anilist/service/anilist.service';
import { AnimekaiService } from '../anime/animekai/service/animekai.service';
import { AnimepaheService } from '../anime/animepahe/service/animepahe.service';
import { KitsuService } from '../anime/kitsu/service/kitsu.service';
import { ShikimoriService } from '../anime/shikimori/service/shikimori.service';
import { TmdbService } from '../anime/tmdb/service/tmdb.service';
import { TvdbService } from '../anime/tvdb/service/tvdb.service';
import { ZoroService } from '../anime/zoro/service/zoro.service';
import { AppLockService } from '../../shared/app.lock.service';

interface IProvider {
  update: (id: string | number) => Promise<any>;
  type: UpdateType;
}

const SLEEP_BETWEEN_UPDATES = 30;

@Injectable()
export class UpdateService {
  private readonly providers: IProvider[];

  constructor(
    private readonly anilistService: AnilistService,
    private readonly animekaiService: AnimekaiService,
    private readonly zoroService: ZoroService,
    private readonly animepaheService: AnimepaheService,
    private readonly shikimoriService: ShikimoriService,
    private readonly tmdbService: TmdbService,
    private readonly tvdbService: TvdbService,
    private readonly kitsuService: KitsuService,
    private readonly lock: AppLockService,
    private readonly prisma: PrismaService,
  ) {
    this.providers = [
      {
        update: (id: any) => this.anilistService.update(Number(id)),
        type: UpdateType.ANILIST,
      },
      {
        update: (id: any) => this.animekaiService.update(Number(id)),
        type: UpdateType.ANIMEKAI,
      },
      {
        update: (id: any) => this.animepaheService.update(Number(id)),
        type: UpdateType.ANIMEPAHE,
      },
      {
        update: (id: any) => this.zoroService.update(Number(id)),
        type: UpdateType.ANIWATCH,
      },
      {
        update: (id: any) => this.shikimoriService.update(String(id)),
        type: UpdateType.SHIKIMORI,
      },
      {
        update: (id: any) => this.tmdbService.updateByAnilist(Number(id)),
        type: UpdateType.TMDB,
      },
      {
        update: (id: any) => this.tvdbService.updateByAnilist(Number(id)),
        type: UpdateType.TVDB,
      },
      {
        update: (id: any) => this.kitsuService.updateByAnilist(Number(id)),
        type: UpdateType.KITSU,
      },
    ];
  }

  async getJustAiredAnime(hoursBack: number = 2) {
    const now = Math.floor(Date.now() / 1000);
    const startTime = now - hoursBack * 60 * 60;

    const justAired = await this.prisma.anilist.findMany({
      where: {
        airingSchedule: {
          some: {
            airingAt: {
              gte: startTime,
              lte: now,
            },
          },
        },
      },
      select: {
        id: true,
        idMal: true,
      },
      orderBy: {
        trending: 'desc',
      },
    });

    return justAired;
  }

  async update() {
    if (!Config.UPDATE_ENABLED) {
      console.log('[UpdateService] Updates disabled. Skipping.');
      return;
    }

    if (this.lock.isLocked(Config.INDEXER_RUNNING_KEY)) {
      console.log('[UpdateService] Indexer is running. Skipping update.');
      return;
    }

    if (!this.lock.acquire(Config.UPDATE_RUNNING_KEY)) {
      console.log('[UpdateService] Update already in progress. Skipping.');
      return;
    }

    console.log('[UpdateService] Starting update process...');

    try {
      const animes = await this.getJustAiredAnime();
      console.log(
        `[UpdateService] Found ${animes.length} recently aired anime(s).`,
      );

      for (const anime of animes) {
        console.log(
          `[UpdateService] Updating anime ID ${anime.id} (MAL ID: ${anime.idMal})`,
        );

        for (const provider of this.providers) {
          try {
            const providerName = UpdateType[provider.type];

            if (provider.type === UpdateType.SHIKIMORI) {
              if (anime.idMal) {
                console.log(
                  `[${providerName}] Updating with MAL ID ${anime.idMal}...`,
                );
                await provider.update(anime.idMal);
                console.log(`[${providerName}] Success`);
              } else {
                console.log(`[${providerName}] Skipped (no MAL ID)`);
              }
            } else {
              console.log(
                `[${providerName}] Updating with AniList ID ${anime.id}...`,
              );
              await provider.update(anime.id);
              console.log(`  ✅ [${providerName}] Success`);
            }
          } catch (providerErr) {
            console.error(
              `[${UpdateType[provider.type]}] Failed to update:`,
              providerErr,
            );
          }

          console.log(
            `Sleeping ${SLEEP_BETWEEN_UPDATES}s before next provider...`,
          );
          await sleep(SLEEP_BETWEEN_UPDATES);
        }
      }

      console.log('[UpdateService] All updates complete.');
    } catch (e) {
      console.error('[UpdateService] Failed during update loop:', e);
    } finally {
      this.lock.release(Config.UPDATE_RUNNING_KEY);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateAnime() {
    await this.update();
  }
}
