
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnilistStatusDistributionAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistStatusDistributionAnilistRelationInputDto)
export class CreateAnilistStatusDistributionDto {
  @ApiProperty({
  type: 'string',
})
status: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
amount: number ;
@ApiProperty({
  type: CreateAnilistStatusDistributionAnilistRelationInputDto,
})
anilist: CreateAnilistStatusDistributionAnilistRelationInputDto ;
}
