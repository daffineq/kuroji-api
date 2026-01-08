import { AnilistMedia } from '../providers/anilist/types';
import { prisma, Prisma } from 'src/lib/prisma';
import { DateUtils } from 'src/helpers/date';
import { Module } from 'src/helpers/module';
import { Config } from 'src/config/config';

class AnimePrismaModule extends Module {
  override readonly name = 'AnimePrisma';

  async upsert(anilist: AnilistMedia) {
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

    await prisma.$transaction(async (tx) => {
      await tx.anime.upsert({
        where: { id: anilist.id },
        update: {
          id_mal: anilist.idMal,
          background: anilist.bannerImage,
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
          latest_airing_episode: latestEpisode?.airingAt,
          next_airing_episode: nextEpisode?.airingAt,
          last_airing_episode: lastEpisode?.airingAt
        },
        create: {
          id: anilist.id,
          id_mal: anilist.idMal,
          background: anilist.bannerImage,
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
          latest_airing_episode: latestEpisode?.airingAt,
          next_airing_episode: nextEpisode?.airingAt,
          last_airing_episode: lastEpisode?.airingAt,
          meta: {
            create: { id: anilist.id }
          }
        }
      });

      const ops: Promise<any>[] = [];

      // Title
      if (anilist.title) {
        ops.push(
          tx.animeTitle.upsert({
            where: { anime_id: anilist.id },
            update: {
              romaji: anilist.title.romaji,
              english: anilist.title.english,
              native: anilist.title.native
            },
            create: {
              anime_id: anilist.id,
              romaji: anilist.title.romaji,
              english: anilist.title.english,
              native: anilist.title.native
            }
          })
        );
      }

      // Poster
      if (anilist.coverImage) {
        ops.push(
          tx.animePoster.upsert({
            where: { anime_id: anilist.id },
            update: {
              color: anilist.coverImage.color,
              medium: anilist.coverImage.medium,
              large: anilist.coverImage.large,
              extra_large: anilist.coverImage.extraLarge
            },
            create: {
              anime_id: anilist.id,
              color: anilist.coverImage.color,
              medium: anilist.coverImage.medium,
              large: anilist.coverImage.large,
              extra_large: anilist.coverImage.extraLarge
            }
          })
        );
      }

      // Start Date
      if (anilist.startDate) {
        ops.push(
          tx.animeStartDate.upsert({
            where: { anime_id: anilist.id },
            update: {
              year: anilist.startDate.year,
              month: anilist.startDate.month,
              day: anilist.startDate.day
            },
            create: {
              anime_id: anilist.id,
              year: anilist.startDate.year,
              month: anilist.startDate.month,
              day: anilist.startDate.day
            }
          })
        );
      }

      // End Date
      if (anilist.endDate) {
        ops.push(
          tx.animeEndDate.upsert({
            where: { anime_id: anilist.id },
            update: {
              year: anilist.endDate.year,
              month: anilist.endDate.month,
              day: anilist.endDate.day
            },
            create: {
              anime_id: anilist.id,
              year: anilist.endDate.year,
              month: anilist.endDate.month,
              day: anilist.endDate.day
            }
          })
        );
      }

      // Genres
      if (anilist.genres?.length) {
        ops.push(
          tx.anime.update({
            where: { id: anilist.id },
            data: {
              genres: {
                set: [],
                connectOrCreate: anilist.genres.map((genre) => ({
                  where: { name: genre },
                  create: { name: genre }
                }))
              }
            }
          })
        );
      }

      // Airing Schedule
      if (anilist.airingSchedule?.edges?.length) {
        for (const edge of anilist.airingSchedule.edges) {
          ops.push(
            tx.animeAiringSchedule.upsert({
              where: { id: edge.node.id },
              update: {
                episode: edge.node.episode,
                airing_at: edge.node.airingAt,
                anime_id: anilist.id
              },
              create: {
                id: edge.node.id,
                episode: edge.node.episode,
                airing_at: edge.node.airingAt,
                anime_id: anilist.id
              }
            })
          );
        }
      }

      // Characters
      if (anilist.characters?.edges?.length) {
        for (const edge of anilist.characters.edges) {
          ops.push(
            tx.animeCharacter.upsert({
              where: { id: edge.node.id },
              update: edge.node.name
                ? {
                    name: {
                      upsert: {
                        where: { character_id: edge.node.id },
                        update: {
                          full: edge.node.name.full,
                          native: edge.node.name.native,
                          alternative: edge.node.name.alternative || []
                        },
                        create: {
                          full: edge.node.name.full,
                          native: edge.node.name.native,
                          alternative: edge.node.name.alternative || []
                        }
                      }
                    },
                    image: edge.node.image
                      ? {
                          upsert: {
                            where: { character_id: edge.node.id },
                            update: {
                              large: edge.node.image.large,
                              medium: edge.node.image.medium
                            },
                            create: {
                              large: edge.node.image.large,
                              medium: edge.node.image.medium
                            }
                          }
                        }
                      : undefined
                  }
                : {},
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
            })
          );

          // Voice Actors
          if (edge.voiceActors?.length) {
            for (const va of edge.voiceActors) {
              ops.push(
                tx.animeVoiceActor.upsert({
                  where: { id: va.id },
                  update: {
                    language: va.languageV2,
                    name: va.name
                      ? {
                          upsert: {
                            where: { voice_actor_id: va.id },
                            update: {
                              full: va.name.full,
                              native: va.name.native,
                              alternative: va.name.alternative || []
                            },
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
                          upsert: {
                            where: { voice_actor_id: va.id },
                            update: {
                              large: va.image.large,
                              medium: va.image.medium
                            },
                            create: {
                              large: va.image.large,
                              medium: va.image.medium
                            }
                          }
                        }
                      : undefined
                  },
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
                })
              );
            }
          }

          // Character Edge (connects character to anime)
          ops.push(
            tx.animeCharacterEdge.upsert({
              where: { id: edge.id },
              update: {
                role: edge.role,
                anime_id: anilist.id,
                character_id: edge.node.id,
                voice_actors: edge.voiceActors?.length
                  ? {
                      set: [],
                      connect: edge.voiceActors.map((va) => ({ id: va.id }))
                    }
                  : undefined
              },
              create: {
                id: edge.id,
                role: edge.role,
                anime_id: anilist.id,
                character_id: edge.node.id,
                voice_actors: edge.voiceActors?.length
                  ? {
                      connect: edge.voiceActors.map((va) => ({ id: va.id }))
                    }
                  : undefined
              }
            })
          );
        }
      }

      // Studios
      if (anilist.studios?.edges?.length) {
        for (const edge of anilist.studios.edges) {
          ops.push(
            tx.animeStudio.upsert({
              where: { id: edge.node.id },
              update: { name: edge.node.name },
              create: {
                id: edge.node.id,
                name: edge.node.name
              }
            })
          );

          ops.push(
            tx.animeStudioEdge.upsert({
              where: { id: edge.id },
              update: {
                is_main: edge.isMain,
                anime_id: anilist.id,
                studio_id: edge.node.id
              },
              create: {
                id: edge.id,
                is_main: edge.isMain,
                anime_id: anilist.id,
                studio_id: edge.node.id
              }
            })
          );
        }
      }

      // Tags
      if (anilist.tags?.length) {
        for (const tag of anilist.tags) {
          ops.push(
            tx.animeTag.upsert({
              where: { id: tag.id },
              update: {
                name: tag.name,
                description: tag.description,
                category: tag.category,
                is_general_spoiler: tag.isGeneralSpoiler,
                is_adult: tag.isAdult
              },
              create: {
                id: tag.id,
                name: tag.name,
                description: tag.description,
                category: tag.category,
                is_general_spoiler: tag.isGeneralSpoiler,
                is_adult: tag.isAdult
              }
            })
          );

          ops.push(
            tx.animeTagEdge.upsert({
              where: {
                anime_id_tag_id: {
                  anime_id: anilist.id,
                  tag_id: tag.id
                }
              },
              update: {
                rank: tag.rank,
                is_media_spoiler: tag.isMediaSpoiler
              },
              create: {
                anime_id: anilist.id,
                tag_id: tag.id,
                rank: tag.rank,
                is_media_spoiler: tag.isMediaSpoiler
              }
            })
          );
        }
      }

      // External Links
      if (anilist.externalLinks?.length) {
        for (const link of anilist.externalLinks) {
          ops.push(
            tx.animeExternalLink.upsert({
              where: { id: link.id },
              update: {
                url: link.url,
                site: link.site,
                site_id: link.siteId,
                type: link.type,
                language: link.language,
                color: link.color,
                icon: link.icon,
                notes: link.notes,
                is_disabled: link.isDisabled,
                anime_id: anilist.id
              },
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
                is_disabled: link.isDisabled,
                anime_id: anilist.id
              }
            })
          );
        }
      }

      // Score Distribution
      if (anilist.stats?.scoreDistribution?.length) {
        for (const dist of anilist.stats.scoreDistribution) {
          ops.push(
            tx.animeScoreDistribution.upsert({
              where: {
                anime_id_score: {
                  anime_id: anilist.id,
                  score: dist.score
                }
              },
              update: { amount: dist.amount },
              create: {
                anime_id: anilist.id,
                score: dist.score,
                amount: dist.amount
              }
            })
          );
        }
      }

      // Status Distribution
      if (anilist.stats?.statusDistribution?.length) {
        for (const dist of anilist.stats.statusDistribution) {
          ops.push(
            tx.animeStatusDistribution.upsert({
              where: {
                anime_id_status: {
                  anime_id: anilist.id,
                  status: dist.status
                }
              },
              update: { amount: dist.amount },
              create: {
                anime_id: anilist.id,
                status: dist.status,
                amount: dist.amount
              }
            })
          );
        }
      }

      for (let i = 0; i < ops.length; i += Config.transaction_batch) {
        await Promise.all(ops.slice(i, i + Config.transaction_batch));
      }
    });
  }
}

const AnimePrisma = new AnimePrismaModule();

export { AnimePrisma, AnimePrismaModule };
