import { Prisma } from '@prisma/client';
import { parseString } from 'src/helpers/parsers';
import { MVideo } from '../../providers/mal/types';
import { SeasonEpisode } from '../../providers/tmdb/types';
import {
  ArtworkEntry,
  DescriptionEntry,
  ImageEntry,
  MappingEntry,
  ScreenshotEntry,
  TitleEntry,
  VideoEntry
} from './meta.dto';
import { TmdbUtils } from '../../providers';

const getMeta = (id: number): Prisma.MetaCreateInput => {
  return {
    id,
    anime: {
      connect: { id }
    }
  };
};

const addMappings = (data: Array<MappingEntry>): Prisma.MetaUpdateInput => {
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

const editMappings = (old: MappingEntry, updated: MappingEntry): Prisma.MetaUpdateInput => {
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

const removeMappings = (data: MappingEntry): Prisma.MetaUpdateInput => {
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

const addEpisodes = (episodes: Array<SeasonEpisode>): Prisma.MetaUpdateInput => {
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
                small: TmdbUtils.getImage('w300', e.still_path),
                medium: TmdbUtils.getImage('w780', e.still_path),
                large: TmdbUtils.getImage('original', e.still_path)
              },
              update: {
                small: TmdbUtils.getImage('w300', e.still_path),
                medium: TmdbUtils.getImage('w780', e.still_path),
                large: TmdbUtils.getImage('original', e.still_path)
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
                small: TmdbUtils.getImage('w300', e.still_path),
                medium: TmdbUtils.getImage('w780', e.still_path),
                large: TmdbUtils.getImage('original', e.still_path)
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

const removeEpisodes = (episodeIds: number[]): Prisma.MetaUpdateInput => {
  return {
    episodes: {
      disconnect: episodeIds.map((id) => ({ id }))
    }
  };
};

const addTitles = (titles: Array<TitleEntry>): Prisma.MetaUpdateInput => {
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

const removeTitles = (titles: Array<TitleEntry>): Prisma.MetaUpdateInput => {
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

const addDescriptions = (descriptions: Array<DescriptionEntry>): Prisma.MetaUpdateInput => {
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

const removeDescriptions = (descriptions: Array<DescriptionEntry>): Prisma.MetaUpdateInput => {
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

const addImages = (images: Array<ImageEntry>): Prisma.MetaUpdateInput => {
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

const removeImages = (images: Array<Pick<ImageEntry, 'url' | 'type' | 'source'>>): Prisma.MetaUpdateInput => {
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

const addVideos = (videos: Array<VideoEntry>): Prisma.MetaUpdateInput => {
  return {
    videos: {
      upsert: videos.map((v) => ({
        where: { url_source: { url: v.url, source: v.source } },
        update: {
          title: v.title,
          thumbnail: v.thumbnail,
          artist: v.artist,
          type: v.type,
          source: v.source
        },
        create: {
          url: v.url,
          title: v.title,
          thumbnail: v.thumbnail,
          artist: v.artist,
          type: v.type,
          source: v.source
        }
      }))
    }
  };
};

// const removeVideos = (videoUrls: string[]): Prisma.MetaUpdateInput => {
//   return {
//     videos: {
//       disconnect: videoUrls.map((url) => ({ url }))
//     }
//   };
// };

const addScreenshots = (screenshots: Array<ScreenshotEntry>): Prisma.MetaUpdateInput => {
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

const removeScreenshots = (screenshotIds: string[]): Prisma.MetaUpdateInput => {
  return {
    screenshots: {
      disconnect: screenshotIds.map((id) => ({ id }))
    }
  };
};

const addArtworks = (artworks: Array<ArtworkEntry>): Prisma.MetaUpdateInput => {
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

const MetaPrisma = {
  getMeta,
  addMappings,
  editMappings,
  removeMappings,
  addEpisodes,
  removeEpisodes,
  addTitles,
  removeTitles,
  addDescriptions,
  removeDescriptions,
  addImages,
  removeImages,
  addVideos,
  addScreenshots,
  removeScreenshots,
  addArtworks
};

export { MetaPrisma };
