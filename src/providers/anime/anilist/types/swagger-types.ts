/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { FilterDto } from '../filter/FilterDto.js';

class AnilistTitleSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() romaji?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() english?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() native?: boolean;
}

class AnilistDateSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() year?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() month?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() day?: boolean;
}

class AnilistImageSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() color?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() large?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() medium?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() extraLarge?: boolean;
}

class AnilistNextAiringEpisodeSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() airingAt?: boolean;
}

export class AnilistSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() idMal?: boolean;
  @ApiPropertyOptional({ type: () => AnilistTitleSelectDto })
  @ValidateNested() @Type(() => AnilistTitleSelectDto)
  title?: { select?: AnilistTitleSelectDto };
  @ApiPropertyOptional() @IsOptional() @IsBoolean() synonyms?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() bannerImage?: boolean;

  @ApiPropertyOptional({ type: () => AnilistImageSelectDto })
  @ValidateNested() @Type(() => AnilistImageSelectDto)
  coverImage?: { select?: AnilistImageSelectDto };

  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() format?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() description?: boolean;

  @ApiPropertyOptional({ type: () => AnilistDateSelectDto })
  @ValidateNested() @Type(() => AnilistDateSelectDto)
  startDate?: { select?: AnilistDateSelectDto };

  @ApiPropertyOptional() @IsOptional() @IsBoolean() season?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() seasonYear?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodes?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() duration?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() countryOfOrigin?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() source?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() popularity?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() favourites?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() score?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isLocked?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isAdult?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() genres?: boolean;

  @ApiPropertyOptional({ type: () => AnilistNextAiringEpisodeSelectDto })
  @ValidateNested() @Type(() => AnilistNextAiringEpisodeSelectDto)
  nextAiringEpisode?: { select?: AnilistNextAiringEpisodeSelectDto };
}

export class BatchFilterDto {
  @ApiProperty() filters: FilterDto;

  @ApiPropertyOptional({ type: AnilistSelectDto })
  @ValidateNested() @Type(() => AnilistSelectDto)
  select?: AnilistSelectDto;
}
