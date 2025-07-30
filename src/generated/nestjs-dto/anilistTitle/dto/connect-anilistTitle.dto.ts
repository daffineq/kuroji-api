
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistTitleDto {
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
anilistId?: number ;
}
