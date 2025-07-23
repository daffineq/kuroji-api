import { ISource, IVideo } from '@consumet/extensions';
import { Prisma } from '@prisma/client';

export interface BasicAnilibria {
  id: number;
  type: {
    value: string;
    description: string;
  };
  year: number;
  name: {
    main: string;
    english: string;
    alternative: string;
  };
  alias: string;
  season: {
    value: string;
    description: string;
  };
  poster: {
    preview: string;
    thumbnail: string;
    optimized: {
      preview: string;
      thumbnail: string;
    };
  };
  fresh_at: string; // ISO 8601 timestamp
  created_at: string;
  updated_at: string;
  is_ongoing: boolean;
  age_rating: {
    value: string;
    label: string;
    is_adult: boolean;
    description: string;
  };
  publish_day: {
    value: number;
    description: string;
  };
  description: string;
  notification: string;
  episodes_total: number;
  external_player: string;
  is_in_production: boolean;
  is_blocked_by_geo: boolean;
  is_blocked_by_copyrights: boolean;
  added_in_users_favorites: number;
  average_duration_of_episode: number;
  added_in_planned_collection: number;
  added_in_watched_collection: number;
  added_in_watching_collection: number;
  added_in_postponed_collection: number;
  added_in_abandoned_collection: number;
  genres: {
    id: number;
    name: string;
    image: {
      preview: string;
      thumbnail: string;
      optimized: {
        preview: string;
        thumbnail: string;
      };
    };
    total_releases: number;
  }[];
}

export interface AnilibriaEntry {
  id: number;
  anilistId: number;
  type?: LabeledValue;
  year?: number;
  name?: {
    main?: string;
    english?: string;
    alternative?: string;
  };
  alias?: string;
  season?: LabeledValue;
  poster?: {
    preview?: string;
    thumbnail?: string;
    optimized?: OptimizedImage;
  };
  fresh_at?: string;
  created_at?: string;
  updated_at?: string;
  is_ongoing?: boolean;
  age_rating?: AgeRating;
  publish_day?: LabeledNumber;
  description?: string;
  notification?: string;
  episodes_total?: number;
  external_player?: string;
  is_in_production?: boolean;
  is_blocked_by_geo?: boolean;
  is_blocked_by_copyrights?: boolean;
  added_in_users_favorites?: number;
  average_duration_of_episode?: number;
  added_in_planned_collection?: number;
  added_in_watched_collection?: number;
  added_in_watching_collection?: number;
  added_in_postponed_collection?: number;
  added_in_abandoned_collection?: number;
  genres?: Genre[];
  members?: Member[];
  episodes?: Episode[];
  torrents?: Torrent[];
  sponsor?: Sponsor;
}

// --- Nested Types ---

export interface LabeledValue {
  value: string;
  description: string;
}

export interface LabeledNumber {
  value: number;
  description: string;
}

export interface OptimizedImage {
  preview?: string;
  thumbnail?: string;
}

export interface AgeRating {
  value: string;
  label?: string;
  is_adult?: boolean;
  description?: string;
}

export interface Genre {
  id: number;
  name: string;
  image?: {
    preview?: string;
    thumbnail?: string;
    optimized?: OptimizedImage;
  };
  total_releases?: number;
}

export interface Member {
  id: string;
  role?: LabeledValue;
  user?: {
    id: number;
    avatar?: {
      preview?: string;
      thumbnail?: string;
      optimized?: OptimizedImage;
    };
  };
  nickname?: string;
}

export interface Episode {
  id: string;
  name?: string;
  name_english?: string;
  ordinal?: number;
  duration?: number;
  rutube_id?: string;
  youtube_id?: string;
  updated_at?: string;
  sort_order?: number;
  release_id?: number;
  hls_480?: string;
  hls_720?: string;
  hls_1080?: string;
  ending?: StartStop;
  opening?: StartStop;
  preview?: {
    preview?: string;
    thumbnail?: string;
    optimized?: OptimizedImage;
  };
}

export interface StartStop {
  start: number;
  stop: number;
}

export interface Torrent {
  id: number;
  hash: string;
  size?: number;
  type?: LabeledValue;
  color?: LabeledValue;
  codec?: Codec;
  label?: string;
  quality?: LabeledValue;
  magnet?: string;
  filename?: string;
  seeders?: number;
  bitrate?: number;
  leechers?: number;
  sort_order?: number;
  updated_at?: string;
  is_hardsub?: boolean;
  description?: string;
  created_at?: string;
  completed_times?: number;
}

