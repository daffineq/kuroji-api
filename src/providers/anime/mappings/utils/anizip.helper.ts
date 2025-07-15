import { Prisma } from '@prisma/client';
import { IAniZipData } from '../types/types.js';

export function getAnizipData(anizip: IAniZipData): Prisma.AniZipCreateInput {
  if (!anizip) {
    throw new Error('AniZip data is missing, chief!');
  }

  if (!anizip.mappings?.anilist_id) {
    throw new Error('AniZip data must have anilist_id in mappings');
  }

  return {
    episodeCount: anizip.episodeCount ?? 0,
    specialCount: anizip.specialCount ?? 0,

    titles:
      anizip.titles && typeof anizip.titles === 'object'
        ? {
            connectOrCreate: Object.entries(anizip.titles)
              .filter(([key, name]) => key && name)
              .map(([key, name]) => ({
                where: {
                  aniZipId_key: {
                    aniZipId: anizip.mappings.anilist_id || 0,
                    key,
                  },
                },
                create: {
                  key,
                  name,
                },
              })),
          }
        : undefined,

    images:
      Array.isArray(anizip.images) && anizip.images.length > 0
        ? {
            create: anizip.images
              .filter((image) => image && image.url)
              .map((image) => ({
                coverType: image.coverType ?? 'unknown',
                url: image.url,
              })),
          }
        : undefined,

    episodes:
      anizip.episodes && typeof anizip.episodes === 'object'
        ? {
            connectOrCreate: Object.entries(anizip.episodes)
              .filter(([episodeKey, episodeData]) => {
                return (
                  episodeKey &&
                  episodeData &&
                  episodeData.episodeNumber !== undefined &&
                  episodeData.seasonNumber !== undefined &&
                  episodeData.absoluteEpisodeNumber !== undefined &&
                  episodeData.tvdbShowId !== undefined &&
                  episodeData.tvdbId !== undefined
                );
              })
              .map(([episodeKey, episodeData]) => ({
                where: {
                  aniZipId_episodeKey: {
                    aniZipId: anizip.mappings.anilist_id || 0,
                    episodeKey,
                  },
                },
                create: {
                  episodeKey,
                  episodeNumber: episodeData.episodeNumber ?? 0,
                  seasonNumber: episodeData.seasonNumber ?? 0,
                  absoluteEpisodeNumber: episodeData.absoluteEpisodeNumber ?? 0,
                  tvdbShowId: episodeData.tvdbShowId ?? 0,
                  tvdbId: episodeData.tvdbId ?? 0,
                  airDate: episodeData.airDate ?? null,
                  airDateUtc: episodeData.airDateUtc ?? null,
                  runtime: episodeData.runtime ?? null,
                  length: episodeData.length ?? null,
                  overview: episodeData.overview ?? null,
                  image: episodeData.image ?? null,
                  rating: episodeData.rating ?? null,
                  episode: episodeData.episode ?? null,
                  anidbEid: episodeData.anidbEid ?? null,

                  titles:
                    episodeData.title && typeof episodeData.title === 'object'
                      ? {
                          create: Object.entries(episodeData.title)
                            .filter(([key, name]) => key && name)
                            .map(([key, name]) => ({
                              key,
                              name,
                            })),
                        }
                      : undefined,
                },
              })),
          }
        : undefined,

    mappings: anizip.mappings
      ? {
          connectOrCreate: {
            where: {
              aniZipId: anizip.mappings.anilist_id || 0,
            },
            create: {
              animePlanetId: anizip.mappings.animeplanet_id ?? null,
              kitsuId: anizip.mappings.kitsu_id
                ? String(anizip.mappings.kitsu_id)
                : null,
              malId: anizip.mappings.mal_id ?? null,
              type: anizip.mappings.type ?? null,
              anilistId: anizip.mappings.anilist_id ?? null,
              anisearchId: anizip.mappings.anisearch_id ?? null,
              anidbId: anizip.mappings.anidb_id ?? null,
              notifymoeId: anizip.mappings.notifymoe_id ?? null,
              livechartId: anizip.mappings.livechart_id ?? null,
              thetvdbId: anizip.mappings.thetvdb_id ?? null,
              imdbId: anizip.mappings.imdb_id ?? null,
              themoviedbId:
                anizip.mappings.themoviedb_id !== undefined &&
                anizip.mappings.themoviedb_id !== null
                  ? +anizip.mappings.themoviedb_id
                  : null,
            },
          },
        }
      : undefined,

    anilist: anizip.mappings?.anilist_id
      ? {
          connect: {
            id: anizip.mappings.anilist_id,
          },
        }
      : undefined,
  };
}

export function getAnizipInclude(): Prisma.AniZipInclude {
  return {
    titles: {
      omit: {
        id: true,
        aniZipId: true,
      },
    },
    images: {
      omit: {
        id: true,
        aniZipId: true,
      },
    },
    episodes: {
      omit: {
        id: true,
        aniZipId: true,
      },
      include: {
        titles: {
          omit: {
            id: true,
            episodeId: true,
          },
        },
      },
    },
    mappings: {
      omit: {
        id: true,
        aniZipId: true,
      },
    },
  };
}
