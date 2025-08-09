
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnilistCoverAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistCoverAnilistRelationInputDto)
export class CreateAnilistCoverDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
color?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
large?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
medium?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
extraLarge?: string  | null;
@ApiProperty({
  type: CreateAnilistCoverAnilistRelationInputDto,
})
anilist: CreateAnilistCoverAnilistRelationInputDto ;
}
