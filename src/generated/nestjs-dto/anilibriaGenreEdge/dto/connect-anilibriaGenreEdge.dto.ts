
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaGenreEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
