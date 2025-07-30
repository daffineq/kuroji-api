
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectTvdbStatusDto} from '../../tvdbStatus/dto/connect-tvdbStatus.dto.js'
import {CreateTvdbAliasDto} from '../../tvdbAlias/dto/create-tvdbAlias.dto.js'
import {ConnectTvdbAliasDto} from '../../tvdbAlias/dto/connect-tvdbAlias.dto.js'
import {CreateTvdbArtworkDto} from '../../tvdbArtwork/dto/create-tvdbArtwork.dto.js'
import {ConnectTvdbArtworkDto} from '../../tvdbArtwork/dto/connect-tvdbArtwork.dto.js'
import {CreateTvdbRemoteIdDto} from '../../tvdbRemoteId/dto/create-tvdbRemoteId.dto.js'
import {ConnectTvdbRemoteIdDto} from '../../tvdbRemoteId/dto/connect-tvdbRemoteId.dto.js'
import {CreateTvdbTrailerDto} from '../../tvdbTrailer/dto/create-tvdbTrailer.dto.js'
import {ConnectTvdbTrailerDto} from '../../tvdbTrailer/dto/connect-tvdbTrailer.dto.js'

export class CreateTvdbStatusRelationInputDto {
    @ApiProperty({
  type: ConnectTvdbStatusDto,
})
connect: ConnectTvdbStatusDto ;
  }
export class CreateTvdbAliasesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTvdbAliasDto,
  isArray: true,
})
create?: CreateTvdbAliasDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTvdbAliasDto,
  isArray: true,
})
connect?: ConnectTvdbAliasDto[] ;
  }
export class CreateTvdbArtworksRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTvdbArtworkDto,
  isArray: true,
})
create?: CreateTvdbArtworkDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTvdbArtworkDto,
  isArray: true,
})
connect?: ConnectTvdbArtworkDto[] ;
  }
export class CreateTvdbRemoteIdsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTvdbRemoteIdDto,
  isArray: true,
})
create?: CreateTvdbRemoteIdDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTvdbRemoteIdDto,
  isArray: true,
})
connect?: ConnectTvdbRemoteIdDto[] ;
  }
export class CreateTvdbTrailersRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTvdbTrailerDto,
  isArray: true,
})
create?: CreateTvdbTrailerDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTvdbTrailerDto,
  isArray: true,
})
connect?: ConnectTvdbTrailerDto[] ;
  }

@ApiExtraModels(ConnectTvdbStatusDto,CreateTvdbStatusRelationInputDto,CreateTvdbAliasDto,ConnectTvdbAliasDto,CreateTvdbAliasesRelationInputDto,CreateTvdbArtworkDto,ConnectTvdbArtworkDto,CreateTvdbArtworksRelationInputDto,CreateTvdbRemoteIdDto,ConnectTvdbRemoteIdDto,CreateTvdbRemoteIdsRelationInputDto,CreateTvdbTrailerDto,ConnectTvdbTrailerDto,CreateTvdbTrailersRelationInputDto)
export class CreateTvdbDto {
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
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
slug?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
image?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
score?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
runtime?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
lastUpdated?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
year?: string  | null;
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
  required: false,
  type: CreateTvdbStatusRelationInputDto,
})
status?: CreateTvdbStatusRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTvdbAliasesRelationInputDto,
})
aliases?: CreateTvdbAliasesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTvdbArtworksRelationInputDto,
})
artworks?: CreateTvdbArtworksRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTvdbRemoteIdsRelationInputDto,
})
remoteIds?: CreateTvdbRemoteIdsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTvdbTrailersRelationInputDto,
})
trailers?: CreateTvdbTrailersRelationInputDto ;
}
