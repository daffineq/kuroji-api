
import {ApiProperty} from '@nestjs/swagger'
import {AnimepaheExternalLink} from '../../animepaheExternalLink/entities/animepaheExternalLink.entity.js'
import {AnimepaheEpisode} from '../../animepaheEpisode/entities/animepaheEpisode.entity.js'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class Animepahe {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
alId: number  | null;
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
  type: () => Object,
  isArray: true,
  required: false,
})
externalLinks?: AnimepaheExternalLink[] ;
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
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
episodes?: AnimepaheEpisode[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
