import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsString,
  IsArray,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  MediaType,
  MediaSource,
  Language,
  AgeRating,
  MediaCountry,
} from './Filter.js';
import Config from '../../../../configs/config.js';
import {
  TransformToArray,
  TransformToNumberArray,
  TransformToBoolean,
} from '../../../../utils/utils.js';

export class FilterDto {
  constructor(partial?: Partial<FilterDto>) {
    Object.assign(this, partial);
  }

  // Pagination
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Max(Config.DEFAULT_MAX_PER_PAGE)
  @Min(Config.DEFAULT_MIN_PER_PAGE)
  @Type(() => Number)
  perPage: number = Config.DEFAULT_PER_PAGE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(Config.DEFAULT_MIN_PAGE)
  @Type(() => Number)
  page: number = Config.DEFAULT_PAGE;

  // Sorting
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaSort, { each: true })
  sort?: MediaSort[] = [MediaSort.SCORE_DESC];

  // IDs
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idIn?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idNotIn?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idNot?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idMal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idMalIn?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToNumberArray()
  idMalNotIn?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idMalNot?: number;

  // Format / Country / Type / Status
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaFormat)
  @Type(() => String)
  format?: MediaFormat;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaFormat, { each: true })
  @Type(() => String)
  formatIn?: MediaFormat[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaFormat)
  @Type(() => String)
  formatNot?: MediaFormat;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaFormat, { each: true })
  @Type(() => String)
  formatNotIn?: MediaFormat[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaCountry)
  @Type(() => String)
  country?: MediaCountry;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaCountry, { each: true })
  @Type(() => String)
  countryIn?: MediaCountry[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaCountry)
  @Type(() => String)
  countryNot?: MediaCountry;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaCountry, { each: true })
  @Type(() => String)
  countryNotIn?: MediaCountry[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaType)
  @Type(() => String)
  type?: MediaType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaStatus)
  @Type(() => String)
  status?: MediaStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaStatus, { each: true })
  @Type(() => String)
  statusIn?: MediaStatus[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaStatus)
  @Type(() => String)
  statusNot?: MediaStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaStatus, { each: true })
  @Type(() => String)
  statusNotIn?: MediaStatus[];

  // Season / Language / Source / Age
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MediaSeason)
  @Type(() => String)
  season?: MediaSeason;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  @Type(() => String)
  language?: Language;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaSource, { each: true })
  @Type(() => String)
  sourceIn?: MediaSource[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(AgeRating, { each: true })
  @Type(() => String)
  ageRating?: AgeRating[];

  // Boolean flags
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isAdult?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  nsfw?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isLicensed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  franchise?: string;

  // Tags & genres
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagNotIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagCategoryIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagCategoryNotIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  genreIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  genreNotIn?: string[];

  // People/Studios
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  studioIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  characterIn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  voiceActorIn?: string[];

  // Popularity / Score
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityGreater?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityLesser?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityNot?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreGreater?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreLesser?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreNot?: number;

  // Duration / Episodes
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationGreater?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationLesser?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episodesGreater?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episodesLesser?: number;

  // Airing dates
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  airingAtGreater?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  airingAtLesser?: number;

  // Start / End Dates
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDateGreater?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDateLesser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDateLike?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDateGreater?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDateLesser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDateLike?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seasonYearGreater?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seasonYearLesser?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seasonYear?: number;

  // Misc
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;
}
