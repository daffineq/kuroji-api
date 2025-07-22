/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, ValidateNested } from 'class-validator';

class KitsuTitleSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() en?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() en_jp?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ja_jp?: boolean;
}

class KitsuDimensionDetailSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() width?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() height?: boolean;
}

class KitsuDimensionsSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;

  @ApiPropertyOptional({ type: () => KitsuDimensionDetailSelectDto })
  @ValidateNested() @Type(() => KitsuDimensionDetailSelectDto)
  tiny?: { select?: KitsuDimensionDetailSelectDto };

  @ApiPropertyOptional({ type: () => KitsuDimensionDetailSelectDto })
  @ValidateNested() @Type(() => KitsuDimensionDetailSelectDto)
  small?: { select?: KitsuDimensionDetailSelectDto };

  @ApiPropertyOptional({ type: () => KitsuDimensionDetailSelectDto })
  @ValidateNested() @Type(() => KitsuDimensionDetailSelectDto)
  medium?: { select?: KitsuDimensionDetailSelectDto };

  @ApiPropertyOptional({ type: () => KitsuDimensionDetailSelectDto })
  @ValidateNested() @Type(() => KitsuDimensionDetailSelectDto)
  large?: { select?: KitsuDimensionDetailSelectDto };
}

class KitsuImageSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() tiny?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() small?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() medium?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() large?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() original?: boolean;

  @ApiPropertyOptional({ type: () => KitsuDimensionsSelectDto })
  @ValidateNested() @Type(() => KitsuDimensionsSelectDto)
  dimensions?: { select?: KitsuDimensionsSelectDto };
}

class KitsuRelationshipSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() selfLink?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() related?: boolean;
}

export class KitsuSelectDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() id?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() anilistId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() type?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() selfLink?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() createdAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() updatedAt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() slug?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() synopsis?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() coverImageTopOffset?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() canonicalTitle?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() abbreviatedTitles?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() averageRating?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ratingFrequencies?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() userCount?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() favoritesCount?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() startDate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() endDate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() popularityRank?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ratingRank?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ageRating?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ageRatingGuide?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() subtype?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() tba?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodeCount?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() episodeLength?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() youtubeVideoId?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() showType?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() nsfw?: boolean;

  @ApiPropertyOptional({ type: () => KitsuTitleSelectDto })
  @ValidateNested() @Type(() => KitsuTitleSelectDto)
  titles?: { select?: KitsuTitleSelectDto };

  @ApiPropertyOptional({ type: () => KitsuImageSelectDto })
  @ValidateNested() @Type(() => KitsuImageSelectDto)
  posterImage?: { select?: KitsuImageSelectDto };

  @ApiPropertyOptional({ type: () => KitsuImageSelectDto })
  @ValidateNested() @Type(() => KitsuImageSelectDto)
  coverImage?: { select?: KitsuImageSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  genres?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  categories?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  castings?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  installments?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  mappings?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  reviews?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  mediaRelationships?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  episodes?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  streamingLinks?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  animeProductions?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  animeCharacters?: { select?: KitsuRelationshipSelectDto };

  @ApiPropertyOptional({ type: () => KitsuRelationshipSelectDto })
  @ValidateNested() @Type(() => KitsuRelationshipSelectDto)
  animeStaff?: { select?: KitsuRelationshipSelectDto };
}
