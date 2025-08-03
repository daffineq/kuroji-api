
import {ApiProperty} from '@nestjs/swagger'
import {KitsuImageDimensions} from '../../kitsuImageDimensions/entities/kitsuImageDimensions.entity.js'


export class KitsuDimension {
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
@ApiProperty({
  type: 'string',
  nullable: true,
})
tinyDimensionId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
smallDimensionId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
mediumDimensionId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
largeDimensionId: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
tinyDimension?: KitsuImageDimensions  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
smallDimension?: KitsuImageDimensions  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
mediumDimension?: KitsuImageDimensions  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
largeDimension?: KitsuImageDimensions  | null;
}
