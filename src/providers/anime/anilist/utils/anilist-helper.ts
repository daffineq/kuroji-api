import { Injectable } from '@nestjs/common';
import {
  AnilistAiringSchedule,
  DateDetails,
  EpisodeZoro,
  Prisma,
} from '@prisma/client';
import { getShikimoriInclude } from '../../shikimori/utils/shikimori-helper';
import { getKitsuInclude } from '../../kitsu/util/kitsu-helper';
import { PrismaService } from '../../../../prisma.service';
import {
  AnilistWithRelations,
  BasicAnilist,
  BasicShikimori,
  BasicKitsu,
  ScheduleData,
} from '../types/types';
import { FullMediaResponse } from '../types/response';
import { KitsuWithRelations } from '../../kitsu/types/types';
import { ShikimoriWithRelations } from '../../shikimori/types/types';

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
        connectOrCreate: anime.tags?.map((tag) => ({
          where: { id: tag.id },
          create: {
            id: tag.id,
            name: tag.name,
            description: tag.description ?? null,
            category: tag.category ?? null,
            rank: tag.rank ?? null,
            isSpoiler: tag.isGeneralSpoiler ?? false,
            isAdult: tag.isAdult ?? false,
          },
        })),
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
    sub:
      anilist?.zoro?.episodes?.filter((e: EpisodeZoro) => e.isSubbed)?.length ??
      0,
    dub:
      anilist?.zoro?.episodes?.filter((e: EpisodeZoro) => e.isDubbed)?.length ??
      0,
    duration: anilist.duration ?? undefined,
    countryOfOrigin: anilist.countryOfOrigin ?? undefined,
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

export function getAnilistInclude(): Prisma.AnilistInclude {
  const include = {
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
    tags: {
      omit: {
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
    zoro: {
      include: {
        episodes: true,
      },
    },
  };

  return include;
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
    sub:
      raw?.zoro?.episodes?.filter((e: EpisodeZoro) => e.isSubbed)?.length ?? 0,
    dub:
      raw?.zoro?.episodes?.filter((e: EpisodeZoro) => e.isDubbed)?.length ?? 0,
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
    nextAiringEpisode: findNextAiringInSchedule(raw?.airingSchedule ?? null),

    studios: raw.studios,
    airingSchedule: raw.airingSchedule,
    tags: raw.tags,
    rankings: raw.rankings,
    externalLinks: raw.externalLinks,
    streamingEpisodes: raw.streamingEpisodes,
    scoreDistribution: raw.scoreDistribution,
    statusDistribution: raw.statusDistribution,
    shikimori: raw.shikimori,
    kitsu: raw.kitsu,
  };
}

export function mapToBasic(data: AnilistWithRelations[]): BasicAnilist[] {
  return data.map((anilist) => convertAnilistToBasic(anilist));
}

export function findNextAiringInSchedule(
  data: AnilistAiringSchedule[] | null,
): AnilistAiringSchedule | undefined {
  if (!data) {
    throw new Error('No airing schedule');
  }

  const now = new Date().getTime();
  const nowUnix = Math.floor(now / 1000);

  let nextAiring: AnilistAiringSchedule | undefined = undefined;
  let smallestFutureAiringTime = Infinity;

  for (const schedule of data) {
    if (schedule.airingAt && schedule.airingAt > nowUnix) {
      if (schedule.airingAt < smallestFutureAiringTime) {
        smallestFutureAiringTime = schedule.airingAt;
        nextAiring = schedule;
      }
    }
  }

  return nextAiring;
}

export function getDateStringFromAnilist(date: DateDetails): string | null {
  const { year, month, day } = date;

  let anilistStartDateString: string | null = null;

  if (year && month && day) {
    anilistStartDateString = `${year.toString().padStart(4, '0')}-${month
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  return anilistStartDateString;
}