export interface Codec {
  value: string;
  label?: string;
  description?: string;
  label_color?: string;
  label_is_visible?: boolean;
}

export interface Sponsor {
  id: string;
  title?: string;
  description?: string;
  url_title?: string;
  url?: string;
}

export function getIntro(episode: EpisodePayload) {
  return {
    start: episode.opening?.start ?? 0,
    end: episode.opening?.stop ?? 0,
  };
}

export function getOutro(episode: EpisodePayload) {
  return {
    start: episode.ending?.start ?? 0,
    end: episode.ending?.stop ?? 0,
  };
}

export function convertToSource(episode: EpisodePayload): ISource {
  const sources: IVideo[] = [];

  if (episode.hls_480) {
    sources.push({ url: episode.hls_480, quality: '480p', isM3U8: true });
  }
  if (episode.hls_720) {
    sources.push({ url: episode.hls_720, quality: '720p', isM3U8: true });
  }
  if (episode.hls_1080) {
    sources.push({
      url: episode.hls_1080,
      quality: '1080p',
      isM3U8: true,
    });
  }

  return {
    intro: getIntro(episode),
    outro: getOutro(episode),
    sources,
  };
}

export const episodesSelect = {
  id: true,
  name: true,
  name_english: true,
  ordinal: true,
  duration: true,
  rutube_id: true,
  youtube_id: true,
  updated_at: true,
  sort_order: true,
  release_id: true,
  hls_480: true,
  hls_720: true,
  hls_1080: true,
  opening: {
    select: {
      start: true,
      stop: true,
    },
  },
  ending: {
    select: {
      start: true,
      stop: true,
    },
  },
  preview: {
    select: {
      preview: true,
      thumbnail: true,
      optimized_preview: true,
      optimized_thumbnail: true,
    },
  },
} satisfies Prisma.AnilibriaEpisodeSelect;

export const anilibriaSelect = {
  id: true,
  anilist_id: true,
  year: true,
  alias: true,
  fresh_at: true,
  created_at: true,
  updated_at: true,
  is_ongoing: true,
  publish_day: {
    select: {
      value: true,
      description: true,
    },
  },
  description: true,
  notification: true,
  episodes_total: true,
  external_player: true,
  is_in_production: true,
  is_blocked_by_copyrights: true,
  added_in_users_favorites: true,
  average_duration_of_episode: true,
  added_in_planned_collection: true,
  added_in_watched_collection: true,
  added_in_watching_collection: true,
  added_in_postponed_collection: true,
  added_in_abandoned_collection: true,

  type: {
    select: {
      value: true,
      description: true,
    },
  },
  name: {
    select: {
      main: true,
      english: true,
      alternative: true,
    },
  },
  season: {
    select: {
      value: true,
      description: true,
    },
  },
  poster: {
    select: {
      preview: true,
      thumbnail: true,
      optimized_preview: true,
      optimized_thumbnail: true,
    },
  },
  age_rating: {
    select: {
      value: true,
      label: true,
      is_adult: true,
      description: true,
    },
  },
  sponsor: {
    select: {
      id: true,
      title: true,
      description: true,
      url_title: true,
      url: true,
    },
  },

  genres: {
    select: {
      total_releases: true,
      genre: {
        select: {
          id: true,
          name: true,
          preview: true,
          thumbnail: true,
          optimized_preview: true,
          optimized_thumbnail: true,
        },
      },
    },
  },
  episodes: {
    select: episodesSelect,
  },
  torrents: {
    select: {
      id: true,
      hash: true,
      size: true,
      label: true,
      magnet: true,
      filename: true,
      seeders: true,
      bitrate: true,
      leechers: true,
      sort_order: true,
      updated_at: true,
      is_hardsub: true,
      description: true,
      created_at: true,
      completed_times: true,
      type: {
        select: {
          id: true,
          value: true,
          description: true,
        },
      },
      color: {
        select: {
          id: true,
          value: true,
          description: true,
        },
      },
      codec: {
        select: {
          id: true,
          value: true,
          label: true,
          description: true,
          label_color: true,
          label_is_visible: true,
        },
      },
      quality: {
        select: {
          id: true,
          value: true,
          description: true,
        },
      },
    },
  },
} satisfies Prisma.AnilibriaSelect;

export type AnilibriaPayload = Prisma.AnilibriaGetPayload<{
  select: typeof anilibriaSelect;
}>;

export type EpisodePayload = Prisma.AnilibriaEpisodeGetPayload<{
  select: typeof episodesSelect;
}>;
