
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTmdbSeasonStillImageDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
