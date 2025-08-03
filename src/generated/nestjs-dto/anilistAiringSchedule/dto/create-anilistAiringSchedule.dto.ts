
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnilistAiringScheduleAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistAiringScheduleAnilistRelationInputDto)
export class CreateAnilistAiringScheduleDto {
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
  type: CreateAnilistAiringScheduleAnilistRelationInputDto,
})
anilist: CreateAnilistAiringScheduleAnilistRelationInputDto ;
}
