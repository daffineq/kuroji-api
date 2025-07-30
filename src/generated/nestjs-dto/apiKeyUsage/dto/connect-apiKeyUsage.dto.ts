
import {ApiProperty} from '@nestjs/swagger'




export class ConnectApiKeyUsageDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
}
