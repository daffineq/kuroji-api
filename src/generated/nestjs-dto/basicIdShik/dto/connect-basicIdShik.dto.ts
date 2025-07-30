
import {ApiProperty} from '@nestjs/swagger'




export class ConnectBasicIdShikDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
}
