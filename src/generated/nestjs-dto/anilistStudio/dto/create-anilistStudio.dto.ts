
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAnilistStudioEdgeDto} from '../../anilistStudioEdge/dto/create-anilistStudioEdge.dto'
import {ConnectAnilistStudioEdgeDto} from '../../anilistStudioEdge/dto/connect-anilistStudioEdge.dto'

export class CreateAnilistStudioAnimeLinksRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistStudioEdgeDto,
  isArray: true,
})
create?: CreateAnilistStudioEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistStudioEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistStudioEdgeDto[] ;
  }

@ApiExtraModels(CreateAnilistStudioEdgeDto,ConnectAnilistStudioEdgeDto,CreateAnilistStudioAnimeLinksRelationInputDto)
export class CreateAnilistStudioDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnilistStudioAnimeLinksRelationInputDto,
})
animeLinks?: CreateAnilistStudioAnimeLinksRelationInputDto ;
}
