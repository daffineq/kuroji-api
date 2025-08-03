import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FullMediaResponseDto } from './response-dto.js';
import { PageInfoDto } from '../../../../shared/responses-dto.js';
import { TmdbImageDto } from '../../stream/types/types-dto.js';

export class AnilistPageDto {
  @ApiProperty({ type: [FullMediaResponseDto] })
  @Type(() => FullMediaResponseDto)
  media: FullMediaResponseDto[];

  @ApiProperty({ type: PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;
}

export class AnilistResponseDto {
  @ApiProperty({ type: AnilistPageDto })
  @Type(() => AnilistPageDto)
  Page: AnilistPageDto;
}

export class FranchiseDto {
  @ApiPropertyOptional({ type: () => TmdbImageDto })
  cover?: TmdbImageDto | null;

  @ApiPropertyOptional({ type: () => TmdbImageDto })
  banner?: TmdbImageDto | null;

  @ApiPropertyOptional()
  title?: string | null;

  @ApiPropertyOptional()
  franchise?: string | null;

  @ApiPropertyOptional()
  description?: string | null;
}

export class FranchiseResponseDto<T> {
  @ApiProperty({ type: PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;

  @ApiProperty({ type: FranchiseDto, nullable: true })
  @Type(() => FranchiseDto)
  franchise: FranchiseDto | null;

  @ApiProperty()
  data: T;
}

export class SearchResponseDto<T> {
  @ApiPropertyOptional()
  franchise: any;

  @ApiProperty()
  data: T;

  @ApiProperty({ type: PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;
}

export enum Weekday {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

export class ScheduleDataDto {
  @ApiProperty()
  current: boolean;

  @ApiProperty({ type: [Object] })
  data: any[];
}

export class ScheduleDto {
  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  monday: ScheduleDataDto;

  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  tuesday: ScheduleDataDto;

  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  wednesday: ScheduleDataDto;

  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  thursday: ScheduleDataDto;

  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  friday: ScheduleDataDto;

  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  saturday: ScheduleDataDto;

  @ApiProperty({ type: ScheduleDataDto })
  @Type(() => ScheduleDataDto)
  sunday: ScheduleDataDto;
}
