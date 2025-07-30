
import {ApiProperty} from '@nestjs/swagger'


export class AnilistIndexerStateDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
lastFetchedPage: number ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
updatedAt: Date ;
}
