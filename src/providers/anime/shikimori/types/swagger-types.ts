/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class ShikimoriPosterSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() originalUrl?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() mainUrl?: boolean;
}

class ShikimoriAiredOnSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() year?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() month?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() day?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() date?: boolean;
}

class ShikimoriReleasedOnSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() year?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() month?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() day?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() date?: boolean;
}

class ShikimoriChronologySelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() malId?: boolean;
}

class ShikimoriVideoSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() kind?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() playerUrl?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() imageUrl?: boolean;
}

class ShikimoriScreenshotSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() originalUrl?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() x166Url?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() x332Url?: boolean;
}

export class ShikimoriSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() malId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() russian?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() licenseNameRu?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() english?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() japanese?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() synonyms?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() kind?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() rating?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() score?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodes?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodesAired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() duration?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() franchise?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() season?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() createdAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() updatedAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() nextEpisodeAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() description?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() descriptionHtml?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() descriptionSource?: boolean;

  @ApiPropertyOptional({ type: () => ShikimoriPosterSelectDto })
  @ValidateNested() @Type(() => ShikimoriPosterSelectDto)
  poster?: {
    select?: ShikimoriPosterSelectDto;
  };

  @ApiPropertyOptional({ type: () => ShikimoriAiredOnSelectDto })
  @ValidateNested() @Type(() => ShikimoriAiredOnSelectDto)
  airedOn?: {
    select?: ShikimoriAiredOnSelectDto;
  };

  @ApiPropertyOptional({ type: () => ShikimoriReleasedOnSelectDto })
  @ValidateNested() @Type(() => ShikimoriReleasedOnSelectDto)
  releasedOn?: {
    select?: ShikimoriReleasedOnSelectDto;
  };

  @ApiPropertyOptional({ type: () => ShikimoriChronologySelectDto })
  @ValidateNested() @Type(() => ShikimoriChronologySelectDto)
  chronology?: {
    select?: ShikimoriChronologySelectDto;
  };

  @ApiPropertyOptional({ type: () => ShikimoriVideoSelectDto })
  @ValidateNested() @Type(() => ShikimoriVideoSelectDto)
  videos?: {
    select?: ShikimoriVideoSelectDto;
  };

  @ApiPropertyOptional({ type: () => ShikimoriScreenshotSelectDto })
  @ValidateNested() @Type(() => ShikimoriScreenshotSelectDto)
  screenshots?: {
    select?: ShikimoriScreenshotSelectDto;
  };
}
