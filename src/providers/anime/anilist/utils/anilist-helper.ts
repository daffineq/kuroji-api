import { Injectable } from '@nestjs/common';
import { getShikimoriInclude } from '../../shikimori/utils/shikimori-helper.js';
import { getKitsuInclude } from '../../kitsu/util/kitsu-helper.js';
import { PrismaService } from '../../../../prisma.service.js';
import {
  AnilistWithRelations,
  BasicAnilist,
  BasicShikimori,
  BasicKitsu,
  ScheduleData,
} from '../types/types.js';
import { FullMediaResponse } from '../types/response.js';
import { KitsuWithRelations } from '../../kitsu/types/types.js';
import { ShikimoriWithRelations } from '../../shikimori/types/types.js';
import { getAnizipInclude } from '../../mappings/utils/anizip.helper.js';
import { findNextAiringInSchedule } from './utils.js';
import { Prisma } from '@prisma/client';

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

    const now = Math.floor(Date.now() / 1000);

    // Get all aired episodes
    const airedEpisodes = anime.airingSchedule.edges
      .filter((schedule) => schedule.node.airingAt <= now)
      .sort((a, b) => b.node.airingAt - a.node.airingAt);

    // Get all future episodes
    const futureEpisodes = anime.airingSchedule.edges
      .filter((schedule) => schedule.node.airingAt > now)
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
          anime.airingSchedule?.edges
            ?.filter((edge) => edge?.node?.id)
            .map((edge) => ({
              where: { id: edge.node.id },
              create: {
                id: edge.node.id,
                episode: edge.node.episode ?? null,
                airingAt: edge.node.airingAt ?? null,
              },
            })) ?? [],
      },
      tags: {
        create:
          anime.tags?.map((tag) => ({
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
        create:
          anime.stats.scoreDistribution?.map((score) => ({
            score: score.score ?? null,
            amount: score.amount ?? null,
          })) ?? [],
      },
      statusDistribution: {
        create:
          anime.stats.statusDistribution?.map((status) => ({
            status: status.status ?? null,
            amount: status.amount ?? null,
          })) ?? [],
      },
    };
  }
}

export function convertAnilistToBasic(
  anilist: AnilistWithRelations,
): BasicAnilist {
  return {
    id: anilist.id,
    idMal: anilist.idMal ?? undefined,
    title: anilist.title ?? undefined,
    synonyms: anilist.synonyms ?? undefined,
    bannerImage: anilist.bannerImage ?? undefined,
    coverImage: anilist.coverImage ?? undefined,
    type: anilist.type ?? undefined,
    format: anilist.format ?? undefined,
    status: anilist.status ?? undefined,
    description: anilist.description ?? undefined,
    startDate: anilist.startDate ?? undefined,
    season: anilist.season ?? undefined,
    seasonYear: anilist.seasonYear ?? undefined,
    episodes: anilist.episodes ?? undefined,
    duration: anilist.duration ?? undefined,
    countryOfOrigin: anilist.countryOfOrigin ?? undefined,
    source: anilist.source ?? undefined,
    popularity: anilist.popularity ?? undefined,
    favourites: anilist.favourites ?? undefined,
    score: anilist.score ?? undefined,
    isLocked: anilist.isLocked ?? undefined,
    isAdult: anilist.isAdult ?? undefined,
    genres: anilist.genres ?? undefined,
    nextAiringEpisode: findNextAiringInSchedule(
      anilist?.airingSchedule ?? null,
    ),
    shikimori: convertShikimoriToBasic(anilist?.shikimori) ?? undefined,
    kitsu: convertKitsuToBasic(anilist?.kitsu) ?? undefined,
  };
}

export function convertShikimoriToBasic(
  shikimori?: ShikimoriWithRelations,
): BasicShikimori | undefined {
  if (!shikimori) {
    return undefined;
  }
  return {
    id: shikimori.id,
    malId: shikimori.malId ?? undefined,
    russian: shikimori.russian ?? undefined,
    licenseNameRu: shikimori.licenseNameRu ?? undefined,
    episodes: shikimori.episodes ?? undefined,
    episodesAired: shikimori.episodesAired ?? undefined,
    rating: shikimori.rating ?? undefined,
    url: shikimori.url ?? undefined,
    franchise: shikimori.franchise ?? undefined,
    poster: shikimori.poster ?? undefined,
    description: shikimori.description ?? undefined,
  };
}

