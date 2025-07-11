import {
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  IsInt,
  Min,
  Max,
  IsBoolean,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import Config from '../../../../configs/config.js';
import {
  TransformToArray,
  TransformToBoolean,
} from '../../../../utils/utils.js';
import { MediaSort } from '../../anilist/filter/Filter.js';

// Sort enum - keeping it simple and clean 🔥
export enum AnizipSort {
  ID = 'id',
  ID_DESC = 'id_desc',
  EPISODE_COUNT = 'episode_count',
  EPISODE_COUNT_DESC = 'episode_count_desc',
  SPECIAL_COUNT = 'special_count',
  SPECIAL_COUNT_DESC = 'special_count_desc',
}

export class AnizipDto {
  @IsOptional()
  @IsNumber()
  @Max(Config.DEFAULT_MAX_PER_PAGE)
  @Min(Config.DEFAULT_MIN_PER_PAGE)
  @Type(() => Number)
  perPage: number = Config.DEFAULT_PER_PAGE;

  @IsOptional()
  @IsNumber()
  @Min(Config.DEFAULT_MIN_PAGE)
  @Type(() => Number)
  page: number = Config.DEFAULT_PAGE;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  anilistId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  malId?: number;

  @IsOptional()
  @IsString()
  kitsuId?: string;

  @IsOptional()
  @IsString()
  animePlanetId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  anidbId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  anisearchId?: number;

  @IsOptional()
  @IsString()
  notifymoeId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  livechartId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  thetvdbId?: number;

  @IsOptional()
  @IsString()
  imdbId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  themoviedbId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minEpisodes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxEpisodes?: number;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(AnizipSort, { each: true })
  sort?: AnizipSort[] = [AnizipSort.ID];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  titleKeys?: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @TransformToBoolean()
  hasImages?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @TransformToBoolean()
  hasEpisodes?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @TransformToBoolean()
  hasMappings?: boolean;
}

export class UpdateAniZipMappingsDto {
  @IsOptional()
  @IsString()
  animePlanetId?: string | null;

  @IsOptional()
  @IsString()
  kitsuId?: string | null;

  @IsOptional()
  @IsInt()
  malId?: number | null;

  @IsOptional()
  @IsString()
  type?: string | null;

  @IsOptional()
  @IsInt()
  anilistId?: number | null;

  @IsOptional()
  @IsInt()
  anisearchId?: number | null;

  @IsOptional()
  @IsInt()
  anidbId?: number | null;

  @IsOptional()
  @IsString()
  notifymoeId?: string | null;

  @IsOptional()
  @IsInt()
  livechartId?: number | null;

  @IsOptional()
  @IsInt()
  thetvdbId?: number | null;

  @IsOptional()
  @IsString()
  imdbId?: string | null;

  @IsOptional()
  @IsInt()
  themoviedbId?: number | null;
}
