
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateTmdbDto} from '../../tmdb/dto/create-tmdb.dto'
import {ConnectTmdbDto} from '../../tmdb/dto/connect-tmdb.dto'

export class CreateTmdbReleaseSeasonTmdbRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTmdbDto,
  isArray: true,
})
create?: CreateTmdbDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTmdbDto,
  isArray: true,
})
connect?: ConnectTmdbDto[] ;
  }

@ApiExtraModels(CreateTmdbDto,ConnectTmdbDto,CreateTmdbReleaseSeasonTmdbRelationInputDto)
export class CreateTmdbReleaseSeasonDto {
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
episode_count?: number  | null;
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
  required: false,
  type: CreateTmdbReleaseSeasonTmdbRelationInputDto,
})
tmdb?: CreateTmdbReleaseSeasonTmdbRelationInputDto ;
}
