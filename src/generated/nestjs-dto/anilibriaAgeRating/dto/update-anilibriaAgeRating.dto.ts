
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaAgeRatingDto {
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
label?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_adult?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
}
