
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuMediaRelationshipsDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
selfLink?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
related?: string ;
}
