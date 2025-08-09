
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnilistLatestEpisodeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistLatestEpisodeAnilistRelationInputDto)
export class CreateAnilistLatestEpisodeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episode?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
airingAt?: number  | null;
@ApiProperty({
  type: CreateAnilistLatestEpisodeAnilistRelationInputDto,
})
anilist: CreateAnilistLatestEpisodeAnilistRelationInputDto ;
}
