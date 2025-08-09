
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateTmdbSeasonStillImageDto} from '../../tmdbSeasonStillImage/dto/create-tmdbSeasonStillImage.dto'
import {ConnectTmdbSeasonStillImageDto} from '../../tmdbSeasonStillImage/dto/connect-tmdbSeasonStillImage.dto'
import {ConnectTmdbSeasonEpisodeDto} from '../../tmdbSeasonEpisode/dto/connect-tmdbSeasonEpisode.dto'

export class CreateTmdbSeasonEpisodeImagesStillsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateTmdbSeasonStillImageDto,
  isArray: true,
})
create?: CreateTmdbSeasonStillImageDto[] ;
@ApiProperty({
  required: false,
  type: ConnectTmdbSeasonStillImageDto,
  isArray: true,
})
connect?: ConnectTmdbSeasonStillImageDto[] ;
  }
export class CreateTmdbSeasonEpisodeImagesEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectTmdbSeasonEpisodeDto,
})
connect: ConnectTmdbSeasonEpisodeDto ;
  }

@ApiExtraModels(CreateTmdbSeasonStillImageDto,ConnectTmdbSeasonStillImageDto,CreateTmdbSeasonEpisodeImagesStillsRelationInputDto,ConnectTmdbSeasonEpisodeDto,CreateTmdbSeasonEpisodeImagesEpisodeRelationInputDto)
export class CreateTmdbSeasonEpisodeImagesDto {
  @ApiProperty({
  required: false,
  type: CreateTmdbSeasonEpisodeImagesStillsRelationInputDto,
})
stills?: CreateTmdbSeasonEpisodeImagesStillsRelationInputDto ;
@ApiProperty({
  type: CreateTmdbSeasonEpisodeImagesEpisodeRelationInputDto,
})
episode: CreateTmdbSeasonEpisodeImagesEpisodeRelationInputDto ;
}
