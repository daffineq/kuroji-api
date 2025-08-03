
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTvdbLoginDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
