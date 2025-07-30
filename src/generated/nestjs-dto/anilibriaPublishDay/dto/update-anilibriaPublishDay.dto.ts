
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaPublishDayDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
value?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
}
