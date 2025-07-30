
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbLanguageTranslationDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
tvdbId?: number ;
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
overview?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isAlias?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isPrimary?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
language?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
tagline?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
aliases?: string[] ;
}
