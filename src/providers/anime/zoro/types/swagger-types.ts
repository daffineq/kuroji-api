/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class ZoroEpisodeSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() title?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFiller?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isSubbed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDubbed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
}

export class ZoroSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() title?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() malID?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() alID?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() japaneseTitle?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() description?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() updatedAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() subOrDub?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasSub?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasDub?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() season?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() totalEpisodes?: boolean;

  @ApiPropertyOptional({ type: () => ZoroEpisodeSelectDto })
  @ValidateNested() @Type(() => ZoroEpisodeSelectDto)
  episodes?: {
    select?: ZoroEpisodeSelectDto;
  };
}
