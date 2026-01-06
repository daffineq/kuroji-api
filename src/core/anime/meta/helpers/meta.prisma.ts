import { parseString } from 'src/helpers/parsers';
import { MetaPayload } from './meta.dto';
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

  buildUpdateData(payload: MetaPayload): Prisma.MetaUpdateInput {
    const data: Prisma.MetaUpdateInput = {};

    if (payload.franchise !== undefined) data.franchise = payload.franchise;
    if (payload.rating !== undefined) data.rating = payload.rating;
    if (payload.episodes_aired !== undefined) data.episodes_aired = payload.episodes_aired;
    if (payload.episodes_total !== undefined) data.episodes_total = payload.episodes_total;
    if (payload.moreinfo !== undefined) data.moreinfo = payload.moreinfo;
    if (payload.broadcast !== undefined) data.broadcast = payload.broadcast;
    if (payload.nsfw !== undefined) data.nsfw = payload.nsfw;

    if (payload.mappings) {
      const mappings = Array.isArray(payload.mappings) ? payload.mappings : [payload.mappings];
      data.mappings = {
        connectOrCreate: mappings.map((m) => ({
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
      };
    }

    if (payload.titles) {
      const titles = Array.isArray(payload.titles) ? payload.titles : [payload.titles];
      data.titles = {
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
      };
    }

    if (payload.descriptions) {
      const descriptions = Array.isArray(payload.descriptions) ? payload.descriptions : [payload.descriptions];
      data.descriptions = {
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
      };
    }

    if (payload.images) {
      const images = Array.isArray(payload.images) ? payload.images : [payload.images];
      data.images = {
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
      };
    }

    if (payload.videos) {
      const videos = Array.isArray(payload.videos) ? payload.videos : [payload.videos];
      data.videos = {
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
      };
    }

    if (payload.screenshots) {
      const screenshots = Array.isArray(payload.screenshots) ? payload.screenshots : [payload.screenshots];
      data.screenshots = {
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
      };
    }

    if (payload.artworks) {
      const artworks = Array.isArray(payload.artworks) ? payload.artworks : [payload.artworks];
      data.artworks = {
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
      };
    }

    if (payload.chronologies) {
      const chronologies = Array.isArray(payload.chronologies) ? payload.chronologies : [payload.chronologies];
      data.chronology = {
        upsert: chronologies.map((c) => ({
          where: {
            parent_id_related_id_order: {
              parent_id: c.parentId,
              related_id: c.relatedId,
              order: c.order
            }
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
      };
    }

    if (payload.episodes) {
      const episodes = Array.isArray(payload.episodes) ? payload.episodes : [payload.episodes];
      data.episodes = {
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
      };
    }

    return data;
  }

  buildRemoveData(payload: Partial<Record<keyof MetaPayload, true>>): Prisma.MetaUpdateInput {
    const data: Prisma.MetaUpdateInput = {};

    if (payload.franchise) data.franchise = null;
    if (payload.rating) data.rating = null;
    if (payload.episodes_aired) data.episodes_aired = null;
    if (payload.episodes_total) data.episodes_total = null;
    if (payload.moreinfo) data.moreinfo = null;
    if (payload.broadcast) data.broadcast = null;
    if (payload.nsfw) data.nsfw = false;

    if (payload.mappings) {
      data.mappings = { set: [] };
    }

    if (payload.titles) {
      data.titles = { set: [] };
    }

    if (payload.descriptions) {
      data.descriptions = { set: [] };
    }

    if (payload.images) {
      data.images = { set: [] };
    }

    if (payload.videos) {
      data.videos = { set: [] };
    }

    if (payload.screenshots) {
      data.screenshots = { set: [] };
    }

    if (payload.artworks) {
      data.artworks = { set: [] };
    }

    if (payload.chronologies) {
      data.chronology = { set: [] };
    }

    if (payload.episodes) {
      data.episodes = { set: [] };
    }

    return data;
  }

  buildForceUpdateData(id: number, payload: MetaPayload): Prisma.MetaUpdateInput {
    const data: Prisma.MetaUpdateInput = {};

    // Scalar fields - just overwrite
    if (payload.franchise !== undefined) data.franchise = payload.franchise;
    if (payload.rating !== undefined) data.rating = payload.rating;
    if (payload.episodes_aired !== undefined) data.episodes_aired = payload.episodes_aired;
    if (payload.episodes_total !== undefined) data.episodes_total = payload.episodes_total;
    if (payload.moreinfo !== undefined) data.moreinfo = payload.moreinfo;
    if (payload.broadcast !== undefined) data.broadcast = payload.broadcast;
    if (payload.nsfw !== undefined) data.nsfw = payload.nsfw;

    // Relational fields - clear then set
    if (payload.mappings) {
      const mappings = Array.isArray(payload.mappings) ? payload.mappings : [payload.mappings];

      data.mappings = {
        set: [],
        connectOrCreate: mappings.map((m) => ({
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
      };
    }

    if (payload.titles) {
      const titles = Array.isArray(payload.titles) ? payload.titles : [payload.titles];
      data.titles = {
        set: [],
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
      };
    }

    if (payload.descriptions) {
      const descriptions = Array.isArray(payload.descriptions) ? payload.descriptions : [payload.descriptions];
      data.descriptions = {
        set: [],
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
      };
    }

    if (payload.images) {
      const images = Array.isArray(payload.images) ? payload.images : [payload.images];
      data.images = {
        set: [],
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
      };
    }

    if (payload.videos) {
      const videos = Array.isArray(payload.videos) ? payload.videos : [payload.videos];
      data.videos = {
        set: [],
        connectOrCreate: videos.map((v) => ({
          where: { url_source: { url: v.url, source: v.source } },
          create: {
            url: v.url,
            title: v.title,
            thumbnail: v.thumbnail,
            artist: v.artist,
            type: v.type,
            source: v.source
          }
        }))
      };
    }

    if (payload.screenshots) {
      const screenshots = Array.isArray(payload.screenshots) ? payload.screenshots : [payload.screenshots];
      data.screenshots = {
        set: [],
        connectOrCreate: screenshots.map((s) => ({
          where: { id: s.id },
          create: {
            id: s.id,
            original: s.originalUrl,
            x166: s.x166Url,
            x332: s.x332Url
          }
        }))
      };
    }

    if (payload.artworks) {
      const artworks = Array.isArray(payload.artworks) ? payload.artworks : [payload.artworks];
      data.artworks = {
        set: [],
        connectOrCreate: artworks.map((a) => ({
          where: { url_type_source: { url: a.url, source: a.source, type: a.type } },
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
      };
    }

    if (payload.chronologies) {
      const chronologies = Array.isArray(payload.chronologies) ? payload.chronologies : [payload.chronologies];
      data.chronology = {
        set: [],
        connectOrCreate: chronologies.map((c) => ({
          where: {
            parent_id_related_id_order: {
              parent_id: c.parentId,
              related_id: c.relatedId,
              order: c.order
            }
          },
          create: {
            parent_id: c.parentId,
            related_id: c.relatedId,
            order: c.order
          }
        }))
      };
    }

    if (payload.episodes) {
      const episodes = Array.isArray(payload.episodes) ? payload.episodes : [payload.episodes];
      data.episodes = {
        set: [],
        connectOrCreate: episodes.map((e) => ({
          where: { id: e.id },
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
      };
    }

    return data;
  }
}

const MetaPrisma = new MetaPrismaModule();

export { MetaPrisma, MetaPrismaModule };
