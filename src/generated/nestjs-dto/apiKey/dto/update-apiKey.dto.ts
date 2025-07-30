
import {ApiProperty} from '@nestjs/swagger'




export class UpdateApiKeyDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
key?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
whatFor?: string ;
}
