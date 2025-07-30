
import {ApiProperty} from '@nestjs/swagger'


export class TmdbSeasonEpisodeImagesDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
