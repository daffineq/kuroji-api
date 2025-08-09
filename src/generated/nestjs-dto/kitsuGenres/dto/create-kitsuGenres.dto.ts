
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto'

export class CreateKitsuGenresKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuGenresKitsuRelationInputDto)
export class CreateKitsuGenresDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuGenresKitsuRelationInputDto,
})
kitsu: CreateKitsuGenresKitsuRelationInputDto ;
}
