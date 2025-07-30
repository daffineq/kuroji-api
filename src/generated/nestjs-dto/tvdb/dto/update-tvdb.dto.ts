
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
slug?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
image?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
score?: number  | null;
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
lastUpdated?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
year?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
nameTranslations?: string[] ;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
overviewTranslations?: string[] ;
}
