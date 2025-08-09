
import {Prisma} from '@prisma/client'
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuTitleDto} from '../../kitsuTitle/dto/connect-kitsuTitle.dto'
import {ConnectKitsuPosterImageDto} from '../../kitsuPosterImage/dto/connect-kitsuPosterImage.dto'
import {ConnectKitsuCoverImageDto} from '../../kitsuCoverImage/dto/connect-kitsuCoverImage.dto'
import {ConnectKitsuGenresDto} from '../../kitsuGenres/dto/connect-kitsuGenres.dto'
import {ConnectKitsuCategoriesDto} from '../../kitsuCategories/dto/connect-kitsuCategories.dto'
import {ConnectKitsuCastingsDto} from '../../kitsuCastings/dto/connect-kitsuCastings.dto'
import {ConnectKitsuInstallmentsDto} from '../../kitsuInstallments/dto/connect-kitsuInstallments.dto'
import {ConnectKitsuMappingsDto} from '../../kitsuMappings/dto/connect-kitsuMappings.dto'
import {ConnectKitsuReviewsDto} from '../../kitsuReviews/dto/connect-kitsuReviews.dto'
import {ConnectKitsuMediaRelationshipsDto} from '../../kitsuMediaRelationships/dto/connect-kitsuMediaRelationships.dto'
import {ConnectKitsuEpisodesDto} from '../../kitsuEpisodes/dto/connect-kitsuEpisodes.dto'
import {ConnectKitsuStreamingLinksDto} from '../../kitsuStreamingLinks/dto/connect-kitsuStreamingLinks.dto'
import {ConnectKitsuAnimeProductionsDto} from '../../kitsuAnimeProductions/dto/connect-kitsuAnimeProductions.dto'
import {ConnectKitsuAnimeCharactersDto} from '../../kitsuAnimeCharacters/dto/connect-kitsuAnimeCharacters.dto'
import {ConnectKitsuAnimeStaffDto} from '../../kitsuAnimeStaff/dto/connect-kitsuAnimeStaff.dto'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateKitsuTitlesRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuTitleDto,
})
connect: ConnectKitsuTitleDto ;
  }
export class CreateKitsuPosterImageRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuPosterImageDto,
})
connect: ConnectKitsuPosterImageDto ;
  }
export class CreateKitsuCoverImageRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuCoverImageDto,
})
connect: ConnectKitsuCoverImageDto ;
  }
export class CreateKitsuGenresRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuGenresDto,
})
connect: ConnectKitsuGenresDto ;
  }
export class CreateKitsuCategoriesRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuCategoriesDto,
})
connect: ConnectKitsuCategoriesDto ;
  }
export class CreateKitsuCastingsRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuCastingsDto,
})
connect: ConnectKitsuCastingsDto ;
  }
export class CreateKitsuInstallmentsRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuInstallmentsDto,
})
connect: ConnectKitsuInstallmentsDto ;
  }
export class CreateKitsuMappingsRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuMappingsDto,
})
connect: ConnectKitsuMappingsDto ;
  }
export class CreateKitsuReviewsRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuReviewsDto,
})
connect: ConnectKitsuReviewsDto ;
  }
export class CreateKitsuMediaRelationshipsRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuMediaRelationshipsDto,
})
connect: ConnectKitsuMediaRelationshipsDto ;
  }
export class CreateKitsuEpisodesRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuEpisodesDto,
})
connect: ConnectKitsuEpisodesDto ;
  }
export class CreateKitsuStreamingLinksRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuStreamingLinksDto,
})
connect: ConnectKitsuStreamingLinksDto ;
  }
export class CreateKitsuAnimeProductionsRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuAnimeProductionsDto,
})
connect: ConnectKitsuAnimeProductionsDto ;
  }
export class CreateKitsuAnimeCharactersRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuAnimeCharactersDto,
})
connect: ConnectKitsuAnimeCharactersDto ;
  }
export class CreateKitsuAnimeStaffRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuAnimeStaffDto,
})
connect: ConnectKitsuAnimeStaffDto ;
  }
export class CreateKitsuAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectKitsuTitleDto,CreateKitsuTitlesRelationInputDto,ConnectKitsuPosterImageDto,CreateKitsuPosterImageRelationInputDto,ConnectKitsuCoverImageDto,CreateKitsuCoverImageRelationInputDto,ConnectKitsuGenresDto,CreateKitsuGenresRelationInputDto,ConnectKitsuCategoriesDto,CreateKitsuCategoriesRelationInputDto,ConnectKitsuCastingsDto,CreateKitsuCastingsRelationInputDto,ConnectKitsuInstallmentsDto,CreateKitsuInstallmentsRelationInputDto,ConnectKitsuMappingsDto,CreateKitsuMappingsRelationInputDto,ConnectKitsuReviewsDto,CreateKitsuReviewsRelationInputDto,ConnectKitsuMediaRelationshipsDto,CreateKitsuMediaRelationshipsRelationInputDto,ConnectKitsuEpisodesDto,CreateKitsuEpisodesRelationInputDto,ConnectKitsuStreamingLinksDto,CreateKitsuStreamingLinksRelationInputDto,ConnectKitsuAnimeProductionsDto,CreateKitsuAnimeProductionsRelationInputDto,ConnectKitsuAnimeCharactersDto,CreateKitsuAnimeCharactersRelationInputDto,ConnectKitsuAnimeStaffDto,CreateKitsuAnimeStaffRelationInputDto,ConnectAnilistDto,CreateKitsuAnilistRelationInputDto)
export class CreateKitsuDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
selfLink?: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
createdAt?: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
updatedAt?: Date  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
slug?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
synopsis?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
coverImageTopOffset?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
canonicalTitle?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
abbreviatedTitles: string[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
averageRating?: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
ratingFrequencies?: Prisma.InputJsonValue  | Prisma.NullableJsonNullValueInput;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
userCount?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
favoritesCount?: number  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
startDate?: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
endDate?: Date  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
popularityRank?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
ratingRank?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
ageRating?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
ageRatingGuide?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
subtype?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
status?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
tba?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodeCount?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodeLength?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
youtubeVideoId?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
showType?: string  | null;
@ApiProperty({
  required: false,
  type: CreateKitsuTitlesRelationInputDto,
})
titles?: CreateKitsuTitlesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuPosterImageRelationInputDto,
})
posterImage?: CreateKitsuPosterImageRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuCoverImageRelationInputDto,
})
coverImage?: CreateKitsuCoverImageRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuGenresRelationInputDto,
})
genres?: CreateKitsuGenresRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuCategoriesRelationInputDto,
})
categories?: CreateKitsuCategoriesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuCastingsRelationInputDto,
})
castings?: CreateKitsuCastingsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuInstallmentsRelationInputDto,
})
installments?: CreateKitsuInstallmentsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuMappingsRelationInputDto,
})
mappings?: CreateKitsuMappingsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuReviewsRelationInputDto,
})
reviews?: CreateKitsuReviewsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuMediaRelationshipsRelationInputDto,
})
mediaRelationships?: CreateKitsuMediaRelationshipsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuEpisodesRelationInputDto,
})
episodes?: CreateKitsuEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuStreamingLinksRelationInputDto,
})
streamingLinks?: CreateKitsuStreamingLinksRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuAnimeProductionsRelationInputDto,
})
animeProductions?: CreateKitsuAnimeProductionsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuAnimeCharactersRelationInputDto,
})
animeCharacters?: CreateKitsuAnimeCharactersRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuAnimeStaffRelationInputDto,
})
animeStaff?: CreateKitsuAnimeStaffRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuAnilistRelationInputDto,
})
anilist?: CreateKitsuAnilistRelationInputDto ;
}
