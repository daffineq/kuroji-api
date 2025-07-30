
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistTrailerDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
anilistId?: number ;
}
