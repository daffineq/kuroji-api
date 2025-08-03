
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuAnimeStaffDto {
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
