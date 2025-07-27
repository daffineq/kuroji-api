import { Prisma } from '@prisma/client';
import { AnilibriaEntry } from '../types/types.js';

export function getAnilibriaData(
  anime: AnilibriaEntry,
): Prisma.AnilibriaCreateInput {
  return {
    id: anime.id,
    year: anime.year ?? undefined,
    alias: anime.alias ?? undefined,
    fresh_at: anime.fresh_at ?? undefined,
    created_at: anime.created_at ?? undefined,
    updated_at: anime.updated_at ?? undefined,
    is_ongoing: anime.is_ongoing ?? undefined,
    description: anime.description ?? undefined,
    notification: anime.notification ?? undefined,
    episodes_total: anime.episodes_total ?? undefined,
    external_player: anime.external_player ?? undefined,
    is_in_production: anime.is_in_production ?? undefined,
    is_blocked_by_copyrights: anime.is_blocked_by_copyrights ?? undefined,
    added_in_users_favorites: anime.added_in_users_favorites ?? undefined,
    average_duration_of_episode: anime.average_duration_of_episode ?? undefined,
    added_in_planned_collection: anime.added_in_planned_collection ?? undefined,
    added_in_watched_collection: anime.added_in_watched_collection ?? undefined,
    added_in_watching_collection:
      anime.added_in_watching_collection ?? undefined,
    added_in_postponed_collection:
      anime.added_in_postponed_collection ?? undefined,
    added_in_abandoned_collection:
      anime.added_in_abandoned_collection ?? undefined,

    publish_day:
      anime.publish_day?.value !== undefined || anime.publish_day?.description
        ? {
            connectOrCreate: {
              where: { id: anime.publish_day.value },
              create: {
                id: anime.publish_day.value,
                value: anime.publish_day?.value ?? undefined,
                description: anime.publish_day?.description ?? undefined,
              },
            },
          }
        : undefined,

    type:
      anime.type?.value && anime.type?.description
        ? {
            connectOrCreate: {
              where: { anilibriaId: anime.id },
              create: {
                value: anime.type.value,
                description: anime.type.description,
              },
            },
          }
        : undefined,

    name:
      anime.name?.main || anime.name?.english || anime.name?.alternative
        ? {
            connectOrCreate: {
              where: { anilibriaId: anime.id },
              create: {
                main: anime.name?.main ?? undefined,
                english: anime.name?.english ?? undefined,
                alternative: anime.name?.alternative ?? undefined,
              },
            },
          }
        : undefined,

    season:
      anime.season?.value && anime.season?.description
        ? {
            connectOrCreate: {
              where: { anilibriaId: anime.id },
              create: {
                value: anime.season.value,
                description: anime.season.description,
              },
            },
          }
        : undefined,

    poster:
      anime.poster?.preview || anime.poster?.thumbnail
        ? {
            connectOrCreate: {
              where: { anilibriaId: anime.id },
              create: {
                preview: anime.poster?.preview ?? undefined,
                thumbnail: anime.poster?.thumbnail ?? undefined,
                optimized_preview:
                  anime.poster?.optimized?.preview ?? undefined,
                optimized_thumbnail:
                  anime.poster?.optimized?.thumbnail ?? undefined,
              },
            },
          }
        : undefined,

    age_rating: anime.age_rating?.value
      ? {
          connectOrCreate: {
            where: { anilibriaId: anime.id },
            create: {
              value: anime.age_rating?.value ?? undefined,
              label: anime.age_rating?.label ?? undefined,
              is_adult: anime.age_rating?.is_adult ?? undefined,
              description: anime.age_rating?.description ?? undefined,
            },
          },
        }
      : undefined,

    sponsor: anime.sponsor?.id
      ? {
          connectOrCreate: {
            where: { id: anime.sponsor.id },
            create: {
              id: anime.sponsor.id,
              title: anime.sponsor?.title ?? undefined,
              description: anime.sponsor?.description ?? undefined,
              url_title: anime.sponsor?.url_title ?? undefined,
              url: anime.sponsor?.url ?? undefined,
            },
          },
        }
      : undefined,

    genres: anime.genres?.length
      ? {
          create: anime.genres
            .filter((g) => g?.id)
            .map((g) => ({
              genre: {
                connectOrCreate: {
                  where: { id: g.id },
                  create: {
                    id: g.id,
                    name: g.name ?? undefined,
                    preview: g.image?.preview ?? undefined,
                    thumbnail: g.image?.thumbnail ?? undefined,
                    optimized_preview: g.image?.optimized?.preview ?? undefined,
                    optimized_thumbnail:
                      g.image?.optimized?.thumbnail ?? undefined,
                  },
                },
              },
              total_releases: g.total_releases ?? undefined,
            })),
        }
      : undefined,

    episodes: anime.episodes?.length
      ? {
          connectOrCreate: anime.episodes
            .filter((e) => e?.id)
            .map((e) => ({
              where: { id: e.id },
              create: {
                id: e.id,
                updated_at: e.updated_at ?? undefined,
                name: e.name ?? undefined,
                name_english: e.name_english ?? undefined,
                ordinal: e.ordinal ?? undefined,
                duration: e.duration ?? undefined,
                rutube_id: e.rutube_id ?? undefined,
                youtube_id: e.youtube_id ?? undefined,
                sort_order: e.sort_order ?? undefined,
                release_id: e.release_id ?? undefined,
                hls_480: e.hls_480 ?? undefined,
                hls_720: e.hls_720 ?? undefined,
                hls_1080: e.hls_1080 ?? undefined,
                ending:
                  e.ending?.start && e.ending?.stop
                    ? {
                        create: {
                          start: e.ending.start,
                          stop: e.ending.stop,
                        },
                      }
                    : undefined,
                opening:
                  e.opening?.start && e.opening?.stop
                    ? {
                        create: {
                          start: e.opening.start,
                          stop: e.opening.stop,
                        },
                      }
                    : undefined,
                preview:
                  e.preview?.preview || e.preview?.thumbnail
                    ? {
                        create: {
                          preview: e.preview.preview ?? undefined,
                          thumbnail: e.preview.thumbnail ?? undefined,
                          optimized_preview:
                            e.preview.optimized?.preview ?? undefined,
                          optimized_thumbnail:
                            e.preview.optimized?.thumbnail ?? undefined,
                        },
                      }
                    : undefined,
              },
            })),
        }
      : undefined,

    torrents: anime.torrents?.length
      ? {
          connectOrCreate: anime.torrents
            .filter((t) => t?.id)
            .map((t) => ({
              where: { id: t.id },
              create: {
                id: t.id,
                hash: t.hash ?? undefined,
                size: t.size ?? undefined,
                label: t.label ?? undefined,
                magnet: t.magnet ?? undefined,
                filename: t.filename ?? undefined,
                seeders: t.seeders ?? undefined,
                bitrate: t.bitrate ?? undefined,
                leechers: t.leechers ?? undefined,
                sort_order: t.sort_order ?? undefined,
                updated_at: t.updated_at ?? undefined,
                is_hardsub: t.is_hardsub ?? undefined,
                description: t.description ?? undefined,
                created_at: t.created_at ?? undefined,
                completed_times: t.completed_times ?? undefined,
                type: t.type?.value
                  ? {
                      connectOrCreate: {
                        where: { torrentId: t.id },
                        create: {
                          value: t.type.value,
                          description: t.type.description ?? undefined,
                        },
                      },
                    }
                  : undefined,
                color: t.color?.value
                  ? {
                      connectOrCreate: {
                        where: { torrentId: t.id },
                        create: {
                          value: t.color.value,
                          description: t.color.description ?? undefined,
                        },
                      },
                    }
                  : undefined,
                codec: t.codec?.value
                  ? {
                      connectOrCreate: {
                        where: { torrentId: t.id },
                        create: {
                          value: t.codec.value,
                          label: t.codec.label ?? undefined,
                          description: t.codec.description ?? undefined,
                          label_color: t.codec.label_color ?? undefined,
                          label_is_visible:
                            t.codec.label_is_visible ?? undefined,
                        },
                      },
                    }
                  : undefined,
                quality: t.quality?.value
                  ? {
                      connectOrCreate: {
                        where: { torrentId: t.id },
                        create: {
                          value: t.quality.value,
                          description: t.quality.description ?? undefined,
                        },
                      },
                    }
                  : undefined,
              },
            })),
        }
      : undefined,

    anilist: anime.anilistId ? { connect: { id: anime.anilistId } } : undefined,
  };
}
