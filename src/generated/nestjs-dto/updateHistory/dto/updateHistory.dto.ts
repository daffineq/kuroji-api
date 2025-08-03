
import {ApiProperty} from '@nestjs/swagger'


export class UpdateHistoryDto {
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
  nullable: true,
})
duration: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
errorCount: number ;
@ApiProperty({
  type: 'string',
  isArray: true,
})
errors: string[] ;
@ApiProperty({
  type: 'string',
})
triggeredBy: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
createdAt: Date ;
}
