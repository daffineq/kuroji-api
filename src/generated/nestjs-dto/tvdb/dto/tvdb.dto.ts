
import {ApiProperty} from '@nestjs/swagger'


export class TvdbDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
slug: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
score: number  | null;
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
lastUpdated: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
year: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
nameTranslations: string[] ;
@ApiProperty({
  type: 'string',
  isArray: true,
})
overviewTranslations: string[] ;
}
