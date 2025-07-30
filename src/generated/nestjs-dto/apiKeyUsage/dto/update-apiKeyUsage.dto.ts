
import {ApiProperty} from '@nestjs/swagger'




export class UpdateApiKeyUsageDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
endpoint?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
method?: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
origin?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
userAgent?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
ip?: string  | null;
}
