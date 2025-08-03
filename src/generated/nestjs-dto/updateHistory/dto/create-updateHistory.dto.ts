
import {ApiProperty} from '@nestjs/swagger'




export class CreateUpdateHistoryDto {
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
  isArray: true,
})
providers: string[] ;
@ApiProperty({
  type: 'boolean',
})
success: boolean ;
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
})
errors: string[] ;
@ApiProperty({
  type: 'string',
})
triggeredBy: string ;
}
