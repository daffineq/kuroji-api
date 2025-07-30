
import {ApiProperty} from '@nestjs/swagger'




export class ConnectUserDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
email?: string ;
}
