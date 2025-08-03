
import {ApiProperty} from '@nestjs/swagger'


export class TvdbLanguageTranslation {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
tvdbId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
overview: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isAlias: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isPrimary: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
tagline: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
aliases: string[] ;
}
