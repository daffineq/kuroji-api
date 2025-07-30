
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaEpisode} from '../../anilibriaEpisode/entities/anilibriaEpisode.entity.js'


export class AnilibriaEpisodeEnding {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
})
episodeId: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
start: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
stop: number  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
episode?: AnilibriaEpisode ;
}
