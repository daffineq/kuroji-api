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
            connectOrCreate: {
              where: { id: latestEpisode.id },
              create: {
                id: latestEpisode.id,
                episode: latestEpisode.episode,
                airing_at: latestEpisode.airingAt
              }
            }
          }
        : undefined,
      next_airing_episode: nextEpisode
        ? {
            connectOrCreate: {
              where: { id: nextEpisode.id },
              create: {
                id: nextEpisode.id,
                episode: nextEpisode.episode,
                airing_at: nextEpisode.airingAt
              }
            }
          }
        : undefined,
      last_airing_episode: lastEpisode
        ? {
            connectOrCreate: {
              where: { id: lastEpisode.id },
              create: {
                id: lastEpisode.id,
                episode: lastEpisode.episode,
                airing_at: lastEpisode.airingAt
              }
            }
          }
        : undefined,
      airing_schedule: anilist.airingSchedule?.edges?.length
        ? {
            connectOrCreate: anilist.airingSchedule.edges.map((edge) => ({
              where: { id: edge.node.id },
              create: {
                id: edge.node.id,
                episode: edge.node.episode,
                airing_at: edge.node.airingAt
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
                              where: { character_id: edge.node.id },
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
                              where: { character_id: edge.node.id },
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
                voice_actors: edge.voiceActors?.length
                  ? {
                      connectOrCreate: edge.voiceActors.map((va) => ({
                        where: { id: va.id },
                        create: {
                          id: va.id,
                          language: va.languageV2,
                          name: va.name
                            ? {
                                connectOrCreate: {
                                  where: { voice_actor_id: va.id },
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
                                  where: { voice_actor_id: va.id },
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
              }
            }))
          }
        : undefined,
      tags: anilist.tags?.length
        ? {
            connectOrCreate: anilist.tags.map((tag) => ({
              where: {
                anime_id_tag_id: {
                  anime_id: anilist.id,
                  tag_id: tag.id
                }
              },
              create: {
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
                all_time: ranking.allTime,
                context: ranking.context
              }
            }))
          }
        : undefined,
      external_links: anilist.externalLinks?.length
        ? {
            connectOrCreate: anilist.externalLinks.map((link) => ({
              where: { id: link.id },
              create: {
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
              }
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
        connectOrCreate: {
          where: { id: anilist.id },
          create: {
            id: anilist.id
          }
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
              update: { year: anilist.startDate.year, month: anilist.startDate.month, day: anilist.startDate.day },
              create: { year: anilist.startDate.year, month: anilist.startDate.month, day: anilist.startDate.day }
            }
          }
        : undefined,

      end_date: anilist.endDate
        ? {
            upsert: {
              where: { anime_id: anilist.id },
              update: { year: anilist.endDate.year, month: anilist.endDate.month, day: anilist.endDate.day },
              create: { year: anilist.endDate.year, month: anilist.endDate.month, day: anilist.endDate.day }
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
            upsert: {
              where: { id: latestEpisode.id },
              update: { episode: latestEpisode.episode, airing_at: latestEpisode.airingAt },
              create: { id: latestEpisode.id, episode: latestEpisode.episode, airing_at: latestEpisode.airingAt }
            }
          }
        : undefined,

      next_airing_episode: nextEpisode
        ? {
            upsert: {
              where: { id: nextEpisode.id },
              update: { episode: nextEpisode.episode, airing_at: nextEpisode.airingAt },
              create: { id: nextEpisode.id, episode: nextEpisode.episode, airing_at: nextEpisode.airingAt }
            }
          }
        : undefined,

      last_airing_episode: lastEpisode
        ? {
            upsert: {
              where: { id: lastEpisode.id },
              update: { episode: lastEpisode.episode, airing_at: lastEpisode.airingAt },
              create: { id: lastEpisode.id, episode: lastEpisode.episode, airing_at: lastEpisode.airingAt }
            }
          }
        : undefined,

      airing_schedule: anilist.airingSchedule?.edges?.length
        ? {
            upsert: anilist.airingSchedule.edges.map((edge) => ({
              where: { id: edge.node.id },
              update: { episode: edge.node.episode, airing_at: edge.node.airingAt },
              create: { id: edge.node.id, episode: edge.node.episode, airing_at: edge.node.airingAt }
            }))
          }
        : undefined,

      characters: anilist.characters?.edges?.length
        ? {
            upsert: anilist.characters.edges.map((edge) => ({
              where: { id: edge.id },
              update: { role: edge.role },
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
              }
            }))
          }
        : undefined,

      studios: anilist.studios?.edges?.length
        ? {
            upsert: anilist.studios.edges.map((edge) => ({
              where: { id: edge.id },
              update: { is_main: edge.isMain },
              create: {
                id: edge.id,
                is_main: edge.isMain,
                studio: {
                  connectOrCreate: {
                    where: { id: edge.node.id },
                    create: { id: edge.node.id, name: edge.node.name }
                  }
                }
              }
            }))
          }
        : undefined,

      tags: anilist.tags?.length
        ? {
            upsert: anilist.tags.map((tag) => ({
              where: { anime_id_tag_id: { anime_id: anilist.id, tag_id: tag.id } },
              update: { rank: tag.rank, is_media_spoiler: tag.isMediaSpoiler },
              create: {
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
              }
            }))
          }
        : undefined,

      rankings: anilist.rankings?.length
        ? {
            upsert: anilist.rankings.map((ranking) => ({
              where: { id: ranking.id },
              update: { rank: ranking.rank, type: ranking.type, context: ranking.context },
              create: {
                id: ranking.id,
                rank: ranking.rank,
                type: ranking.type,
                format: ranking.format,
                year: ranking.year,
                season: ranking.season,
                all_time: ranking.allTime,
                context: ranking.context
              }
            }))
          }
        : undefined,

      external_links: anilist.externalLinks?.length
        ? {
            upsert: anilist.externalLinks.map((link) => ({
              where: { id: link.id },
              update: { url: link.url, is_disabled: link.isDisabled },
              create: {
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
              }
            }))
          }
        : undefined,

      score_distribution: anilist.stats?.scoreDistribution?.length
        ? {
            deleteMany: {},
            create: anilist.stats.scoreDistribution.map((dist) => ({
              score: dist.score,
              amount: dist.amount
            }))
          }
        : undefined,

      status_distribution: anilist.stats?.statusDistribution?.length
        ? {
            deleteMany: {},
            create: anilist.stats.statusDistribution.map((dist) => ({
              status: dist.status,
              amount: dist.amount
            }))
          }
        : undefined
    };
  }
}

const AnimePrisma = new AnimePrismaModule();

export { AnimePrisma, AnimePrismaModule };
