
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'

export class AniZipTitleAniZipIdKeyUniqueInputDto {
    @ApiProperty({
  type: 'integer',
  format: 'int32',
})
aniZipId: number ;
@ApiProperty({
  type: 'string',
})
key: string ;
  }

@ApiExtraModels(AniZipTitleAniZipIdKeyUniqueInputDto)
export class ConnectAniZipTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: AniZipTitleAniZipIdKeyUniqueInputDto,
  required: false,
})
aniZipId_key?: AniZipTitleAniZipIdKeyUniqueInputDto ;
}
