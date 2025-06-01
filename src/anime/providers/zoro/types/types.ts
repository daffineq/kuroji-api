import { Zoro, EpisodeZoro } from '@prisma/client'

export interface ZoroWithRelations extends Zoro {
  episodes: EpisodeZoro[]
}