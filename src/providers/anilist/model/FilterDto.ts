import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsString,
  IsArray,
} from 'class-validator'
import { Type, Transform } from 'class-transformer'
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  MediaType,
  MediaSource,
} from '../filter/Filter'

const TransformToArray = () =>
  Transform(({ value }) => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',')
    return [value]
  })

const TransformToBoolean = () =>
  Transform(({ value }) => value === 'true')

export class FilterDto {
  constructor(partial?: Partial<FilterDto>) {
    Object.assign(this, partial)
  }

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaSort, { each: true })
  sort?: MediaSort[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaSource, { each: true })
  @Type(() => String)
  sourceIn?: MediaSource[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityLesser?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityGreater?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  popularityNot?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreLesser?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreGreater?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scoreNot?: number

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagCategoryNotIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagCategoryIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagNotIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  studioIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  characterIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  voiceActorIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  genreNotIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  genreIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagsNotIn?: string[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => String)
  tagsIn?: string[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationLesser?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationGreater?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episodesLesser?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episodesGreater?: number

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaStatus, { each: true })
  @Type(() => String)
  statusNotIn?: MediaStatus[]

  @IsOptional()
  @IsEnum(MediaStatus)
  @Type(() => String)
  statusNot?: MediaStatus

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaStatus, { each: true })
  @Type(() => String)
  statusIn?: MediaStatus[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaFormat, { each: true })
  @Type(() => String)
  formatNotIn?: MediaFormat[]

  @IsOptional()
  @IsEnum(MediaFormat)
  @Type(() => String)
  formatNot?: MediaFormat

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @IsEnum(MediaFormat, { each: true })
  @Type(() => String)
  formatIn?: MediaFormat[]

  @IsOptional()
  @IsString()
  endDateLike?: string

  @IsOptional()
  @IsString()
  endDateLesser?: string

  @IsOptional()
  @IsString()
  endDateGreater?: string

  @IsOptional()
  @IsString()
  startDateLike?: string

  @IsOptional()
  @IsString()
  startDateLesser?: string

  @IsOptional()
  @IsString()
  startDateGreater?: string

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => Number)
  idMalNotIn?: number[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => Number)
  idMalIn?: number[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idMalNot?: number

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => Number)
  idNotIn?: number[]

  @IsOptional()
  @IsArray()
  @TransformToArray()
  @Type(() => Number)
  idIn?: number[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idNot?: number

  @IsOptional()
  @IsString()
  query?: string

  @IsOptional()
  @IsString()
  countryOfOrigin?: string

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isAdult?: boolean

  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isLicensed?: boolean

  @IsOptional()
  @IsEnum(MediaFormat)
  @Type(() => String)
  format?: MediaFormat

  @IsOptional()
  @IsEnum(MediaType)
  @Type(() => String)
  type?: MediaType

  @IsOptional()
  @IsEnum(MediaStatus)
  @Type(() => String)
  status?: MediaStatus

  @IsOptional()
  @IsEnum(MediaSeason)
  @Type(() => String)
  season?: MediaSeason

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idMal?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number
}