
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistStatusDistributionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
