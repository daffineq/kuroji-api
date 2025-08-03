
import {ApiProperty} from '@nestjs/swagger'
import {TmdbNextEpisodeToAir} from '../../tmdbNextEpisodeToAir/entities/tmdbNextEpisodeToAir.entity.js'
import {TmdbLastEpisodeToAir} from '../../tmdbLastEpisodeToAir/entities/tmdbLastEpisodeToAir.entity.js'
import {TmdbReleaseSeason} from '../../tmdbReleaseSeason/entities/tmdbReleaseSeason.entity.js'
import {TmdbSeason} from '../../tmdbSeason/entities/tmdbSeason.entity.js'
import {TmdbSeasonEpisode} from '../../tmdbSeasonEpisode/entities/tmdbSeasonEpisode.entity.js'


export class Tmdb {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'boolean',
})
adult: boolean ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
backdrop_path: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  isArray: true,
})
episode_run_time: number[] ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
media_type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
first_air_date: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
homepage: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
in_production: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
last_air_date: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
number_of_episodes: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
number_of_seasons: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
original_language: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
original_name: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
origin_country: string[] ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
overview: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
popularity: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
poster_path: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
tagline: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
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
  nullable: true,
})
next_episode_to_air?: TmdbNextEpisodeToAir  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
last_episode_to_air?: TmdbLastEpisodeToAir  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
seasons?: TmdbReleaseSeason[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
episodeSeasons?: TmdbSeason[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
episodes?: TmdbSeasonEpisode[] ;
}
