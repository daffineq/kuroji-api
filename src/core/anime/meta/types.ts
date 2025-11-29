import { Prisma } from '@prisma/client';

export interface AniZipMappings {
  animeplanet_id?: string;
  kitsu_id?: number;
  mal_id?: number;
  type?: string;
  anilist_id?: number;
  anisearch_id?: number;
  anidb_id?: number;
  notifymoe_id?: string;
  livechart_id?: number;
  thetvdb_id?: number;
  imdb_id?: string;
  themoviedb_id?: string;
}

export interface AniZipData {
  episodeCount: number;
  specialCount: number;
  mappings: AniZipMappings;
}

export const metaSelect = {
  include: {
    mappings: true
  }
} satisfies Prisma.MetaDefaultArgs;
