import { Prisma, TmdbSeasonEpisode } from '@prisma/client';
import { MappingEntry } from '../types';

export const getMappingsPrismaData = (id: number, data: Array<MappingEntry>): Prisma.MappingsCreateInput => {
  return {
    mappings: {
      connectOrCreate: data.map((m) => ({
        where: {
          sourceId_sourceName: {
            sourceId: m.id,
            sourceName: m.name
          }
        },
        create: {
          sourceId: m.id,
          sourceName: m.name
        }
      }))
    },
    anilist: {
      connect: {
        id: id
      }
    }
  };
};

export const addMappingsPrismaData = (data: MappingEntry): Prisma.MappingsUpdateInput => {
  return {
    mappings: {
      connectOrCreate: {
        where: {
          sourceId_sourceName: {
            sourceId: data.id,
            sourceName: data.name
          }
        },
        create: {
          sourceId: data.id,
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
            sourceId: old.id,
            sourceName: old.name
          }
        },
        data: {
          sourceId: updated.id,
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
          sourceId: data.id,
          sourceName: data.name
        }
      }
    }
  };
};

export const addOrUpdateEpisodes = (episodes: Array<TmdbSeasonEpisode>): Prisma.MappingsUpdateInput => {
  return {
    episodes: {
      upsert: episodes.map((e) => ({
        where: { id: e.id },
        update: {
          number: e.episode_number,
          title: e.name,
          overview: e.overview,
          image: e.still_path,
          runtime: e.runtime,
          date: e.air_date
        },
        create: {
          id: e.id,
          number: e.episode_number,
          title: e.name,
          overview: e.overview,
          image: e.still_path,
          runtime: e.runtime,
          date: e.air_date
        }
      }))
    }
  };
};
