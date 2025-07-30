
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto.js'

export class CreateKitsuInstallmentsKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuInstallmentsKitsuRelationInputDto)
export class CreateKitsuInstallmentsDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuInstallmentsKitsuRelationInputDto,
})
kitsu: CreateKitsuInstallmentsKitsuRelationInputDto ;
}
