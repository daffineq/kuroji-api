
import {Prisma} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'


export class KitsuDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
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
}
