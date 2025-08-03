
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTmdbSeasonEpisodeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
