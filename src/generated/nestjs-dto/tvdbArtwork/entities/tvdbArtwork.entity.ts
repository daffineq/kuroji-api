
import {ApiProperty} from '@nestjs/swagger'
import {Tvdb} from '../../tvdb/entities/tvdb.entity'


export class TvdbArtwork {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
height: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
includesText: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
score: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
thumbnail: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
type: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
width: number  | null;
@ApiProperty({
  type: () => Tvdb,
  isArray: true,
  required: false,
})
tvdb?: Tvdb[] ;
}
