
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateShikimoriDto} from '../../shikimori/dto/create-shikimori.dto'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto'

export class CreateShikimoriVideoShikimoriRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateShikimoriDto,
  isArray: true,
})
create?: CreateShikimoriDto[] ;
@ApiProperty({
  required: false,
  type: ConnectShikimoriDto,
  isArray: true,
})
connect?: ConnectShikimoriDto[] ;
  }

@ApiExtraModels(CreateShikimoriDto,ConnectShikimoriDto,CreateShikimoriVideoShikimoriRelationInputDto)
export class CreateShikimoriVideoDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
kind?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
playerUrl?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
imageUrl?: string  | null;
@ApiProperty({
  required: false,
  type: CreateShikimoriVideoShikimoriRelationInputDto,
})
shikimori?: CreateShikimoriVideoShikimoriRelationInputDto ;
}