export function convertKitsuToBasic(
  kitsu?: KitsuWithRelations,
): BasicKitsu | undefined {
  if (!kitsu) {
    return undefined;
  }
  return {
    id: kitsu.id,
    anilistId: kitsu.anilistId ?? undefined,
    titles: kitsu.titles ?? undefined,
    slug: kitsu.slug ?? undefined,
    synopsis: kitsu.synopsis ?? undefined,
    episodeCount: kitsu.episodeCount ?? undefined,
    episodeLength: kitsu.episodeLength ?? undefined,
    ageRating: kitsu.ageRating ?? undefined,
    ageRatingGuide: kitsu.ageRatingGuide ?? undefined,
    posterImage: kitsu.posterImage ?? undefined,
    coverImage: kitsu.coverImage ?? undefined,
    showType: kitsu.showType ?? undefined,
  };
}

export function getAnilistFindUnique(id: number): Prisma.AnilistFindUniqueArgs {
  const findUnique = {
    where: { id },
    include: getAnilistInclude(),
  };

  return findUnique;
}

export function getAnilistMappingSelect() {
  return {
    title: {
      select: {
        romaji: true,
        english: true,
        native: true,
      },
    },
    id: true,
    idMal: true,
    seasonYear: true,
    episodes: true,
    format: true,
    airingSchedule: true,
    status: true,
    synonyms: true,
    shikimori: {
      select: {
        english: true,
        japanese: true,
        episodes: true,
        episodesAired: true,
      },
    },
    kitsu: {
      select: {
        episodeCount: true,
      },
    },
  };
}

export function getAnilistInclude(): Prisma.AnilistInclude {
  return {
    title: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    coverImage: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    startDate: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    endDate: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    trailer: {
      omit: {
        anilistId: true,
      },
    },
    studios: {
      omit: {
        anilistId: true,
        studioId: true,
      },
      include: {
        studio: true,
      },
    },
    airingSchedule: {
      omit: {
        anilistId: true,
      },
    },
    nextAiringEpisode: {
      omit: {
        anilistId: true,
      },
    },
    lastAiringEpisode: {
      omit: {
        anilistId: true,
      },
    },
    latestAiringEpisode: {
      omit: {
        anilistId: true,
      },
    },
    tags: {
      include: {
        tag: true,
      },
      omit: {
        id: true,
        tagId: true,
        anilistId: true,
      },
    },
    rankings: {
      omit: {
        anilistId: true,
      },
    },
    externalLinks: {
      omit: {
        anilistId: true,
      },
    },
    streamingEpisodes: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    scoreDistribution: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    statusDistribution: {
      omit: {
        id: true,
        anilistId: true,
      },
    },
    shikimori: {
      include: getShikimoriInclude(),
    },
    kitsu: {
      include: getKitsuInclude(),
    },
    anizip: {
      include: getAnizipInclude(),
    },
  };
}

export function createScheduleData(
  data: BasicAnilist[] = [],
  current: boolean,
): ScheduleData {
  return {
    current,
    data: data.sort((a, b) => {
      const aAiring = a.nextAiringEpisode?.airingAt ?? Infinity;
      const bAiring = b.nextAiringEpisode?.airingAt ?? Infinity;
      return aAiring - bAiring;
    }),
  };
}

export function reorderAnilistItems(raw: AnilistWithRelations) {
  if (!raw) return null;

  return {
    id: raw.id,
    idMal: raw.idMal,
    title: raw.title,
    bannerImage: raw.bannerImage,
    status: raw.status,
    type: raw.type,
    format: raw.format,
    coverImage: raw.coverImage,
    updatedAt: raw.updatedAt,
    description: raw.description,
    startDate: raw.startDate,
    endDate: raw.endDate,
    season: raw.season,
    seasonYear: raw.seasonYear,
    episodes: raw.episodes,
    duration: raw.duration,
    countryOfOrigin: raw.countryOfOrigin,
    isLicensed: raw.isLicensed,
    source: raw.source,
    hashtag: raw.hashtag,
    isLocked: raw.isLocked,
    isAdult: raw.isAdult,
    averageScore: raw.averageScore,
    meanScore: raw.meanScore,
    score: raw.score,
    popularity: raw.popularity,
    trending: raw.trending,
    favourites: raw.favourites,
    genres: raw.genres,
    synonyms: raw.synonyms,

    trailer: raw.trailer,

    nextAiringEpisode: raw.nextAiringEpisode,
    latestAiringEpisode: raw.latestAiringEpisode,
    lastAiringEpisode: raw.lastAiringEpisode,

    airingSchedule: raw.airingSchedule,

    studios: raw.studios,
    tags: raw.tags,
    rankings: raw.rankings,
    externalLinks: raw.externalLinks,
    streamingEpisodes: raw.streamingEpisodes,
    scoreDistribution: raw.scoreDistribution,
    statusDistribution: raw.statusDistribution,
    shikimori: raw.shikimori,
    kitsu: raw.kitsu,
    anizip: raw.anizip,
  };
}
