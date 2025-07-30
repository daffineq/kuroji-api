
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaGenreDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
