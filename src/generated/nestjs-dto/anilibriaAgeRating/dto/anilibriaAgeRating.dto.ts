
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaAgeRatingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
value: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
label: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
is_adult: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
}
