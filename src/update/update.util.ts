import { Prisma } from '@prisma/client'
import { UpdateType } from '../shared/UpdateType'

export function getUpdateData(
  entityId: string, 
  externalId?: number, 
  type: UpdateType = UpdateType.ANILIST
): Prisma.LastUpdatedCreateInput {
  return {
    entityId: entityId,
    externalId: externalId || undefined,
    type: type,
    // updatedAt: Math.floor(Date.now() / 1000),
  }
}