
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateAnilistTrailerAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistTrailerAnilistRelationInputDto)
export class CreateAnilistTrailerDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
site?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
thumbnail?: string  | null;
@ApiProperty({
  type: CreateAnilistTrailerAnilistRelationInputDto,
})
anilist: CreateAnilistTrailerAnilistRelationInputDto ;
}
