
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto'
import {ConnectAnilibriaGenreDto} from '../../anilibriaGenre/dto/connect-anilibriaGenre.dto'

export class CreateAnilibriaGenreEdgeAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }
export class CreateAnilibriaGenreEdgeGenreRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaGenreDto,
})
connect: ConnectAnilibriaGenreDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaGenreEdgeAnilibriaRelationInputDto,ConnectAnilibriaGenreDto,CreateAnilibriaGenreEdgeGenreRelationInputDto)
export class CreateAnilibriaGenreEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
total_releases?: number  | null;
@ApiProperty({
  type: CreateAnilibriaGenreEdgeAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaGenreEdgeAnilibriaRelationInputDto ;
@ApiProperty({
  type: CreateAnilibriaGenreEdgeGenreRelationInputDto,
})
genre: CreateAnilibriaGenreEdgeGenreRelationInputDto ;
}
