
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity.js'


export class AnilibriaName {
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
main: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
english: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
alternative: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilibria?: Anilibria ;
}
