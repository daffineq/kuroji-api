
import {ApiProperty} from '@nestjs/swagger'


export class AnilistIndexDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
updatedAt: Date ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
createdAt: Date ;
}
