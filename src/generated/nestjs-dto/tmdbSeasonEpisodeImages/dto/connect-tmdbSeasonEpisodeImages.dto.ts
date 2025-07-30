
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTmdbSeasonEpisodeImagesDto {
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
episodeId?: number ;
}
