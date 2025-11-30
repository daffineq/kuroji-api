import { IsOptional, IsNumber, IsBoolean, IsEnum, IsString, IsArray, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import env from 'src/config/env';
import { TransformToArray, TransformToNumberArray, TransformToBoolean } from 'src/helpers/transformers';
import {
  MediaSort,
  MediaFormat,
  MediaCountry,
  MediaType,
  MediaStatus,
  MediaSeason,
  MediaSource,
  AgeRating
} from '../providers/anilist/types';

export class FilterDto {
  constructor(partial?: Partial<FilterDto>) {
    Object.assign(this, partial);
  }

  // Pagination
  @IsOptional()
  @IsNumber()
  @Max(env.DEFAULT_MAX_PER_PAGE)
  @Min(env.DEFAULT_MIN_PER_PAGE)
  @Type(() => Number)
  perPage: number = env.DEFAULT_PER_PAGE;

  @IsOptional()
  @IsNumber()
  @Min(env.DEFAULT_MIN_PAGE)
  @Type(() => Number)
  page: number = env.DEFAULT_PAGE;

  // Sorting
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaSort, { each: true })
  sort?: MediaSort[] = [MediaSort.SCORE_DESC];

  // IDs
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idIn?: number[];

  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idNotIn?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idNot?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idMal?: number;

  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idMalIn?: number[];

  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idMalNotIn?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idMalNot?: number;

  // Format / Country / Type / Status
  @IsOptional()
  @IsEnum(MediaFormat)
  @Type(() => String)
  format?: MediaFormat;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaFormat, { each: true })
  @Type(() => String)
  formatIn?: MediaFormat[];

  @IsOptional()
  @IsEnum(MediaFormat)
  @Type(() => String)
  formatNot?: MediaFormat;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaFormat, { each: true })
  @Type(() => String)
  formatNotIn?: MediaFormat[];

  @IsOptional()
  @IsEnum(MediaCountry)
  @Type(() => String)
  country?: MediaCountry;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaCountry, { each: true })
  @Type(() => String)
  countryIn?: MediaCountry[];

  @IsOptional()
  @IsEnum(MediaCountry)
  @Type(() => String)
  countryNot?: MediaCountry;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaCountry, { each: true })
  @Type(() => String)
  countryNotIn?: MediaCountry[];

  @IsOptional()
  @IsEnum(MediaType)
  @Type(() => String)
  type?: MediaType;

  @IsOptional()
  @IsEnum(MediaStatus)
  @Type(() => String)
  status?: MediaStatus;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaStatus, { each: true })
  @Type(() => String)
  statusIn?: MediaStatus[];

  @IsOptional()
  @IsEnum(MediaStatus)
  @Type(() => String)
  statusNot?: MediaStatus;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaStatus, { each: true })
  @Type(() => String)
  statusNotIn?: MediaStatus[];

  // Season / Source / Age
  @IsOptional()
  @IsEnum(MediaSeason)
  @Type(() => String)
  season?: MediaSeason;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaSource, { each: true })
  @Type(() => String)
  sourceIn?: MediaSource[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(AgeRating, { each: true })
  @Type(() => String)
  ageRating?: AgeRating[];

  // Boolean flags
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isAdult?: boolean;

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  nsfw?: boolean;

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isLicensed?: boolean;

  @IsOptional()
  @IsString()
  franchise?: string;

  // Tags & genres
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagNotIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagCategoryIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagCategoryNotIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  genreIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  genreNotIn?: string[];

  // People/Studios
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  studioIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  characterIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  voiceActorIn?: string[];

  // Popularity / Score
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityLesser?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityNot?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreLesser?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreNot?: number;

  // Duration / Episodes
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationLesser?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episodesGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episodesLesser?: number;

  // Airing dates
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  airingAtGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  airingAtLesser?: number;

  // Start / End Dates
  @IsOptional()
  @IsString()
  startDateGreater?: string;

  @IsOptional()
  @IsString()
  startDateLesser?: string;

  @IsOptional()
  @IsString()
  startDateLike?: string;

  @IsOptional()
  @IsString()
  endDateGreater?: string;

  @IsOptional()
  @IsString()
  endDateLesser?: string;

  @IsOptional()
  @IsString()
  endDateLike?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seasonYearGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seasonYearLesser?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seasonYear?: number;

  // Misc
  @IsOptional()
  @IsString()
  query?: string;
}
