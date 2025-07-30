
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaTorrentDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
