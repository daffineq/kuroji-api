
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaTorrentDto} from '../../anilibriaTorrent/dto/connect-anilibriaTorrent.dto'

export class CreateAnilibriaTorrentTypeTorrentRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentDto,
})
connect: ConnectAnilibriaTorrentDto ;
  }

@ApiExtraModels(ConnectAnilibriaTorrentDto,CreateAnilibriaTorrentTypeTorrentRelationInputDto)
export class CreateAnilibriaTorrentTypeDto {
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
  type: CreateAnilibriaTorrentTypeTorrentRelationInputDto,
})
torrent: CreateAnilibriaTorrentTypeTorrentRelationInputDto ;
}
