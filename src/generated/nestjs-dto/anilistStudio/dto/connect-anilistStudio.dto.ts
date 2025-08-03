
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistStudioDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
