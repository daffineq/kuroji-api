
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAniZipEpisodeDto} from '../../aniZipEpisode/dto/connect-aniZipEpisode.dto'

export class CreateAniZipEpisodeTitleEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectAniZipEpisodeDto,
})
connect: ConnectAniZipEpisodeDto ;
  }

@ApiExtraModels(ConnectAniZipEpisodeDto,CreateAniZipEpisodeTitleEpisodeRelationInputDto)
export class CreateAniZipEpisodeTitleDto {
  @ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: CreateAniZipEpisodeTitleEpisodeRelationInputDto,
})
episode: CreateAniZipEpisodeTitleEpisodeRelationInputDto ;
}
