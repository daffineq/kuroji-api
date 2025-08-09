
import {ApiProperty} from '@nestjs/swagger'
import {TvdbStatus} from '../../tvdbStatus/entities/tvdbStatus.entity'
import {TvdbAlias} from '../../tvdbAlias/entities/tvdbAlias.entity'
import {TvdbArtwork} from '../../tvdbArtwork/entities/tvdbArtwork.entity'
import {TvdbRemoteId} from '../../tvdbRemoteId/entities/tvdbRemoteId.entity'
import {TvdbTrailer} from '../../tvdbTrailer/entities/tvdbTrailer.entity'


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
  type: () => TvdbStatus,
  required: false,
  nullable: true,
})
status?: TvdbStatus  | null;
@ApiProperty({
  type: () => TvdbAlias,
  isArray: true,
  required: false,
})
aliases?: TvdbAlias[] ;
@ApiProperty({
  type: () => TvdbArtwork,
  isArray: true,
  required: false,
})
artworks?: TvdbArtwork[] ;
@ApiProperty({
  type: () => TvdbRemoteId,
  isArray: true,
  required: false,
})
remoteIds?: TvdbRemoteId[] ;
@ApiProperty({
  type: () => TvdbTrailer,
  isArray: true,
  required: false,
})
trailers?: TvdbTrailer[] ;
}
