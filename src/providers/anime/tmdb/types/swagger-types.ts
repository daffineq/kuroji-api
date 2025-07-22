/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class TmdbEpisodeImageStillsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aspect_ratio?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() height?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() width?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() iso_639_1?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() file_path?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_average?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_count?: boolean;
}

class TmdbEpisodeImagesDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;

  @ApiPropertyOptional({ type: () => TmdbEpisodeImageStillsDto })
  @ValidateNested() @Type(() => TmdbEpisodeImageStillsDto)
  stills?: TmdbEpisodeImageStillsDto;
}

class TmdbEpisodeDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() air_date?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode_number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode_type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() overview?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() production_code?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() runtime?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() season_number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() still_path?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_average?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_count?: boolean;

  @ApiPropertyOptional({ type: () => TmdbEpisodeImagesDto })
  @ValidateNested() @Type(() => TmdbEpisodeImagesDto)
  images?: TmdbEpisodeImagesDto;
}

class TmdbSeasonDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() air_date?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode_count?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() overview?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() poster_path?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() season_number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_average?: boolean;

  @ApiPropertyOptional({ type: () => TmdbEpisodeDto, isArray: true })
  @ValidateNested() @Type(() => TmdbEpisodeDto)
  episodes?: TmdbEpisodeDto;
}

class TmdbLastNextEpisodeDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() overview?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_average?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_count?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() air_date?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode_number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode_type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() production_code?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() runtime?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() season_number?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() still_path?: boolean;
}

export class TmdbSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() adult?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() backdrop_path?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episode_run_time?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() media_type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() first_air_date?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() homepage?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() in_production?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() last_air_date?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() number_of_episodes?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() number_of_seasons?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() original_language?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() original_name?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() origin_country?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() overview?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() popularity?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() poster_path?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() tagline?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_average?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() vote_count?: boolean;

  @ApiPropertyOptional({ type: () => TmdbLastNextEpisodeDto })
  @ValidateNested() @Type(() => TmdbLastNextEpisodeDto)
  next_episode_to_air?: TmdbLastNextEpisodeDto;

  @ApiPropertyOptional({ type: () => TmdbLastNextEpisodeDto })
  @ValidateNested() @Type(() => TmdbLastNextEpisodeDto)
  last_episode_to_air?: TmdbLastNextEpisodeDto;

  @ApiPropertyOptional({ type: () => TmdbSeasonDto, isArray: true })
  @ValidateNested() @Type(() => TmdbSeasonDto)
  seasons?: TmdbSeasonDto;

  @ApiPropertyOptional({ type: () => TmdbSeasonDto, isArray: true })
  @ValidateNested() @Type(() => TmdbSeasonDto)
  episodeSeasons?: TmdbSeasonDto;

  @ApiPropertyOptional({ type: () => TmdbEpisodeDto, isArray: true })
  @ValidateNested() @Type(() => TmdbEpisodeDto)
  episodes?: TmdbEpisodeDto;
}
