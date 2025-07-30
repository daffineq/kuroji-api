
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectTmdbDto} from '../../tmdb/dto/connect-tmdb.dto.js'

export class CreateTmdbLastEpisodeToAirTmdbLastRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbDto,
})
connect: ConnectTmdbDto ;
  }

@ApiExtraModels(ConnectTmdbDto,CreateTmdbLastEpisodeToAirTmdbLastRelationInputDto)
export class CreateTmdbLastEpisodeToAirDto {
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
  type: 'string',
  required: false,
  nullable: true,
})
air_date?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episode_number?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
episode_type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
production_code?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
runtime?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
season_number?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
still_path?: string  | null;
@ApiProperty({
  required: false,
  type: CreateTmdbLastEpisodeToAirTmdbLastRelationInputDto,
})
tmdb_last?: CreateTmdbLastEpisodeToAirTmdbLastRelationInputDto ;
}
