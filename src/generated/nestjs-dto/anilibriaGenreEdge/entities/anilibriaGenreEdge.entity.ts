
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity.js'
import {AnilibriaGenre} from '../../anilibriaGenre/entities/anilibriaGenre.entity.js'


export class AnilibriaGenreEdge {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilibriaId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
genreId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
total_releases: number  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilibria?: Anilibria ;
@ApiProperty({
  type: () => Object,
  required: false,
})
genre?: AnilibriaGenre ;
}
