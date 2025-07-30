
import {ApiProperty} from '@nestjs/swagger'
import {TmdbSeasonStillImage} from '../../tmdbSeasonStillImage/entities/tmdbSeasonStillImage.entity.js'
import {TmdbSeasonEpisode} from '../../tmdbSeasonEpisode/entities/tmdbSeasonEpisode.entity.js'


export class TmdbSeasonEpisodeImages {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
episodeId: number ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
stills?: TmdbSeasonStillImage[] ;
@ApiProperty({
  type: () => Object,
  required: false,
})
episode?: TmdbSeasonEpisode ;
}
