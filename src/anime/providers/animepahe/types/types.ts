import {
  Animepahe,
  AnimepaheExternalLink,
  AnimepaheEpisode,
} from '@prisma/client';

export interface AnimepaheWithRelations extends Animepahe {
  externalLinks: AnimepaheExternalLink[];
  episodes: AnimepaheEpisode[];
}
