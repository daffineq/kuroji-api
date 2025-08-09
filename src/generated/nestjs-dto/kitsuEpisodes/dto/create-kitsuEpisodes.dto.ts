
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto'

export class CreateKitsuEpisodesKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuEpisodesKitsuRelationInputDto)
export class CreateKitsuEpisodesDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuEpisodesKitsuRelationInputDto,
})
kitsu: CreateKitsuEpisodesKitsuRelationInputDto ;
}
