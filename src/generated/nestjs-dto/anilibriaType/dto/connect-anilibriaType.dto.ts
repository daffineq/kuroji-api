
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaTypeDto {
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
