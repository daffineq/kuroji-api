
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistDto {
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
idMal?: number ;
}
