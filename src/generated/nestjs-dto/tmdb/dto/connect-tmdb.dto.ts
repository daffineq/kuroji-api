
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTmdbDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
