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
