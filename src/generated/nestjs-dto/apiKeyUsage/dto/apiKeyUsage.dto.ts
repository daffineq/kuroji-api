
import {ApiProperty} from '@nestjs/swagger'


export class ApiKeyUsageDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
endpoint: string ;
@ApiProperty({
  type: 'string',
})
method: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
origin: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
userAgent: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
ip: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
usedAt: Date ;
}
