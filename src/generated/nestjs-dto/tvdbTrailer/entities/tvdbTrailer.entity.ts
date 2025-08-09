
import {ApiProperty} from '@nestjs/swagger'
import {Tvdb} from '../../tvdb/entities/tvdb.entity'


export class TvdbTrailer {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
runtime: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
@ApiProperty({
  type: () => Tvdb,
  isArray: true,
  required: false,
})
tvdb?: Tvdb[] ;
}
