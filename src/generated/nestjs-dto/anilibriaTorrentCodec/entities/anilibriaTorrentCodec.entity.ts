
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaTorrent} from '../../anilibriaTorrent/entities/anilibriaTorrent.entity'


export class AnilibriaTorrentCodec {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
torrentId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
value: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
label: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
label_color: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
label_is_visible: boolean  | null;
@ApiProperty({
  type: () => AnilibriaTorrent,
  required: false,
})
torrent?: AnilibriaTorrent ;
}
