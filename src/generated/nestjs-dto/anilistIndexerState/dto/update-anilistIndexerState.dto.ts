
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistIndexerStateDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
lastFetchedPage?: number ;
}
