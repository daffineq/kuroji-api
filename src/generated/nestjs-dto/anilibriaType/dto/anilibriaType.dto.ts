
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaTypeDto {
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
description: string  | null;
}
