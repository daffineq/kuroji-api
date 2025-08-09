
import {ApiProperty} from '@nestjs/swagger'
import {Shikimori} from '../../shikimori/entities/shikimori.entity'


export class AiredOn {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
})
shikimoriId: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
year: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
month: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
day: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
date: string  | null;
@ApiProperty({
  type: () => Shikimori,
  required: false,
})
shikimori?: Shikimori ;
}
