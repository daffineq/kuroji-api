
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaGenreEdge} from '../../anilibriaGenreEdge/entities/anilibriaGenreEdge.entity.js'


export class AnilibriaGenre {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
preview: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
thumbnail: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
optimized_preview: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
optimized_thumbnail: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
genreEdges?: AnilibriaGenreEdge[] ;
}
