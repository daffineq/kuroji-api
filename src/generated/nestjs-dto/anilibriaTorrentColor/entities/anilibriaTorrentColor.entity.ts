
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaTorrent} from '../../anilibriaTorrent/entities/anilibriaTorrent.entity.js'


export class AnilibriaTorrentColor {
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
description: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
torrent?: AnilibriaTorrent ;
}
