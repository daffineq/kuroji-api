
import {ApiProperty} from '@nestjs/swagger'


export class AnimepaheDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
title: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
cover: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
updatedAt: number  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
hasSub: boolean  | null;
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
releaseDate: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
totalEpisodes: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodePages: number  | null;
}
