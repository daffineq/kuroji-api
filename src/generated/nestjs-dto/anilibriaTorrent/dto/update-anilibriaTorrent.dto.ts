
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaTorrentDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
hash?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int64',
  required: false,
  nullable: true,
})
size?: bigint  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
label?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
magnet?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
filename?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
seeders?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
bitrate?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
leechers?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
sort_order?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
updated_at?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_hardsub?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
created_at?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
completed_times?: number  | null;
}
