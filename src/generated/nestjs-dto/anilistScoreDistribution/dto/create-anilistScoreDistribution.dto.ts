
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnilistScoreDistributionAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistScoreDistributionAnilistRelationInputDto)
export class CreateAnilistScoreDistributionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
score: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
amount: number ;
@ApiProperty({
  type: CreateAnilistScoreDistributionAnilistRelationInputDto,
})
anilist: CreateAnilistScoreDistributionAnilistRelationInputDto ;
}
