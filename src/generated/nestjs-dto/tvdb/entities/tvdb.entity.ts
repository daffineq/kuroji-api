
import {ApiProperty} from '@nestjs/swagger'
import {TvdbStatus} from '../../tvdbStatus/entities/tvdbStatus.entity.js'
import {TvdbAlias} from '../../tvdbAlias/entities/tvdbAlias.entity.js'
import {TvdbArtwork} from '../../tvdbArtwork/entities/tvdbArtwork.entity.js'
import {TvdbRemoteId} from '../../tvdbRemoteId/entities/tvdbRemoteId.entity.js'
import {TvdbTrailer} from '../../tvdbTrailer/entities/tvdbTrailer.entity.js'


export class Tvdb {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
slug: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
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
runtime: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
lastUpdated: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
year: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
nameTranslations: string[] ;
@ApiProperty({
  type: 'string',
  isArray: true,
})
overviewTranslations: string[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
status?: TvdbStatus  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
aliases?: TvdbAlias[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
artworks?: TvdbArtwork[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
remoteIds?: TvdbRemoteId[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
trailers?: TvdbTrailer[] ;
}
