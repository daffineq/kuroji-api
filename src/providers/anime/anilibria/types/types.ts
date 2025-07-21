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
