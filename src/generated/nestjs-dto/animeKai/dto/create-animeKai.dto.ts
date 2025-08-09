
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAnimekaiEpisodeDto} from '../../animekaiEpisode/dto/create-animekaiEpisode.dto'
import {ConnectAnimekaiEpisodeDto} from '../../animekaiEpisode/dto/connect-animekaiEpisode.dto'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnimeKaiEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnimekaiEpisodeDto,
  isArray: true,
})
create?: CreateAnimekaiEpisodeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnimekaiEpisodeDto,
  isArray: true,
})
connect?: ConnectAnimekaiEpisodeDto[] ;
  }
export class CreateAnimeKaiAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(CreateAnimekaiEpisodeDto,ConnectAnimekaiEpisodeDto,CreateAnimeKaiEpisodesRelationInputDto,ConnectAnilistDto,CreateAnimeKaiAnilistRelationInputDto)
export class CreateAnimeKaiDto {
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
  type: CreateAnimeKaiEpisodesRelationInputDto,
})
episodes?: CreateAnimeKaiEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnimeKaiAnilistRelationInputDto,
})
anilist?: CreateAnimeKaiAnilistRelationInputDto ;
}
