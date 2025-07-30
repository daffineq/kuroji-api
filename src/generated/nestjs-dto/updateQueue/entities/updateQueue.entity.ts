
import {ApiProperty} from '@nestjs/swagger'


export class UpdateQueue {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
animeId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
malId: number  | null;
@ApiProperty({
  type: 'string',
})
priority: string ;
@ApiProperty({
  type: 'string',
})
reason: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
addedAt: Date ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
retries: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
lastError: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
createdAt: Date ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
updatedAt: Date ;
}
