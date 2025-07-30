
import {ApiProperty} from '@nestjs/swagger'




export class ConnectKitsuImageDimensionsDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
posterImageId?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
coverImageId?: string ;
}
