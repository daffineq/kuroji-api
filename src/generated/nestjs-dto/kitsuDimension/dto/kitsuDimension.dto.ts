
import {ApiProperty} from '@nestjs/swagger'


export class KitsuDimensionDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
width: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
height: number  | null;
}
