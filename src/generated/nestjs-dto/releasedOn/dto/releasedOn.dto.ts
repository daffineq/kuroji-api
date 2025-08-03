
import {ApiProperty} from '@nestjs/swagger'


export class ReleasedOnDto {
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
year: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
month: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
day: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
date: string  | null;
}
