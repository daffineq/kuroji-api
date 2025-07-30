
import {ApiProperty} from '@nestjs/swagger'




export class ConnectKitsuDimensionDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
tinyDimensionId?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
smallDimensionId?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
mediumDimensionId?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
largeDimensionId?: string ;
}
