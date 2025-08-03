
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto.js'

export class CreateKitsuMediaRelationshipsKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuMediaRelationshipsKitsuRelationInputDto)
export class CreateKitsuMediaRelationshipsDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuMediaRelationshipsKitsuRelationInputDto,
})
kitsu: CreateKitsuMediaRelationshipsKitsuRelationInputDto ;
}
