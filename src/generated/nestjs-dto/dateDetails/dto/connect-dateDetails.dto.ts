
import {ApiProperty} from '@nestjs/swagger'




export class ConnectDateDetailsDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
