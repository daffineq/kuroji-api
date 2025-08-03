
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnilistNextEpisodeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistNextEpisodeAnilistRelationInputDto)
export class CreateAnilistNextEpisodeDto {
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
  type: CreateAnilistNextEpisodeAnilistRelationInputDto,
})
anilist: CreateAnilistNextEpisodeAnilistRelationInputDto ;
}
