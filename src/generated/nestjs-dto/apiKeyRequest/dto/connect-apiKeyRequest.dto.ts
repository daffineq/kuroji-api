
import {ApiProperty} from '@nestjs/swagger'




export class ConnectApiKeyRequestDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
}
