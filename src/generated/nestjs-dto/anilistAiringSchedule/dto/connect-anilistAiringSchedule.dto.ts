
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistAiringScheduleDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
