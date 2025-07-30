
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'
import {ConnectAnilistStudioDto} from '../../anilistStudio/dto/connect-anilistStudio.dto.js'

export class CreateAnilistStudioEdgeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }
export class CreateAnilistStudioEdgeStudioRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistStudioDto,
})
connect: ConnectAnilistStudioDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistStudioEdgeAnilistRelationInputDto,ConnectAnilistStudioDto,CreateAnilistStudioEdgeStudioRelationInputDto)
export class CreateAnilistStudioEdgeDto {
  @ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isMain?: boolean  | null;
@ApiProperty({
  type: CreateAnilistStudioEdgeAnilistRelationInputDto,
})
anilist: CreateAnilistStudioEdgeAnilistRelationInputDto ;
@ApiProperty({
  type: CreateAnilistStudioEdgeStudioRelationInputDto,
})
studio: CreateAnilistStudioEdgeStudioRelationInputDto ;
}
