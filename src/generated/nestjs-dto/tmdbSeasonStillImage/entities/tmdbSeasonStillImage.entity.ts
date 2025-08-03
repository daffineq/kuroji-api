
import {ApiProperty} from '@nestjs/swagger'
import {TmdbSeasonEpisodeImages} from '../../tmdbSeasonEpisodeImages/entities/tmdbSeasonEpisodeImages.entity.js'


export class TmdbSeasonStillImage {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
aspect_ratio: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
height: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
width: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
iso_639_1: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
file_path: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
vote_average: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
vote_count: number  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
tmdbEpisodeImages?: TmdbSeasonEpisodeImages ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
episodeImagesId: number ;
}
