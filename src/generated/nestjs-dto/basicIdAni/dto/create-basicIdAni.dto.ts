
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAnilistDto} from '../../anilist/dto/create-anilist.dto'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateBasicIdAniAnilistRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistDto,
  isArray: true,
})
create?: CreateAnilistDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistDto,
  isArray: true,
})
connect?: ConnectAnilistDto[] ;
  }

@ApiExtraModels(CreateAnilistDto,ConnectAnilistDto,CreateBasicIdAniAnilistRelationInputDto)
export class CreateBasicIdAniDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
idMal?: number  | null;
@ApiProperty({
  required: false,
  type: CreateBasicIdAniAnilistRelationInputDto,
})
Anilist?: CreateBasicIdAniAnilistRelationInputDto ;
}
