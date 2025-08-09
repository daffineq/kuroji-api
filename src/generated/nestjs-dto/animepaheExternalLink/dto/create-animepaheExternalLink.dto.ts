
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnimepaheDto} from '../../animepahe/dto/connect-animepahe.dto'

export class CreateAnimepaheExternalLinkAnimepaheRelationInputDto {
    @ApiProperty({
  type: ConnectAnimepaheDto,
  isArray: true,
})
connect: ConnectAnimepaheDto[] ;
  }

@ApiExtraModels(ConnectAnimepaheDto,CreateAnimepaheExternalLinkAnimepaheRelationInputDto)
export class CreateAnimepaheExternalLinkDto {
  @ApiProperty({
  type: 'string',
})
url: string ;
@ApiProperty({
  type: 'string',
})
sourceName: string ;
@ApiProperty({
  required: false,
  type: CreateAnimepaheExternalLinkAnimepaheRelationInputDto,
})
animepahe?: CreateAnimepaheExternalLinkAnimepaheRelationInputDto ;
}
