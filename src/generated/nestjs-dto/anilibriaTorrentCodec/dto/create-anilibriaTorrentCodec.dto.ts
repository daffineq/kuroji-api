
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaTorrentDto} from '../../anilibriaTorrent/dto/connect-anilibriaTorrent.dto'

export class CreateAnilibriaTorrentCodecTorrentRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentDto,
})
connect: ConnectAnilibriaTorrentDto ;
  }

@ApiExtraModels(ConnectAnilibriaTorrentDto,CreateAnilibriaTorrentCodecTorrentRelationInputDto)
export class CreateAnilibriaTorrentCodecDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
value?: string  | null;
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
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
label_color?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
label_is_visible?: boolean  | null;
@ApiProperty({
  type: CreateAnilibriaTorrentCodecTorrentRelationInputDto,
})
torrent: CreateAnilibriaTorrentCodecTorrentRelationInputDto ;
}
