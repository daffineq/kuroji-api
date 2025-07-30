
import {ApiProperty} from '@nestjs/swagger'


export class AnilistExternalLinkDto {
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
site: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
siteId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
color: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
icon: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
notes: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isDisabled: boolean  | null;
}
