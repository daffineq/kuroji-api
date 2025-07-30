
import {ApiProperty} from '@nestjs/swagger'




export class UpdateUpdateQueueDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
animeId?: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
malId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
})
priority?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
reason?: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
lastError?: string  | null;
}
