
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistRankingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
