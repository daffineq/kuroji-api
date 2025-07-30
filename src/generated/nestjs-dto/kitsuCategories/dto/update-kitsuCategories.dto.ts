
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuCategoriesDto {
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
