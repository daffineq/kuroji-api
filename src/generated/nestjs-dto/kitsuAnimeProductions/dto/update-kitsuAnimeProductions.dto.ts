
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuAnimeProductionsDto {
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
