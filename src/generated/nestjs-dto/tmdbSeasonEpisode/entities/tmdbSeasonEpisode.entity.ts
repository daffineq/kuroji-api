
import {ApiProperty} from '@nestjs/swagger'
import {Tmdb} from '../../tmdb/entities/tmdb.entity.js'
import {TmdbSeason} from '../../tmdbSeason/entities/tmdbSeason.entity.js'
import {TmdbSeasonEpisodeImages} from '../../tmdbSeasonEpisodeImages/entities/tmdbSeasonEpisodeImages.entity.js'


export class TmdbSeasonEpisode {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
air_date: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
episode_number: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
episode_type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
overview: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
production_code: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
runtime: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
season_number: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
show_id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
season_id: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
still_path: string  | null;
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
show?: Tmdb ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
tmdbSeason?: TmdbSeason  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
images?: TmdbSeasonEpisodeImages  | null;
}
