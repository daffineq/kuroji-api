
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaTorrentDto} from '../../anilibriaTorrent/dto/connect-anilibriaTorrent.dto'

export class CreateAnilibriaTorrentColorTorrentRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentDto,
})
connect: ConnectAnilibriaTorrentDto ;
  }

@ApiExtraModels(ConnectAnilibriaTorrentDto,CreateAnilibriaTorrentColorTorrentRelationInputDto)
export class CreateAnilibriaTorrentColorDto {
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
description?: string  | null;
@ApiProperty({
  type: CreateAnilibriaTorrentColorTorrentRelationInputDto,
})
torrent: CreateAnilibriaTorrentColorTorrentRelationInputDto ;
}
