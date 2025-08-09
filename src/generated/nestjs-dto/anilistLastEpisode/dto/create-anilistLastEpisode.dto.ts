
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnilistLastEpisodeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistLastEpisodeAnilistRelationInputDto)
export class CreateAnilistLastEpisodeDto {
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
  type: CreateAnilistLastEpisodeAnilistRelationInputDto,
})
anilist: CreateAnilistLastEpisodeAnilistRelationInputDto ;
}
