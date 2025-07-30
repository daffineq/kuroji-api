
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaTorrentTypeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
id?: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
torrentId?: number ;
}
