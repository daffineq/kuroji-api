
import {ApiProperty} from '@nestjs/swagger'
import {Tvdb} from '../../tvdb/entities/tvdb.entity.js'


export class TvdbAlias {
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
language: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
tvdb?: Tvdb[] ;
}
