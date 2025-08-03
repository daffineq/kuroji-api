
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTmdbReleaseSeasonDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
