
import {ApiProperty} from '@nestjs/swagger'


export class StartDateDto {
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
day: number  | null;
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
year: number  | null;
}
