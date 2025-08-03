
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaTypeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
value?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
}
