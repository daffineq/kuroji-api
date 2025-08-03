
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto.js'

export class CreateKitsuPosterImageKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }

@ApiExtraModels(ConnectKitsuDto,CreateKitsuPosterImageKitsuRelationInputDto)
export class CreateKitsuPosterImageDto {
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
medium?: string  | null;
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
  type: CreateKitsuPosterImageKitsuRelationInputDto,
})
kitsu: CreateKitsuPosterImageKitsuRelationInputDto ;
}
