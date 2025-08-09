
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnilistStreamingEpisodeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistStreamingEpisodeAnilistRelationInputDto)
export class CreateAnilistStreamingEpisodeDto {
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
thumbnail?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
site?: string  | null;
@ApiProperty({
  type: CreateAnilistStreamingEpisodeAnilistRelationInputDto,
})
anilist: CreateAnilistStreamingEpisodeAnilistRelationInputDto ;
}
