
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAniZipDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
episodeCount?: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
specialCount?: number ;
}
