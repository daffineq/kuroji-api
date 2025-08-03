
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAnimepaheExternalLinkDto} from '../../animepaheExternalLink/dto/create-animepaheExternalLink.dto.js'
import {ConnectAnimepaheExternalLinkDto} from '../../animepaheExternalLink/dto/connect-animepaheExternalLink.dto.js'
import {CreateAnimepaheEpisodeDto} from '../../animepaheEpisode/dto/create-animepaheEpisode.dto.js'
import {ConnectAnimepaheEpisodeDto} from '../../animepaheEpisode/dto/connect-animepaheEpisode.dto.js'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnimepaheExternalLinksRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnimepaheExternalLinkDto,
  isArray: true,
})
create?: CreateAnimepaheExternalLinkDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnimepaheExternalLinkDto,
  isArray: true,
})
connect?: ConnectAnimepaheExternalLinkDto[] ;
  }
export class CreateAnimepaheEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnimepaheEpisodeDto,
  isArray: true,
})
create?: CreateAnimepaheEpisodeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnimepaheEpisodeDto,
  isArray: true,
})
connect?: ConnectAnimepaheEpisodeDto[] ;
  }
export class CreateAnimepaheAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(CreateAnimepaheExternalLinkDto,ConnectAnimepaheExternalLinkDto,CreateAnimepaheExternalLinksRelationInputDto,CreateAnimepaheEpisodeDto,ConnectAnimepaheEpisodeDto,CreateAnimepaheEpisodesRelationInputDto,ConnectAnilistDto,CreateAnimepaheAnilistRelationInputDto)
export class CreateAnimepaheDto {
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
  required: false,
  type: CreateAnimepaheExternalLinksRelationInputDto,
})
externalLinks?: CreateAnimepaheExternalLinksRelationInputDto ;
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
@ApiProperty({
  required: false,
  type: CreateAnimepaheEpisodesRelationInputDto,
})
episodes?: CreateAnimepaheEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnimepaheAnilistRelationInputDto,
})
anilist?: CreateAnimepaheAnilistRelationInputDto ;
}
