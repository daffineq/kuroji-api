
import {ApiProperty} from '@nestjs/swagger'




export class UpdateReleasedOnDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
year?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
month?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
day?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
date?: string  | null;
}
