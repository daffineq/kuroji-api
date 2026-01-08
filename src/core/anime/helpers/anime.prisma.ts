import { AnilistMedia } from '../providers/anilist/types';
import { prisma, Prisma } from 'src/lib/prisma';
import { DateUtils } from 'src/helpers/date';
import { Module } from 'src/helpers/module';

class AnimePrismaModule extends Module {
  override readonly name = 'AnimePrisma';

  async getAnimeCreate(anilist: AnilistMedia): Promise<Prisma.AnimeCreateInput> {
    const isMalExists = anilist.idMal
      ? (await prisma.anime.findUnique({
          where: {
            id_mal: anilist.idMal
          }
        })) != null
      : false;

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
      id_mal: isMalExists ? undefined : anilist.idMal,
      title: anilist.title
        ? {
            create: {
              romaji: anilist.title.romaji,
              english: anilist.title.english,
              native: anilist.title.native
            }
          }
        : undefined,
      poster: anilist.coverImage
        ? {
            create: {
              color: anilist.coverImage.color,
              medium: anilist.coverImage.medium,
              large: anilist.coverImage.large,
              extra_large: anilist.coverImage.extraLarge
            }
          }
        : undefined,
      banner: anilist.bannerImage,
      synonyms: anilist.synonyms ?? [],
      description: anilist.description,
      status: anilist.status,
      type: anilist.type,
      format: anilist.format,
      updated_at: Math.floor(Date.now() / 1000),
      start_date: anilist.startDate
        ? {
            create: {
              year: anilist.startDate.year,
              month: anilist.startDate.month,
              day: anilist.startDate.day
            }
          }
        : undefined,
      end_date: anilist.endDate
        ? {
            create: {
              year: anilist.endDate.year,
              month: anilist.endDate.month,
              day: anilist.endDate.day
            }
          }
        : undefined,
      season: anilist.season,
      season_year: anilist.seasonYear,
      episodes: anilist.episodes,
      duration: anilist.duration,
      country_of_origin: anilist.countryOfOrigin,
      is_licensed: anilist.isLicensed,
      source: anilist.source,
      hashtag: anilist.hashtag,
      is_adult: anilist.isAdult,
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
      latest_airing_episode: latestEpisode
        ? {
            create: {
              id: latestEpisode.id,
              episode: latestEpisode.episode,
              airing_at: latestEpisode.airingAt
            }
          }
        : undefined,
      next_airing_episode: nextEpisode
        ? {
            create: {
              id: nextEpisode.id,
              episode: nextEpisode.episode,
              airing_at: nextEpisode.airingAt
            }
          }
        : undefined,
      last_airing_episode: lastEpisode
        ? {
            create: {
              id: lastEpisode.id,
              episode: lastEpisode.episode,
              airing_at: lastEpisode.airingAt
            }
          }
        : undefined,
      airing_schedule: anilist.airingSchedule?.edges?.length
        ? {
            create: anilist.airingSchedule.edges.map((edge) => ({
              id: edge.node.id,
              episode: edge.node.episode,
              airing_at: edge.node.airingAt
            }))
          }
        : undefined,
      characters: anilist.characters?.edges?.length
        ? {
            create: anilist.characters.edges.map((edge) => ({
              id: edge.id,
              role: edge.role,
              character: {
                connectOrCreate: {
                  where: { id: edge.node.id },
                  create: {
                    id: edge.node.id,
                    name: edge.node.name
                      ? {
                          create: {
                            full: edge.node.name.full,
                            native: edge.node.name.native,
                            alternative: edge.node.name.alternative || []
                          }
                        }
                      : undefined,
                    image: edge.node.image
                      ? {
                          create: {
                            large: edge.node.image.large,
                            medium: edge.node.image.medium
                          }
                        }
                      : undefined
                  }
                }
              },
              voice_actors: edge.voiceActors?.length
                ? {
                    connectOrCreate: edge.voiceActors.map((va) => ({
                      where: { id: va.id },
                      create: {
                        id: va.id,
                        language: va.languageV2,
                        name: va.name
                          ? {
                              create: {
                                full: va.name.full,
                                native: va.name.native,
                                alternative: va.name.alternative || []
                              }
                            }
                          : undefined,
                        image: va.image
                          ? {
                              create: {
                                large: va.image.large,
                                medium: va.image.medium
                              }
                            }
                          : undefined
                      }
                    }))
                  }
                : undefined
            }))
          }
        : undefined,
      studios: anilist.studios?.edges?.length
        ? {
            create: anilist.studios.edges.map((edge) => ({
              id: edge.id,
              is_main: edge.isMain,
              studio: {
                connectOrCreate: {
                  where: { id: edge.node.id },
                  create: {
                    id: edge.node.id,
                    name: edge.node.name
                  }
                }
              }
            }))
          }
        : undefined,
      tags: anilist.tags?.length
        ? {
            create: anilist.tags.map((tag) => ({
              rank: tag.rank,
              is_media_spoiler: tag.isMediaSpoiler,
              tag: {
                connectOrCreate: {
                  where: { id: tag.id },
                  create: {
                    id: tag.id,
                    name: tag.name,
                    description: tag.description,
                    category: tag.category,
                    is_general_spoiler: tag.isGeneralSpoiler,
                    is_adult: tag.isAdult
                  }
                }
              }
            }))
          }
        : undefined,
      external_links: anilist.externalLinks?.length
        ? {
            create: anilist.externalLinks.map((link) => ({
              id: link.id,
              url: link.url,
              site: link.site,
              site_id: link.siteId,
              type: link.type,
              language: link.language,
              color: link.color,
              icon: link.icon,
              notes: link.notes,
              is_disabled: link.isDisabled
            }))
          }
        : undefined,
      score_distribution: anilist.stats?.scoreDistribution?.length
        ? {
            create: anilist.stats.scoreDistribution.map((dist) => ({
              score: dist.score,
              amount: dist.amount
            }))
          }
        : undefined,
      status_distribution: anilist.stats?.statusDistribution?.length
        ? {
            create: anilist.stats.statusDistribution.map((dist) => ({
              status: dist.status,
              amount: dist.amount
            }))
          }
        : undefined,

      meta: {
        create: {
          id: anilist.id
        }
      }
    };
  }

  async getAnimeUpdate(anilist: AnilistMedia): Promise<Prisma.AnimeUpdateInput> {
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
      id_mal: anilist.idMal,
      banner: anilist.bannerImage,
      synonyms: anilist.synonyms ?? [],
      description: anilist.description,
      status: anilist.status,
      type: anilist.type,
      format: anilist.format,
      updated_at: Math.floor(Date.now() / 1000),
      season: anilist.season,
      season_year: anilist.seasonYear,
      episodes: anilist.episodes,
      duration: anilist.duration,
      country_of_origin: anilist.countryOfOrigin,
      is_licensed: anilist.isLicensed,
      source: anilist.source,
      hashtag: anilist.hashtag,
      is_adult: anilist.isAdult,
      score: anilist.meanScore,
      popularity: anilist.popularity,
      trending: anilist.trending,
      favorites: anilist.favourites,

      title: anilist.title
        ? {
            upsert: {
              where: { anime_id: anilist.id },
              update: {
                romaji: anilist.title.romaji,
                english: anilist.title.english,
                native: anilist.title.native
              },
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
            upsert: {
              where: { anime_id: anilist.id },
              update: {
                color: anilist.coverImage.color,
                medium: anilist.coverImage.medium,
                large: anilist.coverImage.large,
                extra_large: anilist.coverImage.extraLarge
              },
              create: {
                color: anilist.coverImage.color,
                medium: anilist.coverImage.medium,
                large: anilist.coverImage.large,
                extra_large: anilist.coverImage.extraLarge
              }
            }
          }
        : undefined,

      start_date: anilist.startDate
        ? {
            upsert: {
              where: { anime_id: anilist.id },
              update: {
                year: anilist.startDate.year,
                month: anilist.startDate.month,
                day: anilist.startDate.day
              },
              create: {
                year: anilist.startDate.year,
                month: anilist.startDate.month,
                day: anilist.startDate.day
              }
            }
          }
        : undefined,

      end_date: anilist.endDate
        ? {
            upsert: {
              where: { anime_id: anilist.id },
              update: {
                year: anilist.endDate.year,
                month: anilist.endDate.month,
                day: anilist.endDate.day
              },
              create: {
                year: anilist.endDate.year,
                month: anilist.endDate.month,
                day: anilist.endDate.day
              }
            }
          }
        : undefined,

      genres: anilist.genres?.length
        ? {
            set: [],
            connectOrCreate: anilist.genres.map((genre) => ({
              where: { name: genre },
              create: { name: genre }
            }))
          }
        : undefined,

      latest_airing_episode: latestEpisode
        ? {
            delete: true,
            create: {
              id: latestEpisode.id,
              episode: latestEpisode.episode,
              airing_at: latestEpisode.airingAt
            }
          }
        : { disconnect: true },

      next_airing_episode: nextEpisode
        ? {
            delete: true,
            create: {
              id: nextEpisode.id,
              episode: nextEpisode.episode,
              airing_at: nextEpisode.airingAt
            }
          }
        : { disconnect: true },

      last_airing_episode: lastEpisode
        ? {
            delete: true,
            create: {
              id: lastEpisode.id,
              episode: lastEpisode.episode,
              airing_at: lastEpisode.airingAt
            }
          }
        : { disconnect: true },

      airing_schedule: anilist.airingSchedule?.edges?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.airingSchedule.edges.map((edge) => ({
              id: edge.node.id,
              episode: edge.node.episode,
              airing_at: edge.node.airingAt
            }))
          }
        : { deleteMany: { anime_id: anilist.id } },

      characters: anilist.characters?.edges?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.characters.edges.map((edge) => ({
              id: edge.id,
              role: edge.role,
              character: {
                connectOrCreate: {
                  where: { id: edge.node.id },
                  create: {
                    id: edge.node.id,
                    name: edge.node.name
                      ? {
                          create: {
                            full: edge.node.name.full,
                            native: edge.node.name.native,
                            alternative: edge.node.name.alternative || []
                          }
                        }
                      : undefined,
                    image: edge.node.image
                      ? {
                          create: {
                            large: edge.node.image.large,
                            medium: edge.node.image.medium
                          }
                        }
                      : undefined
                  }
                }
              },
              voice_actors: edge.voiceActors?.length
                ? {
                    connectOrCreate: edge.voiceActors.map((va) => ({
                      where: { id: va.id },
                      create: {
                        id: va.id,
                        language: va.languageV2,
                        name: va.name
                          ? {
                              create: {
                                full: va.name.full,
                                native: va.name.native,
                                alternative: va.name.alternative || []
                              }
                            }
                          : undefined,
                        image: va.image
                          ? {
                              create: {
                                large: va.image.large,
                                medium: va.image.medium
                              }
                            }
                          : undefined
                      }
                    }))
                  }
                : undefined
            }))
          }
        : { deleteMany: { anime_id: anilist.id } },

      studios: anilist.studios?.edges?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.studios.edges.map((edge) => ({
              id: edge.id,
              is_main: edge.isMain,
              studio: {
                connectOrCreate: {
                  where: { id: edge.node.id },
                  create: {
                    id: edge.node.id,
                    name: edge.node.name
                  }
                }
              }
            }))
          }
        : { deleteMany: { anime_id: anilist.id } },

      tags: anilist.tags?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.tags.map((tag) => ({
              rank: tag.rank,
              is_media_spoiler: tag.isMediaSpoiler,
              tag: {
                connectOrCreate: {
                  where: { id: tag.id },
                  create: {
                    id: tag.id,
                    name: tag.name,
                    description: tag.description,
                    category: tag.category,
                    is_general_spoiler: tag.isGeneralSpoiler,
                    is_adult: tag.isAdult
                  }
                }
              }
            }))
          }
        : { deleteMany: { anime_id: anilist.id } },

      external_links: anilist.externalLinks?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.externalLinks.map((link) => ({
              id: link.id,
              url: link.url,
              site: link.site,
              site_id: link.siteId,
              type: link.type,
              language: link.language,
              color: link.color,
              icon: link.icon,
              notes: link.notes,
              is_disabled: link.isDisabled
            }))
          }
        : { deleteMany: { anime_id: anilist.id } },

      score_distribution: anilist.stats?.scoreDistribution?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.stats.scoreDistribution.map((dist) => ({
              score: dist.score,
              amount: dist.amount
            }))
          }
        : { deleteMany: { anime_id: anilist.id } },

      status_distribution: anilist.stats?.statusDistribution?.length
        ? {
            deleteMany: {
              anime_id: anilist.id
            },
            create: anilist.stats.statusDistribution.map((dist) => ({
              status: dist.status,
              amount: dist.amount
            }))
          }
        : { deleteMany: { anime_id: anilist.id } }
    };
  }
}

const AnimePrisma = new AnimePrismaModule();

export { AnimePrisma, AnimePrismaModule };
