
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
idMal?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
bannerImage?: string  | null;
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
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
format?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
updatedAt?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
season?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
seasonYear?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodes?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
duration?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
countryOfOrigin?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isLicensed?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
source?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
hashtag?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isLocked?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isAdult?: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
averageScore?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
meanScore?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
score?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
popularity?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
trending?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
favourites?: number  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
genres?: string[] ;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
synonyms?: string[] ;
}
