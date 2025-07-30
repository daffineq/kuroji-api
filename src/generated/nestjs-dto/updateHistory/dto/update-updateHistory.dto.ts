
import {ApiProperty} from '@nestjs/swagger'




export class UpdateUpdateHistoryDto {
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
  isArray: true,
  required: false,
})
providers?: string[] ;
@ApiProperty({
  type: 'boolean',
  required: false,
})
success?: boolean ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
duration?: number  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
errors?: string[] ;
@ApiProperty({
  type: 'string',
  required: false,
})
triggeredBy?: string ;
}
