
import {ApiProperty} from '@nestjs/swagger'




export class CreateUpdateQueueDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
animeId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
malId?: number  | null;
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
  required: false,
  nullable: true,
})
lastError?: string  | null;
}
