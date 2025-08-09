
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity'
import {AnilibriaGenre} from '../../anilibriaGenre/entities/anilibriaGenre.entity'


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
  type: () => Anilibria,
  required: false,
})
anilibria?: Anilibria ;
@ApiProperty({
  type: () => AnilibriaGenre,
  required: false,
})
genre?: AnilibriaGenre ;
}
