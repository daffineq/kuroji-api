
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaTorrentDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
hash: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int64',
  nullable: true,
})
size: bigint  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
label: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
magnet: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
filename: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
seeders: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
bitrate: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
leechers: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
sort_order: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
updated_at: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
is_hardsub: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
created_at: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
completed_times: number  | null;
}
