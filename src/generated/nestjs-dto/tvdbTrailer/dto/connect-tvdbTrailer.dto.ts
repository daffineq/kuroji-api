
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTvdbTrailerDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
