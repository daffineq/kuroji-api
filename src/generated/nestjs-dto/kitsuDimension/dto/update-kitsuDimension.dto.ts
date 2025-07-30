
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuDimensionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
width?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
height?: number  | null;
}
