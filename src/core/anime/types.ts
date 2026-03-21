import { ForceOr } from 'src/helpers/forced';

export interface AnimePosterPayload {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
}

export interface AnimeTitlePayload {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
}

export interface AnimeFuzzyDatePayload {
  day?: number | null;
  month?: number | null;
  year?: number | null;
}

export interface AnimeGenrePayload {
  name?: string | null;
}

export interface AnimeAiringSchedulePayload {
  id: number;
  episode?: number | null;
  airing_at?: number | null;
}

export interface AnimeCharacterNamePayload {
  full?: string | null;
  native?: string | null;
  alternative?: string[] | null;
}

export interface AnimeCharacterImagePayload {
  large?: string | null;
  medium?: string | null;
}

export interface AnimeVoiceNamePayload {
  full?: string | null;
  native?: string | null;
  alternative?: string[] | null;
}

export interface AnimeVoiceImagePayload {
  large?: string | null;
  medium?: string | null;
}

export interface AnimeVoiceActorPayload {
  id: number;
  language?: string | null;
  name?: AnimeVoiceNamePayload | null;
  image?: AnimeVoiceImagePayload | null;
}

export interface AnimeCharacterConnectionPayload {
  id: number;
  role?: string | null;
  character?: AnimeCharacterPayload | null;
  voice_actors?: AnimeVoiceActorPayload[] | null;
}

export interface AnimeCharacterPayload {
  id: number;
  name?: AnimeCharacterNamePayload | null;
  image?: AnimeCharacterImagePayload | null;
}

export interface AnimeStudioPayload {
  id: number;
  name?: string | null;
}

export interface AnimeStudioConnectionPayload {
  id: number;
  is_main?: boolean | null;
  studio?: AnimeStudioPayload | null;
}

export interface AnimeTagPayload {
  id: number;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  is_adult?: boolean | null;
}

export interface AnimeTagConnectionPayload {
  rank?: number | null;
  is_spoiler?: boolean | null;
  tag?: AnimeTagPayload | null;
}

export interface AnimeScoreDistributionPayload {
  score: number;
  amount: number;
}

export interface AnimeStatusDistributionPayload {
  status: string;
  amount: number;
}

export interface AnimeLinkPayload {
  link: string;
  label: string;
  type: 'mapping' | 'website';
}

export interface AnimeOtherTitlePayload {
  title: string;
  source: string;
  language: string;
}

export interface AnimeOtherDescriptionPayload {
  description: string;
  source: string;
  language: string;
}

export interface AnimeImagePayload {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  type: string;
  source: string;
}

export interface AnimeVideoPayload {
  url: string;
  title?: string | null;
  thumbnail?: string | null;
  artist?: string | null;
  type?: string | null;
  source: string;
}

export interface AnimeScreenshotPayload {
  url: string;
  order: number;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  source: string;
}

export interface AnimeArtworkPayload {
  url: string;
  height?: number | null;
  width?: number | null;
  large?: string | null;
  medium?: string | null;
  iso_639_1?: string | null;
  type: string;
  source: string;
}

export interface AnimeChronologyPayload {
  parent_id: number;
  related_id: number;
  order: number;
}

export interface AnimeRecommendationPayload {
  parent_id: number;
  related_id: number;
  order: number;
}

export interface AnimeEpisodeImagePayload {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
}

export interface AnimeEpisodePayload {
  title?: string | null;
  number: number;
  air_date?: string | null;
  runtime?: number | null;
  overview?: string | null;
  image?: AnimeEpisodeImagePayload | null;
}

export interface AnimePayload {
  id: number;
  id_mal?: number | null;
  background?: string | null;
  description?: string | null;
  status?: string | null;
  type?: string | null;
  format?: string | null;
  season?: string | null;
  season_year?: number | null;
  duration?: number | null;
  country?: string | null;
  is_licensed?: boolean | null;
  source?: string | null;
  hashtag?: string | null;
  is_adult?: boolean | null;
  score?: number | null;
  popularity?: number | null;
  trending?: number | null;
  favorites?: number | null;
  color?: string | null;
  franchise?: string | null;
  age_rating?: string | null;
  episodes_aired?: number | null;
  episodes_total?: number | null;
  moreinfo?: string | null;
  broadcast?: string | null;
  nsfw?: boolean | null;
  latest_airing_episode?: number | null;
  next_airing_episode?: number | null;
  last_airing_episode?: number | null;

  title?: AnimeTitlePayload | null;
  poster?: AnimePosterPayload | null;
  start_date?: AnimeFuzzyDatePayload | null;
  end_date?: AnimeFuzzyDatePayload | null;

  genres?: ForceOr<AnimeGenrePayload> | null;
  airing_schedule?: ForceOr<AnimeAiringSchedulePayload> | null;
  characters?: ForceOr<AnimeCharacterConnectionPayload> | null;
  studios?: ForceOr<AnimeStudioConnectionPayload> | null;
  tags?: ForceOr<AnimeTagConnectionPayload> | null;
  score_distribution?: ForceOr<AnimeScoreDistributionPayload> | null;
  status_distribution?: ForceOr<AnimeStatusDistributionPayload> | null;
  links?: ForceOr<AnimeLinkPayload> | null;
  chronology?: ForceOr<AnimeChronologyPayload> | null;
  recommendations?: ForceOr<AnimeRecommendationPayload> | null;
  other_titles?: ForceOr<AnimeOtherTitlePayload> | null;
  other_descriptions?: ForceOr<AnimeOtherDescriptionPayload> | null;
  images?: ForceOr<AnimeImagePayload> | null;
  videos?: ForceOr<AnimeVideoPayload> | null;
  screenshots?: ForceOr<AnimeScreenshotPayload> | null;
  artworks?: ForceOr<AnimeArtworkPayload> | null;

  episodes?: ForceOr<AnimeEpisodePayload> | null;

  auto_update?: boolean | null;
  disabled?: boolean | null;
}
