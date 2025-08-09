
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto'

export class CreateKitsuAnimeProductionsKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuAnimeProductionsKitsuRelationInputDto)
export class CreateKitsuAnimeProductionsDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuAnimeProductionsKitsuRelationInputDto,
})
kitsu: CreateKitsuAnimeProductionsKitsuRelationInputDto ;
}
