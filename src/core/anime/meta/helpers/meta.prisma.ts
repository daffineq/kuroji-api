import { Prisma } from '@prisma/client';
import { parseString } from 'src/helpers/parsers';
import { MVideo } from '../../providers/mal/types';
import { getImage } from '../../providers/tmdb/helpers/tmdb.utils';
import { SeasonEpisode } from '../../providers/tmdb/types';
import { ArtworkEntry, DescriptionEntry, ImageEntry, MappingEntry, ScreenshotEntry, TitleEntry } from './meta.dto';

export const getMetaCreateData = (id: number): Prisma.MetaCreateInput => {
  return {
    id,
    anime: {
      connect: { id }
    }
  };
};

export const addMappingsPrismaData = (data: Array<MappingEntry>): Prisma.MetaUpdateInput => {
  return {
    mappings: {
      connectOrCreate: data.map((m) => ({
        where: {
          sourceId_sourceName: {
            sourceId: parseString(m.id)!,
            sourceName: m.name
          }
        },
        create: {
          sourceId: parseString(m.id)!,
          sourceName: m.name
        }
      }))
    }
  };
};

export const editMappingsPrismaData = (old: MappingEntry, updated: MappingEntry): Prisma.MetaUpdateInput => {
  return {
    mappings: {
      update: {
        where: {
          sourceId_sourceName: {
            sourceId: parseString(old.id)!,
            sourceName: old.name
          }
        },
        data: {
          sourceId: parseString(updated.id)!,
          sourceName: updated.name
        }
      }
    }
  };
};

export const removeMappingsPrismaData = (data: MappingEntry): Prisma.MetaUpdateInput => {
  return {
    mappings: {
      disconnect: {
        sourceId_sourceName: {
          sourceId: parseString(data.id)!,
          sourceName: data.name
        }
      }
    }
  };
};

// Enhanced episode functions
export const addEpisodes = (episodes: Array<SeasonEpisode>): Prisma.MetaUpdateInput => {
  return {
    episodes: {
      upsert: episodes.map((e) => ({
        where: { id: e.id },
        update: {
          number: e.episode_number,
          title: e.name,
          overview: e.overview,
          thumbnail: {
            upsert: {
              where: { episodeId: e.id },
              create: {
                small: getImage('w300', e.still_path),
                medium: getImage('w780', e.still_path),
                large: getImage('original', e.still_path)
              },
              update: {
                small: getImage('w300', e.still_path),
                medium: getImage('w780', e.still_path),
                large: getImage('original', e.still_path)
              }
            }
          },
          runtime: e.runtime,
          date: e.air_date
        },
        create: {
          id: e.id,
          number: e.episode_number,
          title: e.name,
          overview: e.overview,
          thumbnail: {
            connectOrCreate: {
              where: { episodeId: e.id },
              create: {
                small: getImage('w300', e.still_path),
                medium: getImage('w780', e.still_path),
                large: getImage('original', e.still_path)
              }
            }
          },
          runtime: e.runtime,
          date: e.air_date
        }
      }))
    }
  };
};

export const removeEpisodes = (episodeIds: number[]): Prisma.MetaUpdateInput => {
  return {
    episodes: {
      disconnect: episodeIds.map((id) => ({ id }))
    }
  };
};

// Title management
export const addTitles = (titles: Array<TitleEntry>): Prisma.MetaUpdateInput => {
  return {
    titles: {
      connectOrCreate: titles.map((t) => ({
        where: {
          title_source_language: {
            title: t.title,
            source: t.source,
            language: t.language
          }
        },
        create: {
          title: t.title,
          source: t.source,
          language: t.language
        }
      }))
    }
  };
};

export const removeTitles = (titles: Array<TitleEntry>): Prisma.MetaUpdateInput => {
  return {
    titles: {
      disconnect: titles.map((t) => ({
        title_source_language: {
          title: t.title,
          source: t.source,
          language: t.language
        }
      }))
    }
  };
};

