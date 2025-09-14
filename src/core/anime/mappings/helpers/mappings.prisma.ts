import { Prisma } from "@prisma/client";
import { MappingEntry } from "../types";

export const getMappingsPrismaData = (id: number, data: Array<MappingEntry>): Prisma.MappingsCreateInput {
  return {
    mappings: {
      connectOrCreate: data.map((m) => ({
        where: {
          mappingId_name: {
            mappingId: m.id,
            name: m.name
          }
        },
        create: {
          mappingId: m.id,
          name: m.name
        }
      }))
    },
    anilist: {
      connect: {
        id: id
      }
    }
  }
}

export const addMappingsPrismaData = (data: MappingEntry): Prisma.MappingsUpdateInput => {
  return {
    mappings: {
      connectOrCreate: {
        where: {
          mappingId_name: {
            mappingId: data.id,
            name: data.name
          }
        },
        create: {
          mappingId: data.id,
          name: data.name
        }
      }
    }
  }
}

export const removeMappingsPrismaData = (data: MappingEntry): Prisma.MappingsUpdateInput => {
  return {
    mappings: {
      disconnect: {
        mappingId_name: {
          mappingId: data.id,
          name: data.name
        }
      }
    }
  }
}
