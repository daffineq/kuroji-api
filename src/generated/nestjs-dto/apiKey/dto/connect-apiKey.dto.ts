
import {ApiProperty} from '@nestjs/swagger'




export class ConnectApiKeyDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
key?: string ;
}
