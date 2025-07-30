
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'
import {ConnectAnilibriaTorrentTypeDto} from '../../anilibriaTorrentType/dto/connect-anilibriaTorrentType.dto.js'
import {ConnectAnilibriaTorrentColorDto} from '../../anilibriaTorrentColor/dto/connect-anilibriaTorrentColor.dto.js'
import {ConnectAnilibriaTorrentCodecDto} from '../../anilibriaTorrentCodec/dto/connect-anilibriaTorrentCodec.dto.js'
import {ConnectAnilibriaTorrentQualityDto} from '../../anilibriaTorrentQuality/dto/connect-anilibriaTorrentQuality.dto.js'

export class CreateAnilibriaTorrentAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }
export class CreateAnilibriaTorrentTypeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentTypeDto,
})
connect: ConnectAnilibriaTorrentTypeDto ;
  }
export class CreateAnilibriaTorrentColorRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentColorDto,
})
connect: ConnectAnilibriaTorrentColorDto ;
  }
export class CreateAnilibriaTorrentCodecRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentCodecDto,
})
connect: ConnectAnilibriaTorrentCodecDto ;
  }
export class CreateAnilibriaTorrentQualityRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTorrentQualityDto,
})
connect: ConnectAnilibriaTorrentQualityDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaTorrentAnilibriaRelationInputDto,ConnectAnilibriaTorrentTypeDto,CreateAnilibriaTorrentTypeRelationInputDto,ConnectAnilibriaTorrentColorDto,CreateAnilibriaTorrentColorRelationInputDto,ConnectAnilibriaTorrentCodecDto,CreateAnilibriaTorrentCodecRelationInputDto,ConnectAnilibriaTorrentQualityDto,CreateAnilibriaTorrentQualityRelationInputDto)
export class CreateAnilibriaTorrentDto {
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
@ApiProperty({
  type: CreateAnilibriaTorrentAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaTorrentAnilibriaRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaTorrentTypeRelationInputDto,
})
type?: CreateAnilibriaTorrentTypeRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaTorrentColorRelationInputDto,
})
color?: CreateAnilibriaTorrentColorRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaTorrentCodecRelationInputDto,
})
codec?: CreateAnilibriaTorrentCodecRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaTorrentQualityRelationInputDto,
})
quality?: CreateAnilibriaTorrentQualityRelationInputDto ;
}
