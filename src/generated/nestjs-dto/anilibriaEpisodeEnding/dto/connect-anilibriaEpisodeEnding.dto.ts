
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaEpisodeEndingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
id?: number ;
@ApiProperty({
  type: 'string',
  required: false,
})
episodeId?: string ;
}
