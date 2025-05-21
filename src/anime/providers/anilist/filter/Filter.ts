export enum MediaType {
  ANIME = 'ANIME',
  MANGA = 'MANGA',
}

export enum MediaFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
  MANGA = 'MANGA',
  NOVEL = 'NOVEL',
  ONE_SHOT = 'ONE_SHOT',
}

export enum MediaStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
  HIATUS = 'HIATUS',
}

export enum MediaSeason {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}

export enum MediaSource {
  ORIGINAL = 'ORIGINAL',
  MANGA = 'MANGA',
  LIGHT_NOVEL = 'LIGHT_NOVEL',
  VISUAL_NOVEL = 'VISUAL_NOVEL',
  VIDEO_GAME = 'VIDEO_GAME',
  OTHER = 'OTHER',
  NOVEL = 'NOVEL',
  DOUJINSHI = 'DOUJINSHI',
  ANIME = 'ANIME',
}

export enum MediaSort {
  ID = 'id',
  ID_DESC = 'id_desc',
  TITLE_ROMAJI = 'title_romaji',
  TITLE_ROMAJI_DESC = 'title_romaji_desc',
  TITLE_ENGLISH = 'title_english',
  TITLE_ENGLISH_DESC = 'title_english_desc',
  TITLE_NATIVE = 'title_native',
  TITLE_NATIVE_DESC = 'title_native_desc',
  TYPE = 'type',
  TYPE_DESC = 'type_desc',
  FORMAT = 'format',
  FORMAT_DESC = 'format_desc',
  START_DATE = 'start_date',
  START_DATE_DESC = 'start_date_desc',
  END_DATE = 'end_date',
  END_DATE_DESC = 'end_date_desc',
  SCORE = 'score',
  SCORE_DESC = 'score_desc',
  POPULARITY = 'popularity',
  POPULARITY_DESC = 'popularity_desc',
  TRENDING = 'trending',
  TRENDING_DESC = 'trending_desc',
  EPISODES = 'episodes',
  EPISODES_DESC = 'episodes_desc',
  DURATION = 'duration',
  DURATION_DESC = 'duration_desc',
  STATUS = 'status',
  STATUS_DESC = 'status_desc',
  UPDATED_AT = 'updated_at',
  UPDATED_AT_DESC = 'updated_at_desc',
}

export enum Language {
  SUB = 'sub',
  DUB = 'dub',
  BOTH = 'both',
  RAW = 'raw',
}

export enum AgeRating {
  G = 'G',
  PG = 'PG',
  R = 'R',
  R18 = 'R18',
}