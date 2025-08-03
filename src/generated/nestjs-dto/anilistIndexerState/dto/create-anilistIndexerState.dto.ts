
import {ApiProperty} from '@nestjs/swagger'




export class CreateAnilistIndexerStateDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
lastFetchedPage: number ;
}
