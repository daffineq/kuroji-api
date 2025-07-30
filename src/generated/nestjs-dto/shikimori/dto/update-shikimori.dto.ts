
import {ApiProperty} from '@nestjs/swagger'




export class UpdateShikimoriDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
russian?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
licenseNameRu?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
english?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
japanese?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
synonyms?: string[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
kind?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
rating?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
score?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
status?: string  | null;
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
episodesAired?: number  | null;
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
franchise?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
season?: string  | null;
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
  format: 'date-time',
  required: false,
  nullable: true,
})
nextEpisodeAt?: Date  | null;
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
descriptionHtml?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
descriptionSource?: string  | null;
}
