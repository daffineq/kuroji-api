
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto'

export class CreateKitsuCoverImageKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuCoverImageKitsuRelationInputDto)
export class CreateKitsuCoverImageDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
tiny?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
small?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
large?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
original?: string  | null;
@ApiProperty({
  type: CreateKitsuCoverImageKitsuRelationInputDto,
})
kitsu: CreateKitsuCoverImageKitsuRelationInputDto ;
}
