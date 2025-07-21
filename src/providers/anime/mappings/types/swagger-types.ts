/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class AniZipTitleSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() key?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
}

class AniZipImageSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() coverType?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() url?: boolean;
}

class AniZipEpisodeTitleSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() key?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
}

class AniZipEpisodeSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodeKey?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodeNumber?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() seasonNumber?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() absoluteEpisodeNumber?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() airDate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() airDateUtc?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() runtime?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() length?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() overview?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() rating?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() anidbEid?: boolean;

  @ApiPropertyOptional({ type: () => AniZipEpisodeTitleSelectDto })
  @ValidateNested() @Type(() => AniZipEpisodeTitleSelectDto)
  titles?: {
    select?: AniZipEpisodeTitleSelectDto;
  };
}

class AniZipMappingSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() animePlanetId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() kitsuId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() malId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() anilistId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() anisearchId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() anidbId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifymoeId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() livechartId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() thetvdbId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() imdbId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() themoviedbId?: boolean;
}

export class AniZipSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodeCount?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() specialCount?: boolean;

  @ApiPropertyOptional({ type: () => AniZipTitleSelectDto })
  @ValidateNested() @Type(() => AniZipTitleSelectDto)
  titles?: {
    select?: AniZipTitleSelectDto;
  };

  @ApiPropertyOptional({ type: () => AniZipImageSelectDto })
  @ValidateNested() @Type(() => AniZipImageSelectDto)
  images?: {
    select?: AniZipImageSelectDto;
  };

  @ApiPropertyOptional({ type: () => AniZipEpisodeSelectDto })
  @ValidateNested() @Type(() => AniZipEpisodeSelectDto)
  episodes?: {
    select?: AniZipEpisodeSelectDto;
  };

  @ApiPropertyOptional({ type: () => AniZipMappingSelectDto })
  @ValidateNested() @Type(() => AniZipMappingSelectDto)
  mappings?: {
    select?: AniZipMappingSelectDto;
  };
}
