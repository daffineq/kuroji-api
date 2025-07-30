
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto.js'

export class CreateKitsuTitleKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuTitleKitsuRelationInputDto)
export class CreateKitsuTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
en?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
en_jp?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
ja_jp?: string  | null;
@ApiProperty({
  type: CreateKitsuTitleKitsuRelationInputDto,
})
kitsu: CreateKitsuTitleKitsuRelationInputDto ;
}
