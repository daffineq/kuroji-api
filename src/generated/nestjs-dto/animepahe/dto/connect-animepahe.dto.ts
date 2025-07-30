
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnimepaheDto {
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
alId?: number ;
}
