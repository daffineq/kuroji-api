
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateEpisodeZoroDto} from '../../episodeZoro/dto/create-episodeZoro.dto'
import {ConnectEpisodeZoroDto} from '../../episodeZoro/dto/connect-episodeZoro.dto'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateZoroEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateEpisodeZoroDto,
  isArray: true,
})
create?: CreateEpisodeZoroDto[] ;
@ApiProperty({
  required: false,
  type: ConnectEpisodeZoroDto,
  isArray: true,
})
connect?: ConnectEpisodeZoroDto[] ;
  }
export class CreateZoroAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(CreateEpisodeZoroDto,ConnectEpisodeZoroDto,CreateZoroEpisodesRelationInputDto,ConnectAnilistDto,CreateZoroAnilistRelationInputDto)
export class CreateZoroDto {
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
@ApiProperty({
  required: false,
  type: CreateZoroEpisodesRelationInputDto,
})
episodes?: CreateZoroEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateZoroAnilistRelationInputDto,
})
anilist?: CreateZoroAnilistRelationInputDto ;
}
