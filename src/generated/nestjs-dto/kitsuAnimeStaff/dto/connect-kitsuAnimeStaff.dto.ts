
import {ApiProperty} from '@nestjs/swagger'




export class ConnectKitsuAnimeStaffDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
kitsuId?: string ;
}
