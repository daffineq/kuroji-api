import { parseString } from 'src/helpers/parsers';
import { MetaPayload } from './meta.dto';
import { prisma, Prisma } from 'src/lib/prisma';
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

  async update(payload: MetaPayload) {
    const normalize = <T>(v?: T | T[]) => (v ? (Array.isArray(v) ? v : [v]) : []);

    await prisma.$transaction(async (tx) => {
      const data: Prisma.MetaUpdateInput = {};

      if (payload.franchise !== undefined) data.franchise = payload.franchise;
      if (payload.rating !== undefined) data.rating = payload.rating;
      if (payload.episodes_aired !== undefined) data.episodes_aired = payload.episodes_aired;
      if (payload.episodes_total !== undefined) data.episodes_total = payload.episodes_total;
      if (payload.moreinfo !== undefined) data.moreinfo = payload.moreinfo;
      if (payload.broadcast !== undefined) data.broadcast = payload.broadcast;
      if (payload.nsfw !== undefined) data.nsfw = payload.nsfw;

      const artworks = normalize(payload.artworks);
      const images = normalize(payload.images);
      const screenshots = normalize(payload.screenshots);
      const videos = normalize(payload.videos);

      for (const a of artworks) {
        await tx.artwork.upsert({
          where: { url_type_source: { url: a.url, source: a.source.toLowerCase(), type: a.type } },
          update: {
            url: a.url,
            height: a.height,
            image: a.image,
            iso_639_1: a.iso_639_1,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width,
            source: a.source.toLowerCase()
          },
          create: {
            url: a.url,
            height: a.height,
            image: a.image,
            iso_639_1: a.iso_639_1,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width,
            source: a.source.toLowerCase()
          }
        });
      }

      for (const i of images) {
        await tx.image.upsert({
          where: {
            url_type_source: {
              url: i.url,
              type: i.type,
              source: i.source.toLowerCase()
            }
          },
          update: {
            small: i.small,
            medium: i.medium,
            large: i.large
          },
          create: {
            url: i.url,
            small: i.small,
            medium: i.medium,
            large: i.large,
            type: i.type,
            source: i.source.toLowerCase()
          }
        });
      }

      for (const s of screenshots) {
        await tx.screenshot.upsert({
          where: {
            url_source: {
              url: s.url,
              source: s.source.toLowerCase()
            }
          },
          update: {
            small: s.small,
            medium: s.medium,
            large: s.large
          },
          create: {
            url: s.url,
            small: s.small,
            medium: s.medium,
            large: s.large,
            source: s.source.toLowerCase()
          }
        });
      }

      for (const v of videos) {
        await tx.video.upsert({
          where: {
            url_source: {
              url: v.url,
              source: v.source.toLowerCase()
            }
          },
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
            type: v.type,
            source: v.source.toLowerCase()
          }
        });
      }

      if (artworks.length) {
        data.artworks = {
          connect: artworks.map((a) => ({
            url_type_source: {
              url: a.url,
              type: a.type,
              source: a.source.toLowerCase()
            }
          }))
        };
      }

      if (images.length) {
        data.images = {
          connect: images.map((i) => ({
            url_type_source: {
              url: i.url,
              type: i.type,
              source: i.source.toLowerCase()
            }
          }))
        };
      }

      if (screenshots.length) {
        data.screenshots = {
          connect: screenshots.map((s) => ({
            url_source: {
              url: s.url,
              source: s.source.toLowerCase()
            }
          }))
        };
      }

      if (videos.length) {
        data.videos = {
          connect: videos.map((v) => ({
            url_source: {
              url: v.url,
              source: v.source.toLowerCase()
            }
          }))
        };
      }

      if (payload.mappings) {
        const mappings = normalize(payload.mappings);
        data.mappings = {
          connectOrCreate: mappings.map((m) => ({
            where: {
              source_id_source_name: {
                source_id: parseString(m.id)!,
                source_name: m.name.toLowerCase()
              }
            },
            create: {
              source_id: parseString(m.id)!,
              source_name: m.name.toLowerCase()
            }
          }))
        };
      }

      if (payload.titles) {
        const titles = normalize(payload.titles);
        data.titles = {
          connectOrCreate: titles.map((t) => ({
            where: {
              title_source_language: {
                title: t.title,
                source: t.source.toLowerCase(),
                language: t.language
              }
            },
            create: {
              title: t.title,
              source: t.source.toLowerCase(),
              language: t.language
            }
          }))
        };
      }

      if (payload.descriptions) {
        const descriptions = normalize(payload.descriptions);
        data.descriptions = {
          connectOrCreate: descriptions.map((d) => ({
            where: {
              description_source_language: {
                description: d.description,
                source: d.source.toLowerCase(),
                language: d.language
              }
            },
            create: {
              description: d.description,
              source: d.source.toLowerCase(),
              language: d.language
            }
          }))
        };
      }

      if (payload.chronologies) {
        const chronologies = normalize(payload.chronologies);
        data.chronology = {
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

      await tx.meta.update({
        where: { id: payload.id },
        data
      });
    });
  }

  async remove(payload: Partial<Record<Exclude<keyof MetaPayload, 'id'>, true>> & { id: number }) {
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

    await prisma.meta.update({
      where: { id: payload.id },
      data
    });
  }

  async forceUpdate(payload: MetaPayload) {
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
              source_name: m.name.toLowerCase()
            }
          },
          create: {
            source_id: parseString(m.id)!,
            source_name: m.name.toLowerCase()
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
              source: t.source.toLowerCase(),
              language: t.language
            }
          },
          create: {
            title: t.title,
            source: t.source.toLowerCase(),
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
              source: d.source.toLowerCase(),
              language: d.language
            }
          },
          create: {
            description: d.description,
            source: d.source.toLowerCase(),
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
              source: i.source.toLowerCase()
            }
          },
          create: {
            url: i.url,
            small: i.small,
            medium: i.medium,
            large: i.large,
            type: i.type,
            source: i.source.toLowerCase()
          }
        }))
      };
    }

    if (payload.videos) {
      const videos = Array.isArray(payload.videos) ? payload.videos : [payload.videos];
      data.videos = {
        set: [],
        connectOrCreate: videos.map((v) => ({
          where: { url_source: { url: v.url, source: v.source.toLowerCase() } },
          create: {
            url: v.url,
            title: v.title,
            thumbnail: v.thumbnail,
            artist: v.artist,
            type: v.type,
            source: v.source.toLowerCase()
          }
        }))
      };
    }

    if (payload.screenshots) {
      const screenshots = Array.isArray(payload.screenshots) ? payload.screenshots : [payload.screenshots];
      data.screenshots = {
        set: [],
        connectOrCreate: screenshots.map((s) => ({
          where: {
            url_source: {
              url: s.url,
              source: s.source.toLowerCase()
            }
          },
          create: {
            url: s.url,
            small: s.small,
            medium: s.medium,
            large: s.large,
            source: s.source.toLowerCase()
          }
        }))
      };
    }

    if (payload.artworks) {
      const artworks = Array.isArray(payload.artworks) ? payload.artworks : [payload.artworks];
      data.artworks = {
        set: [],
        connectOrCreate: artworks.map((a) => ({
          where: { url_type_source: { url: a.url, source: a.source.toLowerCase(), type: a.type } },
          create: {
            url: a.url,
            height: a.height,
            image: a.image,
            iso_639_1: a.iso_639_1,
            thumbnail: a.thumbnail,
            type: a.type,
            width: a.width,
            source: a.source.toLowerCase()
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

    await prisma.meta.update({
      where: { id: payload.id },
      data
    });
  }
}

const MetaPrisma = new MetaPrismaModule();

export { MetaPrisma, MetaPrismaModule };
