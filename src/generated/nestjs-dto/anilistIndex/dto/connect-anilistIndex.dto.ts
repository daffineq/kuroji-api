
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistIndexDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
}
