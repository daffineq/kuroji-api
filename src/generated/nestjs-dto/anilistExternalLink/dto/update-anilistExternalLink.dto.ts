
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistExternalLinkDto {
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
site?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
siteId?: number  | null;
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
language?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
color?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
icon?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
notes?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isDisabled?: boolean  | null;
}
