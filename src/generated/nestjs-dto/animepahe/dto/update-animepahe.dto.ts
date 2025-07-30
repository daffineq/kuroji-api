
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnimepaheDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
title?: string  | null;
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
cover?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
updatedAt?: number  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
hasSub?: boolean  | null;
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
releaseDate?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
totalEpisodes?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodePages?: number  | null;
}
