
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'

export class AnilistTagEdgeAnilistIdTagIdUniqueInputDto {
    @ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilistId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
tagId: number ;
  }

@ApiExtraModels(AnilistTagEdgeAnilistIdTagIdUniqueInputDto)
export class ConnectAnilistTagEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
id?: number ;
@ApiProperty({
  type: AnilistTagEdgeAnilistIdTagIdUniqueInputDto,
  required: false,
})
anilistId_tagId?: AnilistTagEdgeAnilistIdTagIdUniqueInputDto ;
}
