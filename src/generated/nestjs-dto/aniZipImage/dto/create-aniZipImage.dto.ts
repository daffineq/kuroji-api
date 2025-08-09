
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAniZipDto} from '../../aniZip/dto/connect-aniZip.dto'

export class CreateAniZipImageAniZipRelationInputDto {
    @ApiProperty({
  type: ConnectAniZipDto,
})
connect: ConnectAniZipDto ;
  }

@ApiExtraModels(ConnectAniZipDto,CreateAniZipImageAniZipRelationInputDto)
export class CreateAniZipImageDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
coverType?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: CreateAniZipImageAniZipRelationInputDto,
})
aniZip: CreateAniZipImageAniZipRelationInputDto ;
}
