
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnimepaheDto} from '../../animepahe/dto/connect-animepahe.dto.js'

export class CreateAnimepaheEpisodeAnimepaheRelationInputDto {
    @ApiProperty({
  type: ConnectAnimepaheDto,
  isArray: true,
})
connect: ConnectAnimepaheDto[] ;
  }

@ApiExtraModels(ConnectAnimepaheDto,CreateAnimepaheEpisodeAnimepaheRelationInputDto)
export class CreateAnimepaheEpisodeDto {
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
duration?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnimepaheEpisodeAnimepaheRelationInputDto,
})
animepahe?: CreateAnimepaheEpisodeAnimepaheRelationInputDto ;
}
