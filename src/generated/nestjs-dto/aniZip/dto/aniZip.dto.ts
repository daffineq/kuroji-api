
import {ApiProperty} from '@nestjs/swagger'


export class AniZipDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
episodeCount: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
specialCount: number ;
}
