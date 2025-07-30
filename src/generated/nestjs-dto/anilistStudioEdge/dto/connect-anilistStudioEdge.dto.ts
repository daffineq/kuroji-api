
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistStudioEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
