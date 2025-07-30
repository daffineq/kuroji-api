
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAniZipDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
