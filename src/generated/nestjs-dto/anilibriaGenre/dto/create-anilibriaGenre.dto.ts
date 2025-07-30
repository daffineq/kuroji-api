
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAnilibriaGenreEdgeDto} from '../../anilibriaGenreEdge/dto/create-anilibriaGenreEdge.dto.js'
import {ConnectAnilibriaGenreEdgeDto} from '../../anilibriaGenreEdge/dto/connect-anilibriaGenreEdge.dto.js'

export class CreateAnilibriaGenreGenreEdgesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilibriaGenreEdgeDto,
  isArray: true,
})
create?: CreateAnilibriaGenreEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilibriaGenreEdgeDto,
  isArray: true,
})
connect?: ConnectAnilibriaGenreEdgeDto[] ;
  }

@ApiExtraModels(CreateAnilibriaGenreEdgeDto,ConnectAnilibriaGenreEdgeDto,CreateAnilibriaGenreGenreEdgesRelationInputDto)
export class CreateAnilibriaGenreDto {
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
preview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
thumbnail?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
optimized_preview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
optimized_thumbnail?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnilibriaGenreGenreEdgesRelationInputDto,
})
genreEdges?: CreateAnilibriaGenreGenreEdgesRelationInputDto ;
}
