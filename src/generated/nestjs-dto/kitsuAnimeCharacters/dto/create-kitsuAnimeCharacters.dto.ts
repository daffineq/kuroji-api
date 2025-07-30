
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto.js'

export class CreateKitsuAnimeCharactersKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuAnimeCharactersKitsuRelationInputDto)
export class CreateKitsuAnimeCharactersDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuAnimeCharactersKitsuRelationInputDto,
})
kitsu: CreateKitsuAnimeCharactersKitsuRelationInputDto ;
}
