
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTvdbRemoteIdDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
}
