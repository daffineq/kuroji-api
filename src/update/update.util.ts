import { Prisma } from '@prisma/client'
import { UpdateType } from './UpdateType'

export function getUpdateData(
  entityId: string, 
  externalId?: number, 
  type: UpdateType = UpdateType.ANILIST
): Prisma.LastUpdatedCreateInput {
  return {
    entityId: entityId,
    externalId: externalId || undefined,
    type: type,
    // updatedAt: new Date(),
  }
}