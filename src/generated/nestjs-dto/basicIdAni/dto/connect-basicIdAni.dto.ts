
import {ApiProperty} from '@nestjs/swagger'




export class ConnectBasicIdAniDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
