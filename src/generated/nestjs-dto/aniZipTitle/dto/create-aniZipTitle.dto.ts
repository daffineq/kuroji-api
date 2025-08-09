
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAniZipDto} from '../../aniZip/dto/connect-aniZip.dto'

export class CreateAniZipTitleAniZipRelationInputDto {
    @ApiProperty({
  type: ConnectAniZipDto,
})
connect: ConnectAniZipDto ;
  }

@ApiExtraModels(ConnectAniZipDto,CreateAniZipTitleAniZipRelationInputDto)
export class CreateAniZipTitleDto {
  @ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: CreateAniZipTitleAniZipRelationInputDto,
})
aniZip: CreateAniZipTitleAniZipRelationInputDto ;
}
