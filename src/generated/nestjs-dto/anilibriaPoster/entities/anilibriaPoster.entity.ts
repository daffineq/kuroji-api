
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity'


export class AnilibriaPoster {
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
  type: () => Anilibria,
  required: false,
})
anilibria?: Anilibria ;
}
