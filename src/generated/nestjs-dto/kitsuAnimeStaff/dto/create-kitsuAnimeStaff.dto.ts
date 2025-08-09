
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto'

export class CreateKitsuAnimeStaffKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuAnimeStaffKitsuRelationInputDto)
export class CreateKitsuAnimeStaffDto {
  @ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: CreateKitsuAnimeStaffKitsuRelationInputDto,
})
kitsu: CreateKitsuAnimeStaffKitsuRelationInputDto ;
}
