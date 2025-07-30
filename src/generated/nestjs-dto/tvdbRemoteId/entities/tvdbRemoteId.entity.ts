
import {ApiProperty} from '@nestjs/swagger'
import {Tvdb} from '../../tvdb/entities/tvdb.entity.js'


export class TvdbRemoteId {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
type: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
sourceName: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
tvdb?: Tvdb[] ;
}
