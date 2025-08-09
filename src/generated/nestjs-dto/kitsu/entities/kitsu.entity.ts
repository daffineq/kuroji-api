
import {Prisma} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {KitsuTitle} from '../../kitsuTitle/entities/kitsuTitle.entity'
import {KitsuPosterImage} from '../../kitsuPosterImage/entities/kitsuPosterImage.entity'
import {KitsuCoverImage} from '../../kitsuCoverImage/entities/kitsuCoverImage.entity'
import {KitsuGenres} from '../../kitsuGenres/entities/kitsuGenres.entity'
import {KitsuCategories} from '../../kitsuCategories/entities/kitsuCategories.entity'
import {KitsuCastings} from '../../kitsuCastings/entities/kitsuCastings.entity'
import {KitsuInstallments} from '../../kitsuInstallments/entities/kitsuInstallments.entity'
import {KitsuMappings} from '../../kitsuMappings/entities/kitsuMappings.entity'
import {KitsuReviews} from '../../kitsuReviews/entities/kitsuReviews.entity'
import {KitsuMediaRelationships} from '../../kitsuMediaRelationships/entities/kitsuMediaRelationships.entity'
import {KitsuEpisodes} from '../../kitsuEpisodes/entities/kitsuEpisodes.entity'
import {KitsuStreamingLinks} from '../../kitsuStreamingLinks/entities/kitsuStreamingLinks.entity'
import {KitsuAnimeProductions} from '../../kitsuAnimeProductions/entities/kitsuAnimeProductions.entity'
import {KitsuAnimeCharacters} from '../../kitsuAnimeCharacters/entities/kitsuAnimeCharacters.entity'
import {KitsuAnimeStaff} from '../../kitsuAnimeStaff/entities/kitsuAnimeStaff.entity'
import {Anilist} from '../../anilist/entities/anilist.entity'


export class Kitsu {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anilistId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
selfLink: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
createdAt: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
updatedAt: Date  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
slug: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
synopsis: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
coverImageTopOffset: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
canonicalTitle: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
abbreviatedTitles: string[] ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
averageRating: string  | null;
@ApiProperty({
  type: () => Object,
  nullable: true,
})
ratingFrequencies: Prisma.JsonValue  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
userCount: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
favoritesCount: number  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
startDate: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
endDate: Date  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
popularityRank: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
ratingRank: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
ageRating: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
ageRatingGuide: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
subtype: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
tba: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodeCount: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodeLength: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
youtubeVideoId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
showType: string  | null;
@ApiProperty({
  type: 'boolean',
})
nsfw: boolean ;
@ApiProperty({
  type: () => KitsuTitle,
  required: false,
  nullable: true,
})
titles?: KitsuTitle  | null;
@ApiProperty({
  type: () => KitsuPosterImage,
  required: false,
  nullable: true,
})
posterImage?: KitsuPosterImage  | null;
@ApiProperty({
  type: () => KitsuCoverImage,
  required: false,
  nullable: true,
})
coverImage?: KitsuCoverImage  | null;
@ApiProperty({
  type: () => KitsuGenres,
  required: false,
  nullable: true,
})
genres?: KitsuGenres  | null;
@ApiProperty({
  type: () => KitsuCategories,
  required: false,
  nullable: true,
})
categories?: KitsuCategories  | null;
@ApiProperty({
  type: () => KitsuCastings,
  required: false,
  nullable: true,
})
castings?: KitsuCastings  | null;
@ApiProperty({
  type: () => KitsuInstallments,
  required: false,
  nullable: true,
})
installments?: KitsuInstallments  | null;
@ApiProperty({
  type: () => KitsuMappings,
  required: false,
  nullable: true,
})
mappings?: KitsuMappings  | null;
@ApiProperty({
  type: () => KitsuReviews,
  required: false,
  nullable: true,
})
reviews?: KitsuReviews  | null;
@ApiProperty({
  type: () => KitsuMediaRelationships,
  required: false,
  nullable: true,
})
mediaRelationships?: KitsuMediaRelationships  | null;
@ApiProperty({
  type: () => KitsuEpisodes,
  required: false,
  nullable: true,
})
episodes?: KitsuEpisodes  | null;
@ApiProperty({
  type: () => KitsuStreamingLinks,
  required: false,
  nullable: true,
})
streamingLinks?: KitsuStreamingLinks  | null;
@ApiProperty({
  type: () => KitsuAnimeProductions,
  required: false,
  nullable: true,
})
animeProductions?: KitsuAnimeProductions  | null;
@ApiProperty({
  type: () => KitsuAnimeCharacters,
  required: false,
  nullable: true,
})
animeCharacters?: KitsuAnimeCharacters  | null;
@ApiProperty({
  type: () => KitsuAnimeStaff,
  required: false,
  nullable: true,
})
animeStaff?: KitsuAnimeStaff  | null;
@ApiProperty({
  type: () => Anilist,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
