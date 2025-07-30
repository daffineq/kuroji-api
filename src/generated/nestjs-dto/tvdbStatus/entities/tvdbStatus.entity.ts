
import {ApiProperty} from '@nestjs/swagger'
import {Tvdb} from '../../tvdb/entities/tvdb.entity.js'


export class TvdbStatus {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
tvdbId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
recordType: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
keepUpdated: boolean  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
tvdb?: Tvdb ;
}
