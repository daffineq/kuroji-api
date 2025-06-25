import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TransformToNumberArray,
  TransformToArray,
  TransformToBoolean,
} from '../../../../utils/utils';
import { TagSort } from './Filter';
import Config from '../../../../configs/config';

export class TagFilterDto {
  constructor(partial?: Partial<TagFilterDto>) {
    Object.assign(this, partial);
  }

  // Pagination
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

  // --- Sorting ---
  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(TagSort, { each: true })
  sort?: TagSort[] = [TagSort.RANK_DESC];

  // ID filters
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

  // Name filters
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameLike?: string;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  nameIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  nameNotIn?: string[];

  // Description filters
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionLike?: string;

  // Category filters
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @TransformToArray()
  categoryIn?: string[];

  @IsOptional()
  @IsArray()
  @TransformToArray()
  categoryNotIn?: string[];

  // Rank filters
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rank?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rankGreater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rankLesser?: number;

  // Boolean flags
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isSpoiler?: boolean;

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isAdult?: boolean;

  @IsOptional()
  @IsString()
  query?: string;
}
