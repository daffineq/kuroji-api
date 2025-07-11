import { Prisma } from '@prisma/client';
import { IAniZipData } from '../types/types.js';

export function getAnizipData(anizip: IAniZipData): Prisma.AniZipCreateInput {
  // Handle the case where anizip might be null/undefined
  if (!anizip) {
    throw new Error('AniZip data is missing, chief!');
  }

  return {
    episodeCount: anizip.episodeCount ?? 0,
    specialCount: anizip.specialCount ?? 0,

    // Create titles from the titles object - handle undefined/null titles
    titles:
      anizip.titles && typeof anizip.titles === 'object'
        ? {
            create: Object.entries(anizip.titles)
              .filter(([key, name]) => key && name) // Filter out empty keys/names
              .map(([key, name]) => ({
                key,
                name,
              })),
          }
        : undefined,

    // Create images - handle undefined/null images array
    images:
      Array.isArray(anizip.images) && anizip.images.length > 0
        ? {
            create: anizip.images
              .filter((image) => image && image.url) // Filter out invalid images
              .map((image) => ({
                coverType: image.coverType ?? 'unknown',
                url: image.url,
              })),
          }
        : undefined,

    // Create episodes - handle undefined/null episodes object
    episodes:
      anizip.episodes && typeof anizip.episodes === 'object'
        ? {
            create: Object.entries(anizip.episodes)
              .filter(([episodeKey, episodeData]) => {
                // Make sure we got valid episode data
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

                // Create episode titles if they exist
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
              })),
          }
        : undefined,

    // Create mappings - handle undefined/null mappings
    mappings: anizip.mappings
      ? {
          create: {
            animePlanetId: anizip.mappings.animeplanet_id ?? null,
            kitsuId: String(anizip.mappings.kitsu_id) ?? null,
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
        }
      : undefined,

    // Handle anilist connection - make sure we got a valid ID
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
