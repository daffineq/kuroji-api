
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnilistExternalLinkAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistExternalLinkAnilistRelationInputDto)
export class CreateAnilistExternalLinkDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
site?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
siteId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
language?: string  | null;
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
icon?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
notes?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isDisabled?: boolean  | null;
@ApiProperty({
  type: CreateAnilistExternalLinkAnilistRelationInputDto,
})
anilist: CreateAnilistExternalLinkAnilistRelationInputDto ;
}
