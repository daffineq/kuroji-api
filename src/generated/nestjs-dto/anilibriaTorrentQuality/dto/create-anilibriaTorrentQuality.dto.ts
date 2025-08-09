
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaTorrentDto} from '../../anilibriaTorrent/dto/connect-anilibriaTorrent.dto'

export class CreateAnilibriaTorrentQualityTorrentRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentDto,
})
connect: ConnectAnilibriaTorrentDto ;
  }

@ApiExtraModels(ConnectAnilibriaTorrentDto,CreateAnilibriaTorrentQualityTorrentRelationInputDto)
export class CreateAnilibriaTorrentQualityDto {
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
  type: CreateAnilibriaTorrentQualityTorrentRelationInputDto,
})
torrent: CreateAnilibriaTorrentQualityTorrentRelationInputDto ;
}
