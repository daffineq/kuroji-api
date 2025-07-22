/* eslint-disable prettier/prettier */
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class TvdbStatusSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() recordType?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() keepUpdated?: boolean;
}

class TvdbAliasSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() language?: boolean;
}

class TvdbArtworkSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() height?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() includesText?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() language?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() score?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() thumbnail?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() width?: boolean;
}

class TvdbRemoteIdSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() sourceName?: boolean;
}

class TvdbTrailerSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() runtime?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() language?: boolean;
}

export class TvdbSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() slug?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() score?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() runtime?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() lastUpdated?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() year?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() nameTranslations?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() overviewTranslations?: boolean;

  @ApiPropertyOptional({ type: () => TvdbStatusSelectDto })
  @ValidateNested() @Type(() => TvdbStatusSelectDto)
  status?: { select?: TvdbStatusSelectDto };

  @ApiPropertyOptional({ type: () => TvdbAliasSelectDto, isArray: true })
  @ValidateNested() @Type(() => TvdbAliasSelectDto)
  aliases?: { select?: TvdbAliasSelectDto };

  @ApiPropertyOptional({ type: () => TvdbArtworkSelectDto, isArray: true })
  @ValidateNested() @Type(() => TvdbArtworkSelectDto)
  artworks?: { select?: TvdbArtworkSelectDto };

  @ApiPropertyOptional({ type: () => TvdbRemoteIdSelectDto, isArray: true })
  @ValidateNested() @Type(() => TvdbRemoteIdSelectDto)
  remoteIds?: { select?: TvdbRemoteIdSelectDto };

  @ApiPropertyOptional({ type: () => TvdbTrailerSelectDto, isArray: true })
  @ValidateNested() @Type(() => TvdbTrailerSelectDto)
  trailers?: { select?: TvdbTrailerSelectDto };
}

export class PartialTvdbSelectDto extends PartialType(TvdbSelectDto) {}
