
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectTmdbDto} from '../../tmdb/dto/connect-tmdb.dto.js'
import {CreateTmdbSeasonEpisodeDto} from '../../tmdbSeasonEpisode/dto/create-tmdbSeasonEpisode.dto.js'
import {ConnectTmdbSeasonEpisodeDto} from '../../tmdbSeasonEpisode/dto/connect-tmdbSeasonEpisode.dto.js'

export class CreateTmdbSeasonShowRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbDto,
})
connect: ConnectTmdbDto ;
  }
export class CreateTmdbSeasonEpisodesRelationInputDto {
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

@ApiExtraModels(ConnectTmdbDto,CreateTmdbSeasonShowRelationInputDto,CreateTmdbSeasonEpisodeDto,ConnectTmdbSeasonEpisodeDto,CreateTmdbSeasonEpisodesRelationInputDto)
export class CreateTmdbSeasonDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
air_date?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
overview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
poster_path?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
season_number: number ;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
vote_average?: number  | null;
@ApiProperty({
  type: CreateTmdbSeasonShowRelationInputDto,
})
show: CreateTmdbSeasonShowRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbSeasonEpisodesRelationInputDto,
})
episodes?: CreateTmdbSeasonEpisodesRelationInputDto ;
}
