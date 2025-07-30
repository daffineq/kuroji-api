
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectTmdbNextEpisodeToAirDto} from '../../tmdbNextEpisodeToAir/dto/connect-tmdbNextEpisodeToAir.dto.js'
import {ConnectTmdbLastEpisodeToAirDto} from '../../tmdbLastEpisodeToAir/dto/connect-tmdbLastEpisodeToAir.dto.js'
import {CreateTmdbReleaseSeasonDto} from '../../tmdbReleaseSeason/dto/create-tmdbReleaseSeason.dto.js'
import {ConnectTmdbReleaseSeasonDto} from '../../tmdbReleaseSeason/dto/connect-tmdbReleaseSeason.dto.js'
import {CreateTmdbSeasonDto} from '../../tmdbSeason/dto/create-tmdbSeason.dto.js'
import {ConnectTmdbSeasonDto} from '../../tmdbSeason/dto/connect-tmdbSeason.dto.js'
import {CreateTmdbSeasonEpisodeDto} from '../../tmdbSeasonEpisode/dto/create-tmdbSeasonEpisode.dto.js'
import {ConnectTmdbSeasonEpisodeDto} from '../../tmdbSeasonEpisode/dto/connect-tmdbSeasonEpisode.dto.js'

export class CreateTmdbNextEpisodeToAirRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbNextEpisodeToAirDto,
})
connect: ConnectTmdbNextEpisodeToAirDto ;
  }
export class CreateTmdbLastEpisodeToAirRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbLastEpisodeToAirDto,
})
connect: ConnectTmdbLastEpisodeToAirDto ;
  }
export class CreateTmdbSeasonsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTmdbReleaseSeasonDto,
  isArray: true,
})
create?: CreateTmdbReleaseSeasonDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTmdbReleaseSeasonDto,
  isArray: true,
})
connect?: ConnectTmdbReleaseSeasonDto[] ;
  }
export class CreateTmdbEpisodeSeasonsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTmdbSeasonDto,
  isArray: true,
})
create?: CreateTmdbSeasonDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTmdbSeasonDto,
  isArray: true,
})
connect?: ConnectTmdbSeasonDto[] ;
  }
export class CreateTmdbEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTmdbSeasonEpisodeDto,
  isArray: true,
})
create?: CreateTmdbSeasonEpisodeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTmdbSeasonEpisodeDto,
  isArray: true,
})
connect?: ConnectTmdbSeasonEpisodeDto[] ;
  }

@ApiExtraModels(ConnectTmdbNextEpisodeToAirDto,CreateTmdbNextEpisodeToAirRelationInputDto,ConnectTmdbLastEpisodeToAirDto,CreateTmdbLastEpisodeToAirRelationInputDto,CreateTmdbReleaseSeasonDto,ConnectTmdbReleaseSeasonDto,CreateTmdbSeasonsRelationInputDto,CreateTmdbSeasonDto,ConnectTmdbSeasonDto,CreateTmdbEpisodeSeasonsRelationInputDto,CreateTmdbSeasonEpisodeDto,ConnectTmdbSeasonEpisodeDto,CreateTmdbEpisodesRelationInputDto)
export class CreateTmdbDto {
  @ApiProperty({
  type: 'boolean',
})
adult: boolean ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
backdrop_path?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  isArray: true,
})
episode_run_time: number[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
media_type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
first_air_date?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
homepage?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
in_production?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
last_air_date?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
number_of_episodes?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
number_of_seasons?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
original_language?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
original_name?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
origin_country: string[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
overview?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
popularity?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
poster_path?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
tagline?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
status?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
vote_average?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
vote_count?: number  | null;
@ApiProperty({
  required: false,
  type: CreateTmdbNextEpisodeToAirRelationInputDto,
})
next_episode_to_air?: CreateTmdbNextEpisodeToAirRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbLastEpisodeToAirRelationInputDto,
})
last_episode_to_air?: CreateTmdbLastEpisodeToAirRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbSeasonsRelationInputDto,
})
seasons?: CreateTmdbSeasonsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbEpisodeSeasonsRelationInputDto,
})
episodeSeasons?: CreateTmdbEpisodeSeasonsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbEpisodesRelationInputDto,
})
episodes?: CreateTmdbEpisodesRelationInputDto ;
}
