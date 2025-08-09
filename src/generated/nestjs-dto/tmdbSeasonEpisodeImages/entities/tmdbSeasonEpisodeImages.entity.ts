
import {ApiProperty} from '@nestjs/swagger'
import {TmdbSeasonStillImage} from '../../tmdbSeasonStillImage/entities/tmdbSeasonStillImage.entity'
import {TmdbSeasonEpisode} from '../../tmdbSeasonEpisode/entities/tmdbSeasonEpisode.entity'


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
  type: () => TmdbSeasonStillImage,
  isArray: true,
  required: false,
})
stills?: TmdbSeasonStillImage[] ;
@ApiProperty({
  type: () => TmdbSeasonEpisode,
  required: false,
})
episode?: TmdbSeasonEpisode ;
}
