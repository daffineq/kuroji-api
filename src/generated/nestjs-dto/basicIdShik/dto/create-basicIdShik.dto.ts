
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateShikimoriDto} from '../../shikimori/dto/create-shikimori.dto'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto'

export class CreateBasicIdShikShikimoriRelationInputDto {
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

@ApiExtraModels(CreateShikimoriDto,ConnectShikimoriDto,CreateBasicIdShikShikimoriRelationInputDto)
export class CreateBasicIdShikDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
malId?: string  | null;
@ApiProperty({
  required: false,
  type: CreateBasicIdShikShikimoriRelationInputDto,
})
shikimori?: CreateBasicIdShikShikimoriRelationInputDto ;
}
