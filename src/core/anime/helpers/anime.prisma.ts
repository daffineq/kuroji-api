import { Prisma } from '@prisma/client';
import { AnilistMedia } from '../providers/anilist/types';
import prisma from 'src/lib/prisma';
import { DateUtils } from 'src/helpers/date';

export const getAnimePrismaData = async (anilist: AnilistMedia): Promise<Prisma.AnimeCreateInput> => {
  const isMalExists = anilist.idMal
    ? (await prisma.anime.findUnique({
        where: {
          idMal: anilist.idMal
        }
      })) != null
    : false;

  // Get airing schedule data
  const airedEpisodes = anilist.airingSchedule?.edges
    .filter((schedule) => DateUtils.isPast(schedule.node.airingAt))
    .sort((a, b) => b.node.airingAt - a.node.airingAt);

  const futureEpisodes = anilist.airingSchedule?.edges
    .filter((schedule) => DateUtils.isFuture(schedule.node.airingAt))
    .sort((a, b) => a.node.airingAt - b.node.airingAt);

  const latestEpisode = airedEpisodes?.[0]?.node;
  const nextEpisode = futureEpisodes?.[0]?.node;
  const lastEpisode = [...(anilist.airingSchedule?.edges ?? [])].sort(
    (a, b) => (b.node.episode ?? 0) - (a.node.episode ?? 0)
  )[0]?.node;

  return {
    id: anilist.id,
    idMal: isMalExists ? undefined : anilist.idMal,
    title: anilist.title
      ? {
          connectOrCreate: {
            where: { animeId: anilist.id },
            create: {
              romaji: anilist.title.romaji,
              english: anilist.title.english,
              native: anilist.title.native
            }
          }
        }
      : undefined,
    poster: anilist.coverImage
      ? {
          connectOrCreate: {
            where: { animeId: anilist.id },
            create: {
              color: anilist.coverImage.color,
              medium: anilist.coverImage.medium,
              large: anilist.coverImage.large,
              extraLarge: anilist.coverImage.extraLarge
            }
          }
        }
      : undefined,
    banner: anilist.bannerImage,
    synonyms: anilist.synonyms ?? [],
    description: anilist.description,
    status: anilist.status,
    type: anilist.type,
    format: anilist.format,
    updatedAt: Math.floor(Date.now() / 1000),
    startDate: anilist.startDate
      ? {
          connectOrCreate: {
            where: { animeId: anilist.id },
            create: {
              year: anilist.startDate.year,
              month: anilist.startDate.month,
              day: anilist.startDate.day
            }
          }
        }
      : undefined,
    endDate: anilist.endDate
      ? {
          connectOrCreate: {
            where: { animeId: anilist.id },
            create: {
              year: anilist.endDate.year,
              month: anilist.endDate.month,
              day: anilist.endDate.day
            }
          }
        }
      : undefined,
    season: anilist.season,
    seasonYear: anilist.seasonYear,
    episodes: anilist.episodes,
    duration: anilist.duration,
    countryOfOrigin: anilist.countryOfOrigin,
    isLicensed: anilist.isLicensed,
    source: anilist.source,
    hashtag: anilist.hashtag,
    isAdult: anilist.isAdult,
    score: anilist.meanScore,
    popularity: anilist.popularity,
    trending: anilist.trending,
    favorites: anilist.favourites,
    genres: anilist.genres?.length
      ? {
          connectOrCreate: anilist.genres.map((genre) => ({
            where: { name: genre },
            create: { name: genre }
          }))
        }
      : undefined,
    latestAiringEpisode: latestEpisode
      ? {
          connectOrCreate: {
            where: { id: latestEpisode.id },
            create: {
              id: latestEpisode.id,
              episode: latestEpisode.episode,
              airingAt: latestEpisode.airingAt
            }
          }
        }
      : undefined,
    nextAiringEpisode: nextEpisode
      ? {
          connectOrCreate: {
            where: { id: nextEpisode.id },
            create: {
              id: nextEpisode.id,
              episode: nextEpisode.episode,
              airingAt: nextEpisode.airingAt
            }
          }
        }
      : undefined,
    lastAiringEpisode: lastEpisode
      ? {
          connectOrCreate: {
            where: { id: lastEpisode.id },
            create: {
              id: lastEpisode.id,
              episode: lastEpisode.episode,
              airingAt: lastEpisode.airingAt
            }
          }
        }
      : undefined,
    airingSchedule: anilist.airingSchedule?.edges?.length
      ? {
          connectOrCreate: anilist.airingSchedule.edges.map((edge) => ({
            where: { id: edge.node.id },
            create: {
              id: edge.node.id,
              episode: edge.node.episode,
              airingAt: edge.node.airingAt
            }
          }))
        }
      : undefined,
    characters: anilist.characters?.edges?.length
      ? {
          connectOrCreate: anilist.characters.edges.map((edge) => ({
            where: { id: edge.id },
            create: {
              id: edge.id,
              role: edge.role,
              character: {
                connectOrCreate: {
                  where: { id: edge.node.id },
                  create: {
                    id: edge.node.id,
                    name: edge.node.name
                      ? {
                          connectOrCreate: {
                            where: { characterId: edge.node.id },
                            create: {
                              full: edge.node.name.full,
                              native: edge.node.name.native,
                              alternative: edge.node.name.alternative || []
                            }
                          }
                        }
                      : undefined,
                    image: edge.node.image
                      ? {
                          connectOrCreate: {
                            where: { characterId: edge.node.id },
                            create: {
                              large: edge.node.image.large,
                              medium: edge.node.image.medium
                            }
                          }
                        }
                      : undefined
                  }
                }
              },
              voiceActors: edge.voiceActors?.length
                ? {
                    connectOrCreate: edge.voiceActors.map((va) => ({
                      where: { id: va.id },
                      create: {
                        id: va.id,
                        language: va.languageV2,
                        name: va.name
                          ? {
                              connectOrCreate: {
                                where: { voiceActorId: va.id },
                                create: {
                                  full: va.name.full,
                                  native: va.name.native,
                                  alternative: va.name.alternative || []
                                }
                              }
                            }
                          : undefined,
                        image: va.image
                          ? {
                              connectOrCreate: {
                                where: { voiceActorId: va.id },
                                create: {
                                  large: va.image.large,
                                  medium: va.image.medium
                                }
                              }
                            }
                          : undefined
                      }
                    }))
                  }
                : undefined
            }
          }))
        }
      : undefined,
    studios: anilist.studios?.edges?.length
      ? {
          connectOrCreate: anilist.studios.edges.map((edge) => ({
            where: { id: edge.id },
            create: {
              id: edge.id,
              isMain: edge.isMain,
              studio: {
                connectOrCreate: {
                  where: { id: edge.node.id },
                  create: {
                    id: edge.node.id,
                    name: edge.node.name
                  }
                }
              }
            }
          }))
        }
      : undefined,
    tags: anilist.tags?.length
      ? {
          connectOrCreate: anilist.tags.map((tag) => ({
            where: {
              animeId_tagId: {
                animeId: anilist.id,
                tagId: tag.id
              }
            },
            create: {
              rank: tag.rank,
              isMediaSpoiler: tag.isMediaSpoiler,
              tag: {
                connectOrCreate: {
                  where: { id: tag.id },
                  create: {
                    id: tag.id,
                    name: tag.name,
                    description: tag.description,
                    category: tag.category,
                    isGeneralSpoiler: tag.isGeneralSpoiler,
                    isAdult: tag.isAdult
                  }
                }
              }
            }
          }))
        }
      : undefined,
    rankings: anilist.rankings?.length
      ? {
          connectOrCreate: anilist.rankings.map((ranking) => ({
            where: { id: ranking.id },
            create: {
              id: ranking.id,
              rank: ranking.rank,
              type: ranking.type,
              format: ranking.format,
              year: ranking.year,
              season: ranking.season,
              allTime: ranking.allTime,
              context: ranking.context
            }
          }))
        }
      : undefined,
    externalLinks: anilist.externalLinks?.length
      ? {
          connectOrCreate: anilist.externalLinks.map((link) => ({
            where: { id: link.id },
            create: {
              id: link.id,
              url: link.url,
              site: link.site,
              siteId: link.siteId,
              type: link.type,
              language: link.language,
              color: link.color,
              icon: link.icon,
              notes: link.notes,
              isDisabled: link.isDisabled
            }
          }))
        }
      : undefined,
    scoreDistribution: anilist.stats?.scoreDistribution?.length
      ? {
          create: anilist.stats.scoreDistribution.map((dist) => ({
            score: dist.score,
            amount: dist.amount
          }))
        }
      : undefined,
    statusDistribution: anilist.stats?.statusDistribution?.length
      ? {
          create: anilist.stats.statusDistribution.map((dist) => ({
            status: dist.status,
            amount: dist.amount
          }))
        }
      : undefined,

    meta: {
      connectOrCreate: {
        where: { id: anilist.id },
        create: {
          id: anilist.id
        }
      }
    }
  };
};
