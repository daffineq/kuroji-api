
import {ApiProperty} from '@nestjs/swagger'


export class ShikimoriDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
russian: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
licenseNameRu: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
english: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
japanese: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
synonyms: string[] ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
kind: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
rating: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
score: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
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
episodesAired: number  | null;
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
franchise: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
season: string  | null;
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
  format: 'date-time',
  nullable: true,
})
nextEpisodeAt: Date  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
descriptionHtml: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
descriptionSource: string  | null;
}
