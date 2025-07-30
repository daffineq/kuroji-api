
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTmdbSeasonDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
