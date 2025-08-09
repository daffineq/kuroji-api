
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity'
import {AnilibriaTorrentType} from '../../anilibriaTorrentType/entities/anilibriaTorrentType.entity'
import {AnilibriaTorrentColor} from '../../anilibriaTorrentColor/entities/anilibriaTorrentColor.entity'
import {AnilibriaTorrentCodec} from '../../anilibriaTorrentCodec/entities/anilibriaTorrentCodec.entity'
import {AnilibriaTorrentQuality} from '../../anilibriaTorrentQuality/entities/anilibriaTorrentQuality.entity'


export class AnilibriaTorrent {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilibriaId: number ;
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
@ApiProperty({
  type: () => Anilibria,
  required: false,
})
anilibria?: Anilibria ;
@ApiProperty({
  type: () => AnilibriaTorrentType,
  required: false,
  nullable: true,
})
type?: AnilibriaTorrentType  | null;
@ApiProperty({
  type: () => AnilibriaTorrentColor,
  required: false,
  nullable: true,
})
color?: AnilibriaTorrentColor  | null;
@ApiProperty({
  type: () => AnilibriaTorrentCodec,
  required: false,
  nullable: true,
})
codec?: AnilibriaTorrentCodec  | null;
@ApiProperty({
  type: () => AnilibriaTorrentQuality,
  required: false,
  nullable: true,
})
quality?: AnilibriaTorrentQuality  | null;
}
