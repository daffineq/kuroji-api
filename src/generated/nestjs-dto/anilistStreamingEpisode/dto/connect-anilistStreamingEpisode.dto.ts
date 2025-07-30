
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistStreamingEpisodeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
