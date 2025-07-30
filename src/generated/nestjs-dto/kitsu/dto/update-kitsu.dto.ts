
import {Prisma} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuDto {
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
  required: false,
})
abbreviatedTitles?: string[] ;
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
}
