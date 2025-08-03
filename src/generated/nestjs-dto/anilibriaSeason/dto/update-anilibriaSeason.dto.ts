
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaSeasonDto {
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
