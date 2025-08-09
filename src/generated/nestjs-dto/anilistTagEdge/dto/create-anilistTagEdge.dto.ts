
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'
import {ConnectAnilistTagDto} from '../../anilistTag/dto/connect-anilistTag.dto'

export class CreateAnilistTagEdgeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }
export class CreateAnilistTagEdgeTagRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistTagDto,
})
connect: ConnectAnilistTagDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistTagEdgeAnilistRelationInputDto,ConnectAnilistTagDto,CreateAnilistTagEdgeTagRelationInputDto)
export class CreateAnilistTagEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
rank?: number  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isMediaSpoiler?: boolean  | null;
@ApiProperty({
  type: CreateAnilistTagEdgeAnilistRelationInputDto,
})
anilist: CreateAnilistTagEdgeAnilistRelationInputDto ;
@ApiProperty({
  type: CreateAnilistTagEdgeTagRelationInputDto,
})
tag: CreateAnilistTagEdgeTagRelationInputDto ;
}
