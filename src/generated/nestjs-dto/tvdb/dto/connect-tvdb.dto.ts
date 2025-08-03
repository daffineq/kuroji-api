
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTvdbDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
