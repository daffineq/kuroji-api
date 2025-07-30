
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaPublishDayDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
value: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
}
