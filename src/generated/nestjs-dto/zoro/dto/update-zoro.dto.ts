
import {ApiProperty} from '@nestjs/swagger'




export class UpdateZoroDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
title?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
malID?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
japaneseTitle?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
image?: string  | null;
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
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
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
subOrDub?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
hasSub?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
hasDub?: boolean  | null;
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
season?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
totalEpisodes?: number  | null;
}
