
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistCharacterNameDto} from '../../anilistCharacterName/dto/connect-anilistCharacterName.dto'
import {ConnectAnilistCharacterImageDto} from '../../anilistCharacterImage/dto/connect-anilistCharacterImage.dto'
import {CreateAnilistCharacterEdgeDto} from '../../anilistCharacterEdge/dto/create-anilistCharacterEdge.dto'
import {ConnectAnilistCharacterEdgeDto} from '../../anilistCharacterEdge/dto/connect-anilistCharacterEdge.dto'

export class CreateAnilistCharacterNameRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistCharacterNameDto,
})
connect: ConnectAnilistCharacterNameDto ;
  }
export class CreateAnilistCharacterImageRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistCharacterImageDto,
})
connect: ConnectAnilistCharacterImageDto ;
  }
export class CreateAnilistCharacterAnimeLinksRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistCharacterEdgeDto,
  isArray: true,
})
create?: CreateAnilistCharacterEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistCharacterEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistCharacterEdgeDto[] ;
  }

@ApiExtraModels(ConnectAnilistCharacterNameDto,CreateAnilistCharacterNameRelationInputDto,ConnectAnilistCharacterImageDto,CreateAnilistCharacterImageRelationInputDto,CreateAnilistCharacterEdgeDto,ConnectAnilistCharacterEdgeDto,CreateAnilistCharacterAnimeLinksRelationInputDto)
export class CreateAnilistCharacterDto {
  @ApiProperty({
  required: false,
  type: CreateAnilistCharacterNameRelationInputDto,
})
name?: CreateAnilistCharacterNameRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistCharacterImageRelationInputDto,
})
image?: CreateAnilistCharacterImageRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistCharacterAnimeLinksRelationInputDto,
})
animeLinks?: CreateAnilistCharacterAnimeLinksRelationInputDto ;
}