// Description management
export const addDescriptions = (descriptions: Array<DescriptionEntry>): Prisma.MetaUpdateInput => {
  return {
    descriptions: {
      connectOrCreate: descriptions.map((d) => ({
        where: {
          description_source_language: {
            description: d.description,
            source: d.source,
            language: d.language
          }
        },
        create: {
          description: d.description,
          source: d.source,
          language: d.language
        }
      }))
    }
  };
};

export const removeDescriptions = (descriptions: Array<DescriptionEntry>): Prisma.MetaUpdateInput => {
  return {
    descriptions: {
      disconnect: descriptions.map((t) => ({
        description_source_language: {
          description: t.description,
          source: t.source,
          language: t.language
        }
      }))
    }
  };
};

// Poster management
export const addImages = (images: Array<ImageEntry>): Prisma.MetaUpdateInput => {
  return {
    images: {
      connectOrCreate: images.map((i) => ({
        where: {
          url_type_source: {
            url: i.url,
            type: i.type,
            source: i.source
          }
        },
        create: {
          url: i.url,
          small: i.small,
          medium: i.medium,
          large: i.large,
          type: i.type,
          source: i.source
        }
      }))
    }
  };
};

export const removeImages = (
  images: Array<Pick<ImageEntry, 'url' | 'type' | 'source'>>
): Prisma.MetaUpdateInput => {
  return {
    images: {
      disconnect: images.map((i) => ({
        url_type_source: {
          url: i.url,
          type: i.type,
          source: i.source
        }
      }))
    }
  };
};

// Video management
export const addVideos = (videos: Array<MVideo>): Prisma.MetaUpdateInput => {
  return {
    videos: {
      upsert: videos.map((v) => ({
        where: { url: v.url },
        update: {
          title: v.title,
          thumbnail: v.thumbnail,
          artist: v.artist,
          type: v.type
        },
        create: {
          url: v.url,
          title: v.title,
          thumbnail: v.thumbnail,
          artist: v.artist,
          type: v.type
        }
      }))
    }
  };
};

export const removeVideos = (videoUrls: string[]): Prisma.MetaUpdateInput => {
  return {
    videos: {
      disconnect: videoUrls.map((url) => ({ url }))
    }
  };
};

// Screenshot management
export const addScreenshots = (screenshots: Array<ScreenshotEntry>): Prisma.MetaUpdateInput => {
  return {
    screenshots: {
      upsert: screenshots.map((s) => ({
        where: { id: s.id },
        update: {
          originalUrl: s.originalUrl,
          x166Url: s.x166Url,
          x332Url: s.x332Url
        },
        create: {
          id: s.id,
          originalUrl: s.originalUrl,
          x166Url: s.x166Url,
          x332Url: s.x332Url
        }
      }))
    }
  };
};

export const removeScreenshots = (screenshotIds: string[]): Prisma.MetaUpdateInput => {
  return {
    screenshots: {
      disconnect: screenshotIds.map((id) => ({ id }))
    }
  };
};

// Artwork management
export const addArtworks = (artworks: Array<ArtworkEntry>): Prisma.MetaUpdateInput => {
  return {
    artworks: {
      upsert: artworks.map((a) => ({
        where: { url_type_source: { url: a.url, source: a.source, type: a.type } },
        update: {
          url: a.url,
          height: a.height,
          image: a.image,
          language: a.language,
          thumbnail: a.thumbnail,
          type: a.type,
          width: a.width,
          source: a.source
        },
        create: {
          url: a.url,
          height: a.height,
          image: a.image,
          language: a.language,
          thumbnail: a.thumbnail,
          type: a.type,
          width: a.width,
          source: a.source
        }
      }))
    }
  };
};

// export const removeArtworks = (artworkIds: number[]): Prisma.MetaUpdateInput => {
//   return {
//     artworks: {
//       disconnect: artworkIds.map((id) => ({ id }))
//     }
//   };
// };
