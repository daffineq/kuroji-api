
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAnilistTagEdgeDto} from '../../anilistTagEdge/dto/create-anilistTagEdge.dto.js'
import {ConnectAnilistTagEdgeDto} from '../../anilistTagEdge/dto/connect-anilistTagEdge.dto.js'

export class CreateAnilistTagTagEdgesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistTagEdgeDto,
  isArray: true,
})
create?: CreateAnilistTagEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistTagEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistTagEdgeDto[] ;
  }

@ApiExtraModels(CreateAnilistTagEdgeDto,ConnectAnilistTagEdgeDto,CreateAnilistTagTagEdgesRelationInputDto)
export class CreateAnilistTagDto {
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
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
category?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isGeneralSpoiler?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isAdult?: boolean  | null;
@ApiProperty({
  required: false,
  type: CreateAnilistTagTagEdgesRelationInputDto,
})
tagEdges?: CreateAnilistTagTagEdgesRelationInputDto ;
}
