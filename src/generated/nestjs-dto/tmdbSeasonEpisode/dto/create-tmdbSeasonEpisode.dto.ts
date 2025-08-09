
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectTmdbDto} from '../../tmdb/dto/connect-tmdb.dto'
import {ConnectTmdbSeasonDto} from '../../tmdbSeason/dto/connect-tmdbSeason.dto'
import {ConnectTmdbSeasonEpisodeImagesDto} from '../../tmdbSeasonEpisodeImages/dto/connect-tmdbSeasonEpisodeImages.dto'

export class CreateTmdbSeasonEpisodeShowRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbDto,
})
connect: ConnectTmdbDto ;
  }
export class CreateTmdbSeasonEpisodeTmdbSeasonRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbSeasonDto,
})
connect: ConnectTmdbSeasonDto ;
  }
export class CreateTmdbSeasonEpisodeImagesRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbSeasonEpisodeImagesDto,
})
connect: ConnectTmdbSeasonEpisodeImagesDto ;
  }

@ApiExtraModels(ConnectTmdbDto,CreateTmdbSeasonEpisodeShowRelationInputDto,ConnectTmdbSeasonDto,CreateTmdbSeasonEpisodeTmdbSeasonRelationInputDto,ConnectTmdbSeasonEpisodeImagesDto,CreateTmdbSeasonEpisodeImagesRelationInputDto)
export class CreateTmdbSeasonEpisodeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
air_date?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
episode_number: number ;
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
})
season_number: number ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
still_path?: string  | null;
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
  type: CreateTmdbSeasonEpisodeShowRelationInputDto,
})
show: CreateTmdbSeasonEpisodeShowRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbSeasonEpisodeTmdbSeasonRelationInputDto,
})
tmdbSeason?: CreateTmdbSeasonEpisodeTmdbSeasonRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateTmdbSeasonEpisodeImagesRelationInputDto,
})
images?: CreateTmdbSeasonEpisodeImagesRelationInputDto ;
}
