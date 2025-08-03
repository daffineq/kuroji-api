
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistCharacterEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
