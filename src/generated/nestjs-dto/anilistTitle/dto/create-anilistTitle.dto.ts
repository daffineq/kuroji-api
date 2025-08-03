
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnilistTitleAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistTitleAnilistRelationInputDto)
export class CreateAnilistTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
romaji?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
english?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
native?: string  | null;
@ApiProperty({
  type: CreateAnilistTitleAnilistRelationInputDto,
})
anilist: CreateAnilistTitleAnilistRelationInputDto ;
}
