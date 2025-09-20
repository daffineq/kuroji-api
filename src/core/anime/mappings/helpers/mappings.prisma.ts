import { Prisma } from '@prisma/client';
import { SeasonEpisode } from '../../tmdb/types';
import { parseString } from 'src/helpers/parsers';
import { MappingEntry, TitleEntry, PosterEntry, BannerEntry, ScreenshotEntry, ArtworkEntry } from './mappings.dto';
import { MVideo } from '../../mal/types';
import { getImage } from '../../tmdb/helpers/tmdb.utils';

export const getMappingsPrismaData = (id: number, data: Array<MappingEntry>): Prisma.MappingsCreateInput => {
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
    },
    anime: {
      connect: { id }
    }
  };
};

export const addMappingsPrismaData = (data: MappingEntry): Prisma.MappingsUpdateInput => {
  return {
    mappings: {
      connectOrCreate: {
        where: {
          sourceId_sourceName: {
            sourceId: parseString(data.id)!,
            sourceName: data.name
          }
        },
        create: {
          sourceId: parseString(data.id)!,
          sourceName: data.name
        }
      }
    }
  };
};

export const editMappingsPrismaData = (old: MappingEntry, updated: MappingEntry): Prisma.MappingsUpdateInput => {
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

export const removeMappingsPrismaData = (data: MappingEntry): Prisma.MappingsUpdateInput => {
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
export const addEpisodes = (episodes: Array<SeasonEpisode>): Prisma.MappingsUpdateInput => {
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

export const removeEpisodes = (episodeIds: number[]): Prisma.MappingsUpdateInput => {
  return {
    episodes: {
      disconnect: episodeIds.map((id) => ({ id }))
    }
  };
};

// Title management
export const addTitles = (titles: Array<TitleEntry>): Prisma.MappingsUpdateInput => {
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

export const removeTitles = (titles: Array<TitleEntry>): Prisma.MappingsUpdateInput => {
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

// Poster management
export const addPosters = (posters: Array<PosterEntry>): Prisma.MappingsUpdateInput => {
  return {
    posters: {
      connectOrCreate: posters.map((p) => ({
        where: {
          url_source: {
            url: p.url,
            source: p.source
          }
        },
        create: {
          url: p.url,
          small: p.small,
          medium: p.medium,
          large: p.large,
          source: p.source
        }
      }))
    }
  };
};

export const removePosters = (posters: Array<Pick<PosterEntry, 'url' | 'source'>>): Prisma.MappingsUpdateInput => {
  return {
    posters: {
      disconnect: posters.map((p) => ({
        url_source: {
          url: p.url,
          source: p.source
        }
      }))
    }
  };
};

// Banner management
export const addBanners = (banners: Array<BannerEntry>): Prisma.MappingsUpdateInput => {
  return {
    banners: {
      connectOrCreate: banners.map((b) => ({
        where: {
          url_source: {
            url: b.url,
            source: b.source
          }
        },
        create: {
          url: b.url,
          small: b.small,
          medium: b.medium,
          large: b.large,
          source: b.source
        }
      }))
    }
  };
};

export const removeBanners = (banners: Array<Pick<BannerEntry, 'url' | 'source'>>): Prisma.MappingsUpdateInput => {
  return {
    banners: {
      disconnect: banners.map((b) => ({
        url_source: {
          url: b.url,
          source: b.source
        }
      }))
    }
  };
};

// Video management
export const addVideos = (videos: Array<MVideo>): Prisma.MappingsUpdateInput => {
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

export const removeVideos = (videoUrls: string[]): Prisma.MappingsUpdateInput => {
  return {
    videos: {
      disconnect: videoUrls.map((url) => ({ url }))
    }
  };
};

// Screenshot management
export const addScreenshots = (screenshots: Array<ScreenshotEntry>): Prisma.MappingsUpdateInput => {
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

export const removeScreenshots = (screenshotIds: string[]): Prisma.MappingsUpdateInput => {
  return {
    screenshots: {
      disconnect: screenshotIds.map((id) => ({ id }))
    }
  };
};

// Artwork management
export const addArtworks = (artworks: Array<ArtworkEntry>): Prisma.MappingsUpdateInput => {
  return {
    artworks: {
      upsert: artworks
        .filter((a) => a.id)
        .map((a) => ({
          where: { id: a.id },
          update: {
            height: a.height,
            image: a.image,
            includesText: a.includesText,
            language: a.language,
            score: a.score,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width
          },
          create: {
            id: a.id,
            height: a.height,
            image: a.image,
            includesText: a.includesText,
            language: a.language,
            score: a.score,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width
          }
        }))
    }
  };
};

export const removeArtworks = (artworkIds: number[]): Prisma.MappingsUpdateInput => {
  return {
    artworks: {
      disconnect: artworkIds.map((id) => ({ id }))
    }
  };
};

export const bulkUpdate = (data: {
  titles?: Array<TitleEntry>;
  posters?: Array<PosterEntry>;
  banners?: Array<BannerEntry>;
  videos?: Array<MVideo>;
  screenshots?: Array<ScreenshotEntry>;
  artworks?: Array<ArtworkEntry>;
  episodes?: Array<SeasonEpisode>;
  mappings?: Array<MappingEntry>;
}): Prisma.MappingsUpdateInput => {
  const update: Prisma.MappingsUpdateInput = {};

  if (data.titles?.length) {
    update.titles = addTitles(data.titles).titles;
  }

  if (data.posters?.length) {
    update.posters = addPosters(data.posters).posters;
  }

  if (data.banners?.length) {
    update.banners = addBanners(data.banners).banners;
  }

  if (data.videos?.length) {
    update.videos = addVideos(data.videos).videos;
  }

  if (data.screenshots?.length) {
    update.screenshots = addScreenshots(data.screenshots).screenshots;
  }

  if (data.artworks?.length) {
    update.artworks = addArtworks(data.artworks).artworks;
  }

  if (data.episodes?.length) {
    update.episodes = addEpisodes(data.episodes).episodes;
  }

  if (data.mappings?.length) {
    update.mappings = {
      connectOrCreate: data.mappings.map((m) => ({
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
    };
  }

  return update;
};
