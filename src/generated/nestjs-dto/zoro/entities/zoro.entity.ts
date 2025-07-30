
import {ApiProperty} from '@nestjs/swagger'
import {EpisodeZoro} from '../../episodeZoro/entities/episodeZoro.entity.js'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class Zoro {
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
  type: 'integer',
  format: 'int32',
  nullable: true,
})
malID: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
alID: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
japaneseTitle: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
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
subOrDub: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
hasSub: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
hasDub: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
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
totalEpisodes: number  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
episodes?: EpisodeZoro[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
