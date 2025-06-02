import { AnimeKai, AnimekaiEpisode } from '@prisma/client';

export interface AnimekaiWithRelations extends AnimeKai {
  episodes: AnimekaiEpisode[];
}
