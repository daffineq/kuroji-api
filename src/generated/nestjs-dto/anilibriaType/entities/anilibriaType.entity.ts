
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity.js'


export class AnilibriaType {
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
value: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilibria?: Anilibria ;
}
