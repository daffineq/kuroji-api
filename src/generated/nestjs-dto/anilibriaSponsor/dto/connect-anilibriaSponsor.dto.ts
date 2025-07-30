
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaSponsorDto {
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
anilibriaId?: number ;
}
