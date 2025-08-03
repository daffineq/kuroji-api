
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'

export class AniZipEpisodeAniZipIdEpisodeKeyUniqueInputDto {
    @ApiProperty({
  type: 'integer',
  format: 'int32',
})
aniZipId: number ;
@ApiProperty({
  type: 'string',
})
episodeKey: string ;
  }

@ApiExtraModels(AniZipEpisodeAniZipIdEpisodeKeyUniqueInputDto)
export class ConnectAniZipEpisodeDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: AniZipEpisodeAniZipIdEpisodeKeyUniqueInputDto,
  required: false,
})
aniZipId_episodeKey?: AniZipEpisodeAniZipIdEpisodeKeyUniqueInputDto ;
}
