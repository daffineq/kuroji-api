
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnimeKaiDto} from '../../animeKai/dto/connect-animeKai.dto'

export class CreateAnimekaiEpisodeAnimekaiRelationInputDto {
    @ApiProperty({
  type: ConnectAnimeKaiDto,
  isArray: true,
})
connect: ConnectAnimeKaiDto[] ;
  }

@ApiExtraModels(ConnectAnimeKaiDto,CreateAnimekaiEpisodeAnimekaiRelationInputDto)
export class CreateAnimekaiEpisodeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
number?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
title?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isFiller?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isSubbed?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isDubbed?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnimekaiEpisodeAnimekaiRelationInputDto,
})
animekai?: CreateAnimekaiEpisodeAnimekaiRelationInputDto ;
}
