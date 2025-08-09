
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaTorrent} from '../../anilibriaTorrent/entities/anilibriaTorrent.entity'


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
  type: () => AnilibriaTorrent,
  required: false,
})
torrent?: AnilibriaTorrent ;
}
