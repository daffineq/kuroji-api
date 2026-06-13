import { ForceOr } from 'src/helpers/forced';

export interface MediaStatsPatchPayload {
  type: string;
  action?: string | undefined;
  tag?: string | undefined;
}

export interface MediaPosterPayload {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
}

export interface MediaTitlePayload {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
}

export interface MediaFuzzyDatePayload {
  day?: number | null;
  month?: number | null;
  year?: number | null;
}

export interface MediaGenrePayload {
  name?: string | null;
}

export interface MediaAiringSchedulePayload {
  id: number;
  episode?: number | null;
  airing_at?: number | null;
}

export interface MediaCharacterNamePayload {
  first?: string | null;
  middle?: string | null;
  last?: string | null;
  full?: string | null;
  native?: string | null;
  alternative?: string[] | null;
  alternative_spoiler?: string[] | null;
}

export interface MediaCharacterImagePayload {
  large?: string | null;
  medium?: string | null;
}

export interface MediaVoiceNamePayload {
  first?: string | null;
  middle?: string | null;
  last?: string | null;
  full?: string | null;
  native?: string | null;
  alternative?: string[] | null;
}

export interface MediaVoiceImagePayload {
  large?: string | null;
  medium?: string | null;
}

export interface MediaVoiceActorPayload {
  id: number;
  language?: string | null;
  age?: number | null;
  blood_type?: string | null;
  gender?: string | null;
  description?: string | null;
  home_town?: string | null;
  name?: MediaVoiceNamePayload | null;
  image?: MediaVoiceImagePayload | null;
  birth_date?: MediaFuzzyDatePayload | null;
  death_date?: MediaFuzzyDatePayload | null;
}

export interface MediaCharacterConnectionPayload {
  id: number;
  role?: string | null;
  role_i?: number | null;
  character?: MediaCharacterPayload | null;
  voice_actors?: MediaVoiceActorPayload[] | null;
}

export interface MediaCharacterPayload {
  id: number;
  age?: string | null;
  blood_type?: string | null;
  gender?: string | null;
  description?: string | null;
  name?: MediaCharacterNamePayload | null;
  image?: MediaCharacterImagePayload | null;
  birth_date?: MediaFuzzyDatePayload | null;
}

export interface MediaStudioPayload {
  id: number;
  name?: string | null;
}

export interface MediaStudioConnectionPayload {
  id: number;
  is_main?: boolean | null;
  studio?: MediaStudioPayload | null;
}

export interface MediaTagPayload {
  id: number;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  is_adult?: boolean | null;
}

export interface MediaTagConnectionPayload {
  rank?: number | null;
  is_spoiler?: boolean | null;
  tag?: MediaTagPayload | null;
}

export interface MediaScoreDistributionPayload {
  score: number;
  amount: number;
}

export interface MediaStatusDistributionPayload {
  status: string;
  amount: number;
}

export interface MediaLinkPayload {
  link: string;
  label: string;
  type: 'mapping' | 'website';
}

export interface MediaAltTitlePayload {
  title: string;
  source: string;
  language: string;
}

export interface MediaAltDescriptionPayload {
  description: string;
  source: string;
  language: string;
}

export interface MediaImagePayload {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  type: string;
  source: string;
}

export interface MediaVideoPayload {
  url: string;
  title?: string | null;
  thumbnail?: string | null;
  artist?: string | null;
  type?: string | null;
  source: string;
}

export interface MediaScreenshotPayload {
  url: string;
  order: number;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  source: string;
}

export interface MediaArtworkPayload {
  url: string;
  height?: number | null;
  width?: number | null;
  large?: string | null;
  medium?: string | null;
  iso_639_1?: string | null;
  is_adult?: boolean | false;
  type: string;
  source: string;
}

export interface MediaTranslationPayload {
  iso_639_1?: string | null;
  title?: string | null;
  description?: string | null;
  tagline?: string | null;
  source: string;
}

export interface MediaChronologyPayload {
  parent_id: number;
  related_id: number;
  order: number;
}

export interface MediaRecommendationPayload {
  parent_id: number;
  related_id: number;
  order: number;
}

export interface MediaRelationPayload {
  parent_id: number;
  related_id: number;
  relation_type: string;
}

export interface MediaEpisodeImagePayload {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
}

export interface MediaEpisodePayload {
  title?: string | null;
  number: number;
  air_date?: string | null;
  runtime?: number | null;
  overview?: string | null;
  image?: MediaEpisodeImagePayload | null;
}

export interface MediaBroadcastPayload {
  week?: number | null;
  time?: string | null;
  timezone?: string | null;
}

export interface MediaAgeRatingPayload {
  rating?: string | null;
  description?: string | null;
}

export interface MediaPayload {
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
  episodes_aired?: number | null;
  episodes_total?: number | null;
  volumes?: number | null;
  chapters?: number | null;
  more_info?: string | null;
  latest_airing_episode?: number | null;
  next_airing_episode?: number | null;
  last_airing_episode?: number | null;

  title?: MediaTitlePayload | null;
  poster?: MediaPosterPayload | null;
  start_date?: MediaFuzzyDatePayload | null;
  end_date?: MediaFuzzyDatePayload | null;
  broadcast?: MediaBroadcastPayload | null;
  age_rating?: MediaAgeRatingPayload | null;

  genres?: ForceOr<MediaGenrePayload> | null;
  airing_schedule?: ForceOr<MediaAiringSchedulePayload> | null;
  characters?: ForceOr<MediaCharacterConnectionPayload> | null;
  studios?: ForceOr<MediaStudioConnectionPayload> | null;
  tags?: ForceOr<MediaTagConnectionPayload> | null;
  score_distribution?: ForceOr<MediaScoreDistributionPayload> | null;
  status_distribution?: ForceOr<MediaStatusDistributionPayload> | null;
  links?: ForceOr<MediaLinkPayload> | null;
  chronology?: ForceOr<MediaChronologyPayload> | null;
  recommendations?: ForceOr<MediaRecommendationPayload> | null;
  related?: ForceOr<MediaRelationPayload> | null;
  alt_titles?: ForceOr<MediaAltTitlePayload> | null;
  alt_descriptions?: ForceOr<MediaAltDescriptionPayload> | null;
  images?: ForceOr<MediaImagePayload> | null;
  videos?: ForceOr<MediaVideoPayload> | null;
  screenshots?: ForceOr<MediaScreenshotPayload> | null;
  artworks?: ForceOr<MediaArtworkPayload> | null;
  translations?: ForceOr<MediaTranslationPayload> | null;

  episodes?: ForceOr<MediaEpisodePayload> | null;

  auto_update?: boolean | null;
  disabled?: boolean | null;
}
