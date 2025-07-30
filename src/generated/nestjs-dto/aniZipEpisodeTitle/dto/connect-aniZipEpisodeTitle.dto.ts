
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'

export class AniZipEpisodeTitleEpisodeIdKeyUniqueInputDto {
    @ApiProperty({
  type: 'string',
})
episodeId: string ;
@ApiProperty({
  type: 'string',
})
key: string ;
  }

@ApiExtraModels(AniZipEpisodeTitleEpisodeIdKeyUniqueInputDto)
export class ConnectAniZipEpisodeTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: AniZipEpisodeTitleEpisodeIdKeyUniqueInputDto,
  required: false,
})
episodeId_key?: AniZipEpisodeTitleEpisodeIdKeyUniqueInputDto ;
}
