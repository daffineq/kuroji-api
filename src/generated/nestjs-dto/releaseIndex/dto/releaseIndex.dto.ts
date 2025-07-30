
import {ApiProperty} from '@nestjs/swagger'


export class ReleaseIndexDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
addedAt: Date ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
updatedAt: Date ;
}
