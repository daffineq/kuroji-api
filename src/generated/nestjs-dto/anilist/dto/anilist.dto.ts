
import {ApiProperty} from '@nestjs/swagger'


export class AnilistDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
idMal: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
bannerImage: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
format: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
updatedAt: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
season: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
seasonYear: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodes: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
duration: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
countryOfOrigin: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isLicensed: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
source: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
hashtag: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isLocked: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isAdult: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
averageScore: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
meanScore: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
score: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
popularity: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
trending: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
favourites: number  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
genres: string[] ;
@ApiProperty({
  type: 'string',
  isArray: true,
})
synonyms: string[] ;
}
