/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class AnimepaheExternalLinkSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() sourceName?: boolean;
}

class AnimepaheEpisodeSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() title?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() duration?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
}

export class AnimepaheSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() alId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() title?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() cover?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() updatedAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasSub?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() releaseDate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() totalEpisodes?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodePages?: boolean;

  @ApiPropertyOptional({ type: () => AnimepaheExternalLinkSelectDto })
  @ValidateNested() @Type(() => AnimepaheExternalLinkSelectDto)
  externalLinks?: {
    select?: AnimepaheExternalLinkSelectDto;
  };

  @ApiPropertyOptional({ type: () => AnimepaheEpisodeSelectDto })
  @ValidateNested() @Type(() => AnimepaheEpisodeSelectDto)
  episodes?: {
    select?: AnimepaheEpisodeSelectDto;
  };
}
