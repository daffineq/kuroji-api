
import {ApiProperty} from '@nestjs/swagger'
import {AnimekaiEpisode} from '../../animekaiEpisode/entities/animekaiEpisode.entity.js'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class AnimeKai {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anilistId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
title: string  | null;
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
episodes?: AnimekaiEpisode[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
