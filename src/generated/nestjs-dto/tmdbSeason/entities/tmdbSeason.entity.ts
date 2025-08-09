
import {ApiProperty} from '@nestjs/swagger'
import {Tmdb} from '../../tmdb/entities/tmdb.entity'
import {TmdbSeasonEpisode} from '../../tmdbSeasonEpisode/entities/tmdbSeasonEpisode.entity'


export class TmdbSeason {
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
show_id: number ;
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
poster_path: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
season_number: number ;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
vote_average: number  | null;
@ApiProperty({
  type: () => Tmdb,
  required: false,
})
show?: Tmdb ;
@ApiProperty({
  type: () => TmdbSeasonEpisode,
  isArray: true,
  required: false,
})
episodes?: TmdbSeasonEpisode[] ;
}
