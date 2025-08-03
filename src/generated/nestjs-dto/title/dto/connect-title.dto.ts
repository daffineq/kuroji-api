
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTitleDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
