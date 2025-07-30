import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SourceTypeDto {
  soft_sub = 'soft_sub',
  hard_sub = 'hard_sub',
  dub = 'dub',
  both = 'both',
}

export enum ProviderDto {
  zoro = 'zoro',
  animekai = 'animekai',
  animepahe = 'animepahe',
  anilibria = 'anilibria',
}

export enum LanguageDto {
  russian = 'ru',
  english = 'en',
  multi = 'multi',
}

export class TmdbImageDto {
  @ApiProperty() w300: string;
  @ApiProperty() w500: string;
  @ApiProperty() original: string;
}

export class AvailableOnDto {
  @ApiProperty() animepahe: boolean;
  @ApiProperty() animekai: boolean;
  @ApiProperty() zoro: boolean;
  @ApiProperty() anilibria: boolean;
}

export class EpisodeDto {
  @ApiPropertyOptional() title?: string | null;
  @ApiPropertyOptional() russianTitle?: string | null;
  @ApiPropertyOptional({ type: () => TmdbImageDto })
  @Type(() => TmdbImageDto)
  image?: TmdbImageDto | null;
  @ApiPropertyOptional() number?: number | null;
  @ApiPropertyOptional() overview?: string | null;
  @ApiPropertyOptional() date?: string | null;
  @ApiPropertyOptional() duration?: number | null;
  @ApiPropertyOptional() filler?: boolean | null;
  @ApiPropertyOptional() sub?: boolean | null;
  @ApiPropertyOptional() dub?: boolean | null;
  @ApiProperty({ type: AvailableOnDto })
  @Type(() => AvailableOnDto)
  availableOn: AvailableOnDto;
}

export class EpisodeImageDto {
  @ApiPropertyOptional({ type: () => TmdbImageDto })
  @Type(() => TmdbImageDto)
  image: TmdbImageDto | null;
  @ApiProperty() aspectRation: number;
  @ApiProperty() height: number;
  @ApiProperty() width: number;
  @ApiProperty() iso_639_1: string;
  @ApiProperty() voteAverage: number;
  @ApiProperty() voteCount: number;
}

export class EpisodeDetailsDto extends EpisodeDto {
  @ApiProperty({ type: [EpisodeImageDto] })
  @Type(() => EpisodeImageDto)
  images: EpisodeImageDto[];
}

export class ProviderInfoDto {
  @ApiProperty() id: string;
  @ApiProperty() filler: boolean;
  @ApiProperty({ enum: ProviderDto }) provider: ProviderDto;
  @ApiProperty({ enum: SourceTypeDto }) type: SourceTypeDto;
  @ApiProperty({ enum: LanguageDto }) language: LanguageDto;
}

export class BestProviderDto<T> {
  @ApiProperty({ enum: ['zoro', 'pahe', 'tmdb', 'anilibria', 'anizip'] })
  name: 'zoro' | 'pahe' | 'tmdb' | 'anilibria' | 'anizip';
  @ApiProperty() count: number;
  @ApiProperty({ isArray: true }) episodes: T[];
}
