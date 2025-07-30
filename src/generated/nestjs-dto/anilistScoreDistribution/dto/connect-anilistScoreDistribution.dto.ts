
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistScoreDistributionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
