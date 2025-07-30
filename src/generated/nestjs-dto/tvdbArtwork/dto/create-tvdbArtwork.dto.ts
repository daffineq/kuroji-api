
import {ApiProperty} from '@nestjs/swagger'




export class CreateTvdbArtworkDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
height?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
image?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
includesText?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
language?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
score?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
thumbnail?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
type?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
width?: number  | null;
}
