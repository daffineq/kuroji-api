
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaPublishDayDto {
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
anilibriaId?: number ;
}
