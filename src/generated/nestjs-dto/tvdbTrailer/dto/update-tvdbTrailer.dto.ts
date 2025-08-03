
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbTrailerDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
runtime?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
language?: string  | null;
}
