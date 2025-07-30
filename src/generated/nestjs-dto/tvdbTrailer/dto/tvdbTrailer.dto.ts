
import {ApiProperty} from '@nestjs/swagger'


export class TvdbTrailerDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
runtime: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
}
