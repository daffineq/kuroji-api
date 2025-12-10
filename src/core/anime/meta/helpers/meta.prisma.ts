import { parseString } from 'src/helpers/parsers';
import { SeasonEpisode } from '../../providers/tmdb/types';
import {
  ArtworkEntry,
  ChronologyEntry,
  DescriptionEntry,
  ImageEntry,
  MappingEntry,
  ScreenshotEntry,
  TitleEntry,
  VideoEntry
} from './meta.dto';
import { TmdbUtils } from '../../providers';
import { Prisma } from 'src/lib/prisma';
import { Module } from 'src/helpers/module';

class MetaPrismaModule extends Module {
  override readonly name = 'MetaPrisma';

  getMeta(id: number): Prisma.MetaCreateInput {
    return {
      id,
      anime: {
        connect: { id }
      }
    };
  }

  addMappings(data: Array<MappingEntry>): Prisma.MetaUpdateInput {
    return {
      mappings: {
        connectOrCreate: data.map((m) => ({
          where: {
            source_id_source_name: {
              source_id: parseString(m.id)!,
              source_name: m.name
            }
          },
          create: {
            source_id: parseString(m.id)!,
            source_name: m.name
          }
        }))
      }
    };
  }

  addEpisodes(episodes: Array<SeasonEpisode>): Prisma.MetaUpdateInput {
    return {
      episodes: {
        upsert: episodes.map((e) => ({
          where: { id: e.id },
          update: {
            id: e.id,
            number: e.episode_number,
            title: e.name,
            overview: e.overview,
            thumbnail: {
              upsert: {
                where: { episode_id: e.id },
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
            date: e.air_date,
            season_number: e.season_number,
            tmdb_show_id: e.show_id
          },
          create: {
            id: e.id,
            number: e.episode_number,
            title: e.name,
            overview: e.overview,
            thumbnail: {
              connectOrCreate: {
                where: { episode_id: e.id },
                create: {
                  small: TmdbUtils.getImage('w300', e.still_path),
                  medium: TmdbUtils.getImage('w780', e.still_path),
                  large: TmdbUtils.getImage('original', e.still_path)
                }
              }
            },
            runtime: e.runtime,
            date: e.air_date,
            season_number: e.season_number,
            tmdb_show_id: e.show_id
          }
        }))
      }
    };
  }

  addTitles(titles: Array<TitleEntry>): Prisma.MetaUpdateInput {
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
  }

  addDescriptions(descriptions: Array<DescriptionEntry>): Prisma.MetaUpdateInput {
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
  }

  addImages(images: Array<ImageEntry>): Prisma.MetaUpdateInput {
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
  }

  addVideos(videos: Array<VideoEntry>): Prisma.MetaUpdateInput {
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
  }

  addScreenshots(screenshots: Array<ScreenshotEntry>): Prisma.MetaUpdateInput {
    return {
      screenshots: {
        upsert: screenshots.map((s) => ({
          where: { id: s.id },
          update: {
            original: s.originalUrl,
            x166: s.x166Url,
            x332: s.x332Url
          },
          create: {
            id: s.id,
            original: s.originalUrl,
            x166: s.x166Url,
            x332: s.x332Url
          }
        }))
      }
    };
  }

  addArtworks(artworks: Array<ArtworkEntry>): Prisma.MetaUpdateInput {
    return {
      artworks: {
        upsert: artworks.map((a) => ({
          where: { url_type_source: { url: a.url, source: a.source, type: a.type } },
          update: {
            url: a.url,
            height: a.height,
            image: a.image,
            iso_639_1: a.iso_639_1,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width,
            source: a.source
          },
          create: {
            url: a.url,
            height: a.height,
            image: a.image,
            iso_639_1: a.iso_639_1,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width,
            source: a.source
          }
        }))
      }
    };
  }

  addChronologies(chronologies: Array<ChronologyEntry>): Prisma.MetaUpdateInput {
    return {
      chronology: {
        upsert: chronologies.map((c) => ({
          where: {
            parent_id_related_id_order: { parent_id: c.parentId, related_id: c.relatedId, order: c.order }
          },
          update: {
            parent_id: c.parentId,
            related_id: c.relatedId,
            order: c.order
          },
          create: {
            parent_id: c.parentId,
            related_id: c.relatedId,
            order: c.order
          }
        }))
      }
    };
  }
}

const MetaPrisma = new MetaPrismaModule();

export { MetaPrisma, MetaPrismaModule };
