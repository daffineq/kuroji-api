
import {ApiProperty} from '@nestjs/swagger'




export class ConnectKitsuCastingsDto {
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
