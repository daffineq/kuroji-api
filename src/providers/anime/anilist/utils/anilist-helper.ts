import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { FullMediaResponse } from '../types/response.js';
import { Prisma } from '@prisma/client';
import { DateUtils } from '../../../../shared/date.utils.js';

@Injectable()
export class AnilistHelper {
  constructor(private readonly prisma: PrismaService) {}

  public async getDataForPrisma(
    anime: FullMediaResponse,
  ): Promise<Prisma.AnilistCreateInput> {
    const isMalExist = anime.idMal
      ? !!(await this.prisma.anilist.findUnique({
          where: { idMal: anime.idMal },
          select: { id: true },
        }))
      : false;

    // Get all aired episodes
    const airedEpisodes = anime.airingSchedule.edges
      .filter((schedule) => DateUtils.isPast(schedule.node.airingAt))
      .sort((a, b) => b.node.airingAt - a.node.airingAt);

    // Get all future episodes
    const futureEpisodes = anime.airingSchedule.edges
      .filter((schedule) => DateUtils.isFuture(schedule.node.airingAt))
      .sort((a, b) => a.node.airingAt - b.node.airingAt);

    // Get latest episode (most recent aired)
    const latestEpisode = airedEpisodes[0]?.node;

    // Get next episode (next to air)
    const nextEpisode = futureEpisodes[0]?.node;

    // Get last episode (last in the series)
    const lastEpisode = [...anime.airingSchedule.edges].sort(
      (a, b) => (b.node.episode ?? 0) - (a.node.episode ?? 0),
    )[0]?.node;

    return {
      id: anime.id,
      idMal: isMalExist ? undefined : (anime.idMal ?? undefined),
      title: {
        connectOrCreate: {
          where: { anilistId: anime.id },
          create: {
            romaji: anime.title?.romaji ?? null,
            english: anime.title?.english ?? null,
            native: anime.title?.native ?? null,
          },
        },
      },
      coverImage: {
        connectOrCreate: {
          where: { anilistId: anime.id },
          create: {
            color: anime.coverImage?.color ?? null,
            large: anime.coverImage?.large ?? null,
            medium: anime.coverImage?.medium ?? null,
            extraLarge: anime.coverImage?.extraLarge ?? null,
          },
        },
      },
      bannerImage: anime.bannerImage,
      status: anime.status,
      type: anime.type,
      format: anime.format,
      updatedAt: anime.updatedAt,
      description: anime.description,
      startDate: {
        connectOrCreate: {
          where: { anilistId: anime.id },
          create: {
            day: anime.startDate?.day ?? null,
            month: anime.startDate?.month ?? null,
            year: anime.startDate?.year ?? null,
          },
        },
      },
      endDate: {
        connectOrCreate: {
          where: { anilistId: anime.id },
          create: {
            day: anime.endDate?.day ?? null,
            month: anime.endDate?.month ?? null,
            year: anime.endDate?.year ?? null,
          },
        },
      },
      season: anime.season,
      seasonYear: anime.seasonYear,
      episodes: anime.episodes,
      duration: anime.duration,
      countryOfOrigin: anime.countryOfOrigin,
      isLicensed: anime.isLicensed,
      source: anime.source,
      hashtag: anime.hashtag,
      trailer: anime.trailer
        ? {
            connectOrCreate: {
              where: { id: anime.trailer?.id },
              create: {
                id: anime.trailer?.id ?? undefined,
                site: anime.trailer?.site ?? null,
                thumbnail: anime.trailer?.thumbnail ?? null,
              },
            },
          }
        : undefined,
      isLocked: anime.isLocked,
      isAdult: anime.isAdult,
      averageScore: anime.averageScore,
      meanScore: anime.meanScore,
      score: ((anime.meanScore ?? 0) + (anime.averageScore ?? 0)) / 2,
      popularity: anime.popularity,
      trending: anime.trending,
      favourites: anime.favourites,
      genres: anime.genres,
      synonyms: anime.synonyms,
      latestAiringEpisode: latestEpisode
        ? {
            connectOrCreate: {
              where: { id: latestEpisode.id },
              create: {
                id: latestEpisode.id,
                episode: latestEpisode.episode ?? null,
                airingAt: latestEpisode.airingAt ?? null,
              },
            },
          }
        : undefined,
      nextAiringEpisode: nextEpisode
        ? {
            connectOrCreate: {
              where: { id: nextEpisode.id },
              create: {
                id: nextEpisode.id,
                episode: nextEpisode.episode ?? null,
                airingAt: nextEpisode.airingAt ?? null,
              },
            },
          }
        : undefined,
      lastAiringEpisode: lastEpisode
        ? {
            connectOrCreate: {
              where: { id: lastEpisode.id },
              create: {
                id: lastEpisode.id,
                episode: lastEpisode.episode ?? null,
                airingAt: lastEpisode.airingAt ?? null,
              },
            },
          }
        : undefined,
      recommendations: {
        connectOrCreate:
          anime.recommendations?.edges
            ?.filter((edge) => edge?.node?.mediaRecommendation?.id != null)
            .map((edge) => ({
              where: { id: edge.node.mediaRecommendation.id },
              create: {
                id: edge.node.mediaRecommendation.id,
                idMal: edge.node.mediaRecommendation.idMal ?? null,
              },
            })) ?? [],
      },
      characters: {
        connectOrCreate:
          anime.characters?.edges
            ?.filter((edge) => edge?.id && edge?.node?.id)
            .map((edge) => ({
              where: { id: edge.id },
              create: {
                id: edge.id,
                role: edge.role ?? null,
                character: {
                  connectOrCreate: {
                    where: { id: edge.node.id },
                    create: {
                      id: edge.node.id,
                      name: edge.node.name
                        ? {
                            create: {
                              full: edge.node.name.full ?? null,
                              native: edge.node.name.native ?? null,
                              alternative: edge.node.name.alternative ?? [],
                            },
                          }
                        : undefined,
                      image: edge.node.image
                        ? {
                            create: {
                              large: edge.node.image.large ?? null,
                              medium: edge.node.image.medium ?? null,
                            },
                          }
                        : undefined,
                    },
                  },
                },
                voiceActors: {
                  connectOrCreate:
                    edge.voiceActors
                      ?.filter((va) => va?.id)
                      .map((va) => ({
                        where: { id: va.id },
                        create: {
                          id: va.id,
                          language: va.languageV2 ?? null,
                          name: va.name
                            ? {
                                create: {
                                  full: va.name.full ?? null,
                                  native: va.name.native ?? null,
                                  alternative: va.name.alternative ?? [],
                                },
                              }
                            : undefined,
                          image: va.image
                            ? {
                                create: {
                                  large: va.image.large ?? null,
                                  medium: va.image.medium ?? null,
                                },
                              }
                            : undefined,
                        },
                      })) ?? [],
                },
              },
            })) ?? [],
      },
      studios: {
        connectOrCreate:
          anime.studios?.edges
            ?.filter((edge) => edge?.id && edge?.node?.id)
            .map((edge) => ({
              where: { id: edge.id },
              create: {
                id: edge.id,
                isMain: edge.isMain ?? false,
                studio: {
                  connectOrCreate: {
                    where: { id: edge.node.id },
                    create: {
                      id: edge.node.id,
                      name: edge.node.name ?? null,
                    },
                  },
                },
              },
            })) ?? [],
      },
      airingSchedule: {
        connectOrCreate:
          anime.airingSchedule?.edges.map((edge) => ({
            where: { id: edge.node.id },
            create: {
              id: edge.node.id,
              episode: edge.node.episode ?? null,
              airingAt: edge.node.airingAt ?? null,
            },
          })) ?? [],
      },
      tags: {
        connectOrCreate:
          anime.tags?.map((tag) => ({
            where: {
              anilistId_tagId: {
                anilistId: anime.id,
                tagId: tag.id,
              },
            },
            create: {
              rank: tag.rank ?? null,
              isMediaSpoiler: tag.isMediaSpoiler ?? false,
              tag: {
                connectOrCreate: {
                  where: { id: tag.id },
                  create: {
                    id: tag.id,
                    name: tag.name,
                    description: tag.description ?? null,
                    category: tag.category ?? null,
                    isGeneralSpoiler: tag.isGeneralSpoiler ?? false,
                    isAdult: tag.isAdult ?? false,
                  },
                },
              },
            },
          })) ?? [],
      },
      rankings: {
        connectOrCreate: anime.rankings?.map((ranking) => ({
          where: { id: ranking.id },
          create: {
            id: ranking.id,
            rank: ranking.rank ?? null,
            type: ranking.type ?? null,
            format: ranking.format ?? null,
            year: ranking.year ?? null,
            season: ranking.season ?? null,
            allTime: ranking.allTime ?? false,
            context: ranking.context ?? null,
          },
        })),
      },
      externalLinks: {
        connectOrCreate:
          anime.externalLinks?.map((link) => ({
            where: { id: link.id },
            create: {
              id: link.id,
              url: link.url ?? null,
              site: link.site ?? null,
              siteId: link.siteId ?? null,
              type: link.type ?? null,
              language: link.language ?? null,
              color: link.color ?? null,
              icon: link.icon ?? null,
              notes: link.notes ?? null,
              isDisabled: link.isDisabled ?? false,
            },
          })) ?? [],
      },
      streamingEpisodes: {
        create:
          anime.streamingEpisodes?.map((episode) => ({
            title: episode.title ?? null,
            thumbnail: episode.thumbnail ?? null,
            url: episode.url ?? null,
            site: episode.site ?? null,
          })) ?? [],
      },
      scoreDistribution: {
        create: [
          ...new Map(
            (anime.stats.scoreDistribution ?? []).map((score) => [
              score.score,
              {
                score: score.score ?? null,
                amount: score.amount ?? null,
              },
            ]),
          ).values(),
        ],
      },
      statusDistribution: {
        create: [
          ...new Map(
            (anime.stats.statusDistribution ?? []).map((status) => [
              status.status,
              {
                status: status.status ?? null,
                amount: status.amount ?? null,
              },
            ]),
          ).values(),
        ],
      },
    };
  }
}
