import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LastUpdated } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AnilistService } from '../anime/providers/anilist/service/anilist.service';
import { AnimekaiService } from '../anime/providers/animekai/service/animekai.service';
import { AnimepaheService } from '../anime/providers/animepahe/service/animepahe.service';
import { ShikimoriService } from '../anime/providers/shikimori/service/shikimori.service';
import { TmdbService, TmdbStatus } from '../anime/providers/tmdb/service/tmdb.service';
import { UpdateType } from '../shared/UpdateType'
import { ZoroService } from '../anime/providers/zoro/service/zoro.service'
import Config from '../configs/Config'
import { MediaStatus } from '../anime/providers/anilist/filter/Filter'
import { TvdbService, TvdbStatus } from '../anime/providers/tvdb/service/tvdb.service'
import { KitsuService } from '../anime/providers/kitsu/service/kitsu.service'

interface IProvider {
  update: (id: any) => any;
  type: UpdateType;
}

export enum Temperature {
  HOT,
  WARM,
  COLD
}

@Injectable()
export class UpdateService {
  constructor(
    private readonly AniService: AnilistService,
    private readonly AniKaiService: AnimekaiService,
    private readonly ZoroService: ZoroService,
    private readonly PaheService: AnimepaheService,
    private readonly ShikService: ShikimoriService,
    private readonly TmdbService: TmdbService,
    private readonly TvdbService: TvdbService,
    private readonly KitsuService: KitsuService,
    private readonly prisma: PrismaService,
  ) {}

  providers: IProvider[] = [
    {
      update: (id: any) => this.AniService.update(Number(id)),
      type: UpdateType.ANILIST,
    },
    {
      update: (id: any) => this.AniKaiService.update(String(id)),
      type: UpdateType.ANIMEKAI,
    },
    {
      update: (id: any) => this.PaheService.update(String(id)),
      type: UpdateType.ANIMEPAHE,
    },
    {
      update: (id: any) => this.ZoroService.update(String(id)),
      type: UpdateType.ANIWATCH,
    },
    {
      update: (id: any) => this.ShikService.update(String(id)),
      type: UpdateType.SHIKIMORI,
    },
    {
      update: (id: any) => this.TmdbService.update(Number(id)),
      type: UpdateType.TMDB,
    },
    {
      update: (id: any) => this.TvdbService.update(Number(id)),
      type: UpdateType.TVDB,
    },
    {
      update: (id: any) => this.KitsuService.updateKitsu(id),
      type: UpdateType.KITSU,
    },
  ];

  @Cron(CronExpression.EVERY_HOUR)
  async update() {
    if (!Config.UPDATE_ENABLED) return;

    for (const provider of this.providers) {
      try {
        const lastUpdates: LastUpdated[] =
          await this.prisma.lastUpdated.findMany({
            where: {
              type: provider.type,
            },
            distinct: ['entityId'],
          });
        if (!lastUpdates.length) continue;

        for (const lastUpdated of lastUpdates) {
          const now: Date = new Date();
          const lastTime: number = lastUpdated.createdAt.getTime();
          const lastDatePlusMonth = new Date(
            lastUpdated.createdAt.getFullYear(),
            lastUpdated.createdAt.getMonth() + 1,
            lastUpdated.createdAt.getDate(),
          );

          const type = lastUpdated.type as UpdateType;

          let temperature;

          if (type !== UpdateType.TMDB && type !== UpdateType.TVDB) {
            const anilist = await (async () => {
              switch (type) {
                case UpdateType.ANILIST:
                  return await this.AniService.getAnilist(lastUpdated.externalId || 0, true)
                case UpdateType.SHIKIMORI:
                  return await this.AniService.getAnilist(lastUpdated.externalId || 0, true)
                default:
                  return await this.AniService.getAnilist(lastUpdated.externalId || 0)
              }
            })()

            const anilistStatus = anilist.status as MediaStatus

            temperature = (() => {
              const { popularity, trending, averageScore, favourites, rankings } = anilist

              const rank = rankings?.find(r => r.allTime)?.rank ?? 9999
              const highScore = averageScore!! >= 80
              const hype = trending!! > 5000 || popularity!! > 100000
              const isTopRanked = rank <= 100

              if (anilistStatus === MediaStatus.RELEASING) {
                if (isTopRanked || (hype && highScore)) {
                  return Temperature.HOT
                } else if (hype || highScore) {
                  return Temperature.WARM
                } else {
                  return Temperature.COLD
                }
              }

              if (anilistStatus === MediaStatus.NOT_YET_RELEASED) {
                return hype ? Temperature.WARM : Temperature.COLD
              }

              return highScore || isTopRanked ? Temperature.WARM : Temperature.COLD
            })();
          } else {
            if (type === UpdateType.TMDB) {
              const tmdb = await this.TmdbService.getTmdb(lastUpdated.externalId || 0);
              const status = tmdb.status as TmdbStatus;

              temperature = (() => {
                switch (status) {
                  case TmdbStatus.InProduction:
                  case TmdbStatus.PostProduction:
                    return Temperature.HOT

                  case TmdbStatus.Planned:
                  case TmdbStatus.Rumored:
                  case TmdbStatus.ReturningSeries:
                    return Temperature.WARM

                  case TmdbStatus.Released:
                  case TmdbStatus.Ended:
                  case TmdbStatus.Canceled:
                    return Temperature.COLD

                  default:
                    return Temperature.COLD
                }
              })();
            } else {
              const tvdb = await this.TvdbService.getTvdb(lastUpdated.externalId || 0)
              const status = (tvdb.status as any)?.name as TvdbStatus

              temperature = (() => {
                switch (status) {
                  case TvdbStatus.Continuing:
                    return Temperature.HOT

                  case TvdbStatus.Pilot:
                    return Temperature.WARM

                  case TvdbStatus.Ended:
                  case TvdbStatus.Cancelled:
                    return Temperature.COLD

                  default:
                    return Temperature.COLD
                }
              })();
            }
          }

          const updateInterval = (() => {
            switch(temperature) {
              case Temperature.HOT:
                if (type === UpdateType.ANILIST || type === UpdateType.SHIKIMORI || type === UpdateType.TVDB) {
                  return 24 * 60 * 60 * 1000;
                }
                return 3 * 60 * 60 * 1000;
              case Temperature.WARM:
                if (type === UpdateType.ANILIST || type === UpdateType.SHIKIMORI || type === UpdateType.TVDB) {
                  return 7 * 24 * 60 * 60 * 1000;
                }
                return 3 * 24 * 60 * 60 * 1000;
              case Temperature.COLD:
                if (type === UpdateType.ANILIST || type === UpdateType.SHIKIMORI || type === UpdateType.TVDB) {
                  return 28 * 24 * 60 * 60 * 1000
                }
                return 21 * 24 * 60 * 60 * 1000;
              default:
                return 21 * 24 * 60 * 60 * 1000;
            }
          })();

          if (lastTime + updateInterval < now.getTime()) {
            console.log(
              `Updating ${provider.type} with ID:${lastUpdated.entityId}`,
            );

            provider.update(lastUpdated.entityId);
            await this.sleep(20);
          }

          if (lastDatePlusMonth.getTime() < now.getTime()) {
            await this.prisma.lastUpdated.delete({
              where: lastUpdated,
            });
          }
        }
      } catch (e) {
        console.error(`Error in ${provider.type} provider UpdateService:`, e);
      }
    }
  }

  public async sleep(delay: number): Promise<void> {
    console.log(`Sleeping for ${delay} seconds...`);
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
  }
}
